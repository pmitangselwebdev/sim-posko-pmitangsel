import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const bloodStocks = await prisma.bloodStock.findMany({
      orderBy: { type: "asc" }
    })
    return NextResponse.json(bloodStocks)
  } catch (error) {
    console.error("Error fetching blood stock:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const bloodStock = await prisma.bloodStock.create({
      data: {
        type: body.type,
        quantity: body.quantity
      }
    })
    return NextResponse.json(bloodStock, { status: 201 })
  } catch (error) {
    console.error("Error creating blood stock:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const bloodStock = await prisma.bloodStock.update({
      where: { id: parseInt(id) },
      data: updateData
    })
    return NextResponse.json(bloodStock)
  } catch (error) {
    console.error("Error updating blood stock:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
