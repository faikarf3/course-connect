import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'
import { loginSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }

    const { email, password } = validationResult.data

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
    
    return NextResponse.json(
      { error: 'Invalid credentials. Please try again.' },
      { status: 401 }
    )
  }
}