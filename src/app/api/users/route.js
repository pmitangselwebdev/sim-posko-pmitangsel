import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("Attempting to fetch users from database...")

    // Use a more efficient query that only selects needed fields
    const users = await prisma.user.findMany({
      where: { isApproved: true }, // Only approved users for dashboard
      select: {
        id: true,
        namaLengkap: true,
        jenisKelamin: true,
        spesialisasi: true,
        asalPMI: true,
        role: true,
        subRole: true,
        status: true,
        email: true,
        nomorHandphone: true,
        foto: true,
        isApproved: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: "desc" },
      // Limit for performance - dashboard doesn't need all users
      take: 1000
    })

    console.log(`Successfully fetched ${users.length} users`)
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta
    })
    return NextResponse.json({
      error: "Terjadi kesalahan server",
      details: error.message
    }, { status: 500 })
  }
}
