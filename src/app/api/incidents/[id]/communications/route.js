import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request, { params }) {
  try {
    const { id } = params
    const communications = await prisma.communication.findMany({
      where: { incidentId: parseInt(id) },
      include: {
        user: { select: { namaLengkap: true } }
      },
      orderBy: { createdAt: "asc" }
    })
    return NextResponse.json(communications)
  } catch (error) {
    console.error("Error fetching communications:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const userId = 1 // For demo - should get from session

    const communication = await prisma.communication.create({
      data: {
        incidentId: parseInt(id),
        userId: userId,
        message: body.message
      },
      include: {
        user: { select: { namaLengkap: true } }
      }
    })
    return NextResponse.json(communication, { status: 201 })
  } catch (error) {
    console.error("Error creating communication:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
