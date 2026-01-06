import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const { isApproved } = await request.json()

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { isApproved }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user approval:', error)
    return NextResponse.json(
      { error: 'Failed to update user approval' },
      { status: 500 }
    )
  }
}
