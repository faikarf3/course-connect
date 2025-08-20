import { NextRequest, NextResponse } from 'next/server'
import { resendVerificationEmail } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    await resendVerificationEmail(email.toLowerCase())

    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send verification email' },
      { status: 400 }
    )
  }
}