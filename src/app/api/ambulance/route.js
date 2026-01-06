import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const ambulanceForms = await prisma.ambulanceForm.findMany({
      include: {
        user: {
          select: {
            namaLengkap: true,
            spesialisasi: true
          }
        },
        incident: {
          select: {
            type: true,
            location: true,
            date: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(ambulanceForms)
  } catch (error) {
    console.error("Error fetching ambulance forms:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const userId = 1 // For demo

    const ambulanceForm = await prisma.ambulanceForm.create({
      data: {
        userId,
        incidentId: body.incidentId ? parseInt(body.incidentId) : null,
        data: body,
      }
    })

    return NextResponse.json({ message: "Ambulance form saved", id: ambulanceForm.id }, { status: 201 })
  } catch (error) {
    console.error("Ambulance form save error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
