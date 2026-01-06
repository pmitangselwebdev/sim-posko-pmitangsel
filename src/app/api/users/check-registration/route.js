import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const body = await request.json()
    const { email } = body

    console.log('Checking registration for email:', email)

    if (!email) {
      console.log('No email provided')
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { isApproved: true, id: true }
    })

    console.log('User found:', user ? 'yes' : 'no')

    if (!user) {
      console.log('User needs registration')
      return NextResponse.json({ needsRegistration: true })
    }

    console.log('User isApproved:', user.isApproved)
    return NextResponse.json({
      needsRegistration: false,
      isApproved: user.isApproved
    })
  } catch (error) {
    console.error('Error checking registration:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Failed to check registration status', details: error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
