import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registerWithPassword } from '@/lib/mission-control/auth'
import { SESSION_COOKIE_NAME } from '@/lib/mission-control/session'

async function signUp(formData: FormData) {
  'use server'

  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const confirmPassword = String(formData.get('confirmPassword') ?? '')

  const search = new URLSearchParams()
  if (email) search.set('email', email)

  if (!email || !password || !confirmPassword) {
    search.set('error', 'Email and password are required.')
    redirect(`/sign-up?${search.toString()}`)
  }

  if (password !== confirmPassword) {
    search.set('error', 'Passwords do not match.')
    redirect(`/sign-up?${search.toString()}`)
  }

  if (password.length < 8) {
    search.set('error', 'Password must be at least 8 characters.')
    redirect(`/sign-up?${search.toString()}`)
  }

  const result = await registerWithPassword(email, password)

  if ('error' in result) {
    search.set('error', result.error)
    redirect(`/sign-up?${search.toString()}`)
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, result.sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  redirect('/member')
}

type SignUpPageProps = {
  searchParams: Promise<{
    error?: string
    email?: string
  }>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 pt-16">
        <div className="flex w-full max-w-md flex-col gap-6">
          <Link href="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            ← Back to SuperAIcoach site
          </Link>

          <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-foreground">Create your account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Create a member account to access your dashboard.
            </p>

            {params.error ? (
              <p className="mt-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {params.error}
              </p>
            ) : null}

            <form action={signUp} className="mt-5 space-y-3">
              <label className="space-y-1">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Email
                </span>
                <Input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  defaultValue={params.email ?? ''}
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Password
                </span>
                <Input
                  type="password"
                  name="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  minLength={8}
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Confirm password
                </span>
                <Input
                  type="password"
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  minLength={8}
                />
              </label>

              <Button type="submit" className="w-full">
                Create account
              </Button>
            </form>

            <p className="mt-4 text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/sign-in" className="underline underline-offset-4 hover:text-foreground">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
