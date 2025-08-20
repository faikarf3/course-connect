import { supabase, supabaseAdmin } from './supabase'
import { sendVerificationEmail } from './email'

export function generateVerificationCode(): string {
  return require('crypto').randomBytes(16).toString('hex').toUpperCase()
}

export async function createUser(email: string, password: string) {
  const verificationCode = generateVerificationCode()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  const { data: authUser, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
    }
  })

  if (authError) throw authError

  if (authUser.user) {
    const { error: codeError } = await supabaseAdmin
      .from('verification_codes')
      .insert({
        user_id: authUser.user.id,
        email: email,
        code: verificationCode,
        type: 'email_verification',
        expires_at: expiresAt.toISOString(),
      })

    if (codeError) throw codeError

    await sendVerificationEmail(email, verificationCode)
  }

  return authUser.user
}

export async function verifyEmail(email: string, code: string) {
  const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserByEmail(email)
  
  if (userError || !user) throw new Error('User not found')

  const { data: verificationCode, error: codeError } = await supabaseAdmin
    .from('verification_codes')
    .select('*')
    .eq('user_id', user.id)
    .eq('code', code)
    .eq('type', 'email_verification')
    .eq('used', false)
    .single()

  if (codeError) throw new Error('Invalid verification code')

  if (new Date() > new Date(verificationCode.expires_at)) {
    throw new Error('Verification code expired')
  }

  await supabaseAdmin
    .from('verification_codes')
    .update({ used: true })
    .eq('id', verificationCode.id)

  const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    email_confirm: true
  })

  if (confirmError) throw confirmError

  return true
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.includes('Email not confirmed')) {
      throw new Error('Please verify your email before logging in')
    }
    throw error
  }

  return data.user
}

export async function resendVerificationEmail(email: string) {
  const verificationCode = generateVerificationCode()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserByEmail(email)
  
  if (userError || !user) throw new Error('User not found')

  await supabaseAdmin
    .from('verification_codes')
    .update({ used: true })
    .eq('user_id', user.id)
    .eq('type', 'email_verification')
    .eq('used', false)

  const { error: codeError } = await supabaseAdmin
    .from('verification_codes')
    .insert({
      user_id: user.id,
      email: email,
      code: verificationCode,
      type: 'email_verification',
      expires_at: expiresAt.toISOString(),
    })

  if (codeError) throw codeError

  return await sendVerificationEmail(email, verificationCode)
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}