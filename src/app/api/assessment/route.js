import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request) {
  try {
    const assessments = await prisma.assessment.findMany({
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
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(assessments)
  } catch (error) {
    console.error("Error fetching assessments:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    // Assume userId is passed or from session
    const userId = 1 // For demo, use first user

    const assessment = await prisma.assessment.create({
      data: {
        userId,
        incidentId: body.incidentId ? parseInt(body.incidentId) : null,
        type: body.type || "bencana",
        data: body,
      }
    })

    return NextResponse.json({ message: "Assessment saved", id: assessment.id }, { status: 201 })
  } catch (error) {
    console.error("Assessment save error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const assessment = await prisma.assessment.update({
      where: { id: parseInt(id) },
      data: {
        data: updateData,
      }
    })

    return NextResponse.json({ message: "Assessment updated", id: assessment.id })
  } catch (error) {
    console.error("Assessment update error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    await prisma.assessment.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: "Assessment deleted" })
  } catch (error) {
    console.error("Assessment delete error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
