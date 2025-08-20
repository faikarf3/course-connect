import { supabase } from './supabase'

export async function sendVerificationEmail(email: string, code: string) {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email?code=${code}`
    }
  })

  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`)
  }

  return data
}

export async function sendPasswordResetEmail(email: string, code: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?code=${code}`
  })

  if (error) {
    throw new Error(`Failed to send password reset email: ${error.message}`)
  }

  return data
}
