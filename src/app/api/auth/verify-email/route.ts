import { NextRequest, NextResponse } from 'next/server'
import { verifyEmail } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      )
    }

    await verifyEmail(email.toLowerCase(), code.toUpperCase())

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Email verification error:', error)
    
    if (error.message === 'User not found') {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 404 }
      )
    }
    
    if (error.message === 'Invalid verification code') {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }
    
    if (error.message === 'Verification code expired') {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}