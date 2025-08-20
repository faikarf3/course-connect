import { Suspense } from 'react'
import VerifyEmail from '@/components/auth/VerifyEmail'

function VerifyEmailContent() {
  return <VerifyEmail />
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}