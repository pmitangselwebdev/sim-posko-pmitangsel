import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request) {
  try {
    console.log("Attempting to fetch users from database...")

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '1000')
    const approvedParam = searchParams.get('approved')

    // Determine filter based on approved parameter
    let whereClause = {}
    if (approvedParam === 'true') {
      whereClause = { isApproved: true }
    } else if (approvedParam === 'false') {
      whereClause = { isApproved: false }
    } else if (approvedParam === 'null' || approvedParam === null || approvedParam === undefined) {
      // If approvedParam is 'null', null, or not provided, fetch all users
      whereClause = {}
    }

    // Use a more efficient query that only selects needed fields
    const users = await prisma.user.findMany({
      where: whereClause,
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
      skip: (page - 1) * limit,
      take: limit
    })

    console.log(`Successfully fetched ${users.length} users (approved filter: ${approvedParam})`)
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
