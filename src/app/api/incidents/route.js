import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        assessments: {
          include: { user: { select: { namaLengkap: true } } }
        },
        ambulanceForms: {
          include: { user: { select: { namaLengkap: true } } }
        },
        logistics: {
          include: { user: { select: { namaLengkap: true } } }
        },
        communications: {
          include: { user: { select: { namaLengkap: true } } },
          orderBy: { createdAt: "asc" }
        }
      }
    })
    return NextResponse.json(incidents)
  } catch (error) {
    console.error("Error fetching incidents:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const incident = await prisma.incident.create({
      data: {
        type: body.type,
        location: body.location,
        date: new Date(body.date),
        description: body.description,
        status: "active"
      }
    })
    return NextResponse.json(incident, { status: 201 })
  } catch (error) {
    console.error("Error creating incident:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const incident = await prisma.incident.update({
      where: { id: parseInt(id) },
      data: updateData
    })
    return NextResponse.json(incident)
  } catch (error) {
    console.error("Error updating incident:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    await prisma.incident.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: "Incident deleted" })
  } catch (error) {
    console.error("Error deleting incident:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
