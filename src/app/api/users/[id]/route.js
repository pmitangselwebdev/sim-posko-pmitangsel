import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request, { params }) {
  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
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
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        namaLengkap: body.namaLengkap,
        email: body.email,
        nomorHandphone: body.nomorHandphone,
        spesialisasi: body.spesialisasi,
        role: body.role,
        subRole: body.subRole,
        status: body.status,
        isApproved: body.isApproved,
        updatedAt: new Date()
      },
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
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 })
    }
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    // Check if user exists first
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 })
    }

    // Force delete: Remove all related records first, then delete the user
    console.log(`Force deleting user ${id} and all related records...`)

    // Delete related records in the correct order to avoid foreign key constraints
    await prisma.attendance.deleteMany({
      where: { userId: parseInt(id) }
    })

    await prisma.report.deleteMany({
      where: { userId: parseInt(id) }
    })

    await prisma.training.deleteMany({
      where: { userId: parseInt(id) }
    })

    await prisma.schedule.deleteMany({
      where: { userId: parseInt(id) }
    })

    await prisma.assessment.deleteMany({
      where: { userId: parseInt(id) }
    })

    await prisma.ambulanceForm.deleteMany({
      where: { userId: parseInt(id) }
    })

    await prisma.logistics.deleteMany({
      where: { userId: parseInt(id) }
    })

    await prisma.checklist.deleteMany({
      where: { userId: parseInt(id) }
    })

    await prisma.communication.deleteMany({
      where: { userId: parseInt(id) }
    })

    // Finally delete the user
    await prisma.user.delete({
      where: { id: parseInt(id) }
    })

    console.log(`Successfully deleted user ${id} and all related records`)
    return NextResponse.json({ message: "Personel berhasil dihapus secara permanen beserta semua data terkait." })
  } catch (error) {
    console.error("Error force deleting user:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server saat menghapus personel" }, { status: 500 })
  }
}
