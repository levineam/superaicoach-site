import Link from 'next/link'

import { Navbar } from '@/components/navbar'
import { SignInForm } from '@/components/auth/sign-in-form'

type SignInPageProps = {
  searchParams: Promise<{
    error?: string
    next?: string
    email?: string
  }>
}

function mapError(error?: string): string | undefined {
  if (!error) return undefined

  switch (error) {
    case 'missing-token':
      return 'Your sign-in link is missing a token. Request a new link.'
    case 'invalid-token':
      return 'This sign-in link is invalid or already used. Request a new link.'
    case 'session-expired':
      return 'Your session expired. Please sign in again.'
    default:
      return 'Sign-in failed. Please request a new link.'
  }
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 pt-16">
        <div className="flex w-full max-w-md flex-col gap-6">
          <Link href="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            ← Back to SuperAIcoach site
          </Link>

          <SignInForm
            initialEmail={params.email}
            nextPath={params.next}
            error={mapError(params.error)}
          />
        </div>
      </main>
    </>
  )
}
