import { z } from 'zod'

export const emailSchema = z.string()
  .email('Invalid email address')
  .min(1, 'Email is required')
  .max(254, 'Email address too long')

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')

export const verificationCodeSchema = z.string()
  .min(1, 'Verification code is required')
  .max(64, 'Verification code too long')

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
})

export const verifyEmailSchema = z.object({
  email: emailSchema,
  code: verificationCodeSchema
})

export const resendVerificationSchema = z.object({
  email: emailSchema
})