import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const trainings = await prisma.training.findMany({
      include: {
        user: {
          select: {
            namaLengkap: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(trainings)
  } catch (error) {
    console.error("Error fetching trainings:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const training = await prisma.training.create({
      data: {
        userId: parseInt(body.userId),
        nama: body.nama,
        jenis: body.jenis,
        tanggal: new Date(body.tanggal),
        sertifikat: body.sertifikat
      },
      include: {
        user: {
          select: {
            namaLengkap: true
          }
        }
      }
    })
    return NextResponse.json(training, { status: 201 })
  } catch (error) {
    console.error("Error creating training:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
