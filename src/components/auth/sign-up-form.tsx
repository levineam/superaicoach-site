'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type SignUpResponse = {
  ok?: boolean
  error?: string
  userId?: string
}

export function SignUpForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const payload = (await response.json()) as SignUpResponse

      if (payload.ok) {
        router.push('/member')
      } else {
        setError(payload.error || 'Sign-up failed. Please try again.')
      }
    } catch {
      setError('Unable to reach auth service. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-foreground">Create your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign up to access your curated AI stack.
      </p>

      {error ? (
        <p className="mt-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <form className="mt-5 space-y-3" onSubmit={onSubmit}>
        <label className="space-y-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Email
          </span>
          <Input
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Password
          </span>
          <Input
            type="password"
            required
            autoComplete="new-password"
            placeholder="At least 8 characters"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/sign-in" className="underline underline-offset-4 hover:text-foreground">
          Sign in
        </Link>
      </p>
    </div>
  )
}
