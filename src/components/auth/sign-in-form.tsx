'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type MagicLinkResponse = {
  ok?: boolean
  error?: string
  magicLinkPreview?: string
  expiresAt?: string
  todo?: string
}

type PasswordResponse = {
  ok?: boolean
  error?: string
  tenantSlug?: string
}

type AuthMode = 'magic-link' | 'password'

export function SignInForm({
  initialEmail = '',
  nextPath,
  error,
}: {
  initialEmail?: string
  nextPath?: string
  error?: string
}) {
  const router = useRouter()
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [authMode, setAuthMode] = useState<AuthMode>('magic-link')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [magicLinkResponse, setMagicLinkResponse] = useState<MagicLinkResponse | null>(null)
  const [passwordResponse, setPasswordResponse] = useState<PasswordResponse | null>(null)

  const submitLabel = useMemo(() => {
    if (isSubmitting) {
      return authMode === 'password' ? 'Signing in…' : 'Generating magic link…'
    }
    return authMode === 'password' ? 'Sign in' : 'Send magic link'
  }, [isSubmitting, authMode])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setMagicLinkResponse(null)
    setPasswordResponse(null)

    try {
      if (authMode === 'password') {
        const apiResponse = await fetch('/api/auth/password', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })

        const payload = (await apiResponse.json()) as PasswordResponse

        if (payload.ok) {
          // Redirect to member area (or the requested next path)
          router.push(nextPath || '/member')
        } else {
          setPasswordResponse(payload)
        }
      } else {
        const apiResponse = await fetch('/api/auth/magic-link', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ email }),
        })

        const payload = (await apiResponse.json()) as MagicLinkResponse
        setMagicLinkResponse(payload)
      }
    } catch {
      if (authMode === 'password') {
        setPasswordResponse({ error: 'Unable to reach auth service. Try again.' })
      } else {
        setMagicLinkResponse({ error: 'Unable to reach auth service. Try again.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  function toggleAuthMode() {
    setAuthMode((prev) => (prev === 'magic-link' ? 'password' : 'magic-link'))
    setMagicLinkResponse(null)
    setPasswordResponse(null)
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-foreground">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in with your email to access your dashboard.
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
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        {authMode === 'password' ? (
          <label className="space-y-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Password
            </span>
            <Input
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
        ) : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={toggleAuthMode}
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          {authMode === 'password'
            ? 'Use magic link instead'
            : 'Sign in with password'}
        </button>
      </div>

      {magicLinkResponse?.magicLinkPreview ? (
        <div className="mt-4 rounded-md border border-emerald-600/30 bg-emerald-600/10 p-3 text-sm text-emerald-100">
          <p className="font-medium text-emerald-200">Magic link generated.</p>
          <p className="mt-1 text-emerald-100/90">
            MVP scaffold mode: email delivery is TODO, so your sign-in link is shown below.
          </p>
          <Link href={magicLinkResponse.magicLinkPreview} className="mt-2 block underline">
            Open sign-in link
          </Link>
          <p className="mt-1 text-xs text-emerald-100/80">Expires: {magicLinkResponse.expiresAt}</p>
        </div>
      ) : null}

      {magicLinkResponse?.error ? (
        <p className="mt-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {magicLinkResponse.error}
        </p>
      ) : null}

      {passwordResponse?.error ? (
        <p className="mt-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {passwordResponse.error}
        </p>
      ) : null}

      {nextPath ? (
        <p className="mt-4 text-xs text-muted-foreground">
          Requested path after sign-in: {nextPath}
        </p>
      ) : null}
    </div>
  )
}
