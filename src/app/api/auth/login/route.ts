import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await loginUser(email.toLowerCase(), password)

    return NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email
        }
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Login error:', error)
    
    if (error.message === 'Invalid credentials') {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    if (error.message === 'Email not verified') {
      return NextResponse.json(
        { error: 'Please verify your email before logging in' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}