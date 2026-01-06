import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request) {
  try {
    const reports = await prisma.report.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error("Reports fetch error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const userId = 1 // For demo

    const report = await prisma.report.create({
      data: {
        userId,
        type: body.type,
        data: body,
      }
    })

    return NextResponse.json({ message: "Report saved", id: report.id }, { status: 201 })
  } catch (error) {
    console.error("Report save error:", error)
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

    await prisma.report.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: "Report deleted" })
  } catch (error) {
    console.error("Report delete error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
