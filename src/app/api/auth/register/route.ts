import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'
import { registerSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }

    const { email, password } = validationResult.data

    const user = await createUser(email.toLowerCase(), password)

    return NextResponse.json(
      { 
        message: 'Registration successful! Please check your email for verification link.',
        user: user ? { id: user.id, email: user.email } : null
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)
    
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 400 }
    )
  }
}