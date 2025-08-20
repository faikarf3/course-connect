import { NextRequest, NextResponse } from 'next/server'
import { resendVerificationEmail } from '@/lib/auth'
import { resendVerificationSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validationResult = resendVerificationSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }

    const { email } = validationResult.data

    await resendVerificationEmail(email.toLowerCase())

    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Failed to send verification email. Please try again.' },
      { status: 400 }
    )
  }
}