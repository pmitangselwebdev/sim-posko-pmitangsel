import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Webhook } from "svix"
import { headers } from "next/headers"

export async function POST(request) {
  try {
    // Get the headers
    const headersList = await headers()
    const svix_id = headersList.get("svix-id")
    const svix_timestamp = headersList.get("svix-timestamp")
    const svix_signature = headersList.get("svix-signature")

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error occurred -- no svix headers", {
        status: 400,
      })
    }

    // Get the body
    const payload = await request.json()
    const body = JSON.stringify(payload)

    // Create a new Webhook instance with your webhook secret
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "")

    let evt

    // Verify the webhook
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      })
    } catch (err) {
      console.log("Error verifying webhook:", err.message)
      return new Response("Error occurred", {
        status: 400,
      })
    }

    // Get the ID and type
    const { id } = evt.data
    const eventType = evt.type

    console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
    console.log("Webhook body:", body)

    // Handle the event
    if (eventType === "user.created") {
      const { id: clerkId, email_addresses, first_name, last_name } = evt.data

      // Get the primary email
      const primaryEmail = email_addresses?.[0]?.email_address

      if (!primaryEmail) {
        console.log("No email found for user:", clerkId)
        return new Response("", { status: 200 })
      }

      // Check if user already exists in our database
      const existingUser = await prisma.user.findUnique({
        where: { email: primaryEmail }
      })

      if (existingUser) {
        console.log("User already exists in database:", primaryEmail)
        return new Response("", { status: 200 })
      }

      // Create user in our database
      const newUser = await prisma.user.create({
        data: {
          namaLengkap: `${first_name || ""} ${last_name || ""}`.trim() || "User",
          email: primaryEmail,
          nomorHandphone: "", // Will be filled later
          spesialisasi: "Relawan", // Default specialization
          role: "Petugas", // Default role
          subRole: "posko", // Default sub-role
          status: "siaga", // Default status
          isApproved: false, // New users need approval
          ttl: new Date(), // Default TTL
          jenisKelamin: "Laki-laki", // Default gender
          alamat: "", // Will be filled later
          golonganDarah: "A+", // Default blood type
          asalPMI: "PMI Kota Tangerang Selatan",
          pesan: ""
        }
      })

      console.log("Created new user in database:", newUser.email, "ID:", newUser.id)
    }

    if (eventType === "user.updated") {
      const { email_addresses } = evt.data
      const primaryEmail = email_addresses?.[0]?.email_address

      if (!primaryEmail) {
        console.log("No email found for updated user")
        return new Response("", { status: 200 })
      }

      // Update user in our database if needed
      // For now, we don't need to update anything on user updates
      console.log("User updated in Clerk:", primaryEmail)
    }

    if (eventType === "user.deleted") {
      const { email_addresses } = evt.data
      const primaryEmail = email_addresses?.[0]?.email_address

      if (!primaryEmail) {
        console.log("No email found for deleted user")
        return new Response("", { status: 200 })
      }

      // Optionally mark user as inactive or delete from our database
      // For now, we'll just log it
      console.log("User deleted in Clerk:", primaryEmail)
    }

    return new Response("", { status: 200 })
  } catch (error) {
    console.error("Webhook error:", error)
    return new Response("Webhook error", { status: 500 })
  }
}
