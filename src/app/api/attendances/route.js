import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const userId = searchParams.get('userId')

    let where = {}
    if (date) {
      where.tanggal = new Date(date)
    }
    if (userId) {
      where.userId = parseInt(userId)
    }

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        user: {
          select: {
            namaLengkap: true,
            spesialisasi: true,
            subRole: true
          }
        }
      },
      orderBy: [
        { tanggal: 'desc' },
        { user: { namaLengkap: 'asc' } }
      ]
    })
    return NextResponse.json(attendances)
  } catch (error) {
    console.error("Error fetching attendances:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const today = new Date().toISOString().split('T')[0]

    // Check if attendance already exists for today
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        userId_tanggal: {
          userId: parseInt(body.userId),
          tanggal: new Date(today)
        }
      }
    })

    if (body.action === 'check-in') {
      if (existingAttendance && existingAttendance.checkIn) {
        return NextResponse.json({ error: "Sudah check-in hari ini" }, { status: 400 })
      }

      const attendance = await prisma.attendance.upsert({
        where: {
          userId_tanggal: {
            userId: parseInt(body.userId),
            tanggal: new Date(today)
          }
        },
        update: {
          checkIn: new Date(),
          status: 'present',
          shift: body.shift,
          posko: body.posko
        },
        create: {
          userId: parseInt(body.userId),
          tanggal: new Date(today),
          checkIn: new Date(),
          status: 'present',
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

      // Update user status to "bertugas" when checked in
      await prisma.user.update({
        where: { id: parseInt(body.userId) },
        data: { status: 'bertugas' }
      })
      return NextResponse.json(attendance, { status: 201 })
    }

    if (body.action === 'check-out') {
      if (!existingAttendance || !existingAttendance.checkIn) {
        return NextResponse.json({ error: "Belum check-in hari ini" }, { status: 400 })
      }

      const attendance = await prisma.attendance.update({
        where: {
          userId_tanggal: {
            userId: parseInt(body.userId),
            tanggal: new Date(today)
          }
        },
        data: {
          checkOut: new Date(),
          notes: body.notes
        },
        include: {
          user: {
            select: {
              namaLengkap: true
            }
          }
        }
      })
      return NextResponse.json(attendance)
    }

    return NextResponse.json({ error: "Action tidak valid" }, { status: 400 })
  } catch (error) {
    console.error("Error updating attendance:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()

    const attendance = await prisma.attendance.update({
      where: { id: parseInt(body.id) },
      data: {
        status: body.status,
        notes: body.notes,
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
    return NextResponse.json(attendance)
  } catch (error) {
    console.error("Error updating attendance:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
