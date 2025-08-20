import { NextRequest, NextResponse } from 'next/server'
import { verifyEmail } from '@/lib/auth'
import { verifyEmailSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validationResult = verifyEmailSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }

    const { email, code } = validationResult.data

    await verifyEmail(email.toLowerCase(), code.toUpperCase())

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Email verification error:', error)
    
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 400 }
    )
  }
}