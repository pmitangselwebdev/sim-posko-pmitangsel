import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const logistics = await prisma.logistics.findMany({
      include: {
        user: {
          select: {
            namaLengkap: true
          }
        },
        incident: {
          select: {
            type: true,
            location: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(logistics)
  } catch (error) {
    console.error("Error fetching logistics:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const userId = 1 // For demo

    const logistics = await prisma.logistics.create({
      data: {
        userId,
        incidentId: body.incidentId ? parseInt(body.incidentId) : null,
        data: body,
      }
    })

    return NextResponse.json({ message: "Logistics saved", id: logistics.id }, { status: 201 })
  } catch (error) {
    console.error("Logistics save error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
