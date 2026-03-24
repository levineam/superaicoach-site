import Link from 'next/link'

import { Navbar } from '@/components/navbar'
import { SignUpForm } from '@/components/auth/sign-up-form'

export default function SignUpPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 pt-16">
        <div className="flex w-full max-w-md flex-col gap-6">
          <Link href="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            ← Back to SuperAIcoach site
          </Link>

          <SignUpForm />
        </div>
      </main>
    </>
  )
}
