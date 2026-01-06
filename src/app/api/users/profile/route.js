import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        namaLengkap: true,
        nomorHandphone: true,
        spesialisasi: true,
        role: true,
        subRole: true,
        alamat: true,
        golonganDarah: true,
        jenisKelamin: true,
        pesan: true,
        foto: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { email, ...updateData } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { email },
      data: updateData,
      select: {
        id: true,
        namaLengkap: true,
        nomorHandphone: true,
        spesialisasi: true,
        role: true,
        subRole: true,
        alamat: true,
        golonganDarah: true,
        jenisKelamin: true,
        pesan: true,
        foto: true,
        updatedAt: true
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    )
  }
}
