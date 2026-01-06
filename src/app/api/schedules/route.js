import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        user: {
          select: {
            namaLengkap: true
          }
        }
      },
      orderBy: { tanggal: "asc" }
    })
    return NextResponse.json(schedules)
  } catch (error) {
    console.error("Error fetching schedules:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const schedule = await prisma.schedule.create({
      data: {
        userId: parseInt(body.userId),
        tanggal: new Date(body.tanggal),
        shift: body.shift,
        posko: body.posko
      },
      include: {
        user: {
          select: {
            namaLengkap: true
          }
        }
      }
    })
    return NextResponse.json(schedule, { status: 201 })
  } catch (error) {
    console.error("Error creating schedule:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
