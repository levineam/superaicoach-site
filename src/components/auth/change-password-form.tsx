'use client'

import { FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type ChangePasswordResponse = {
  ok?: boolean
  error?: string
}

interface ChangePasswordFormProps {
  hasExistingPassword: boolean
  onSuccess?: () => void
}

export function ChangePasswordForm({ hasExistingPassword, onSuccess }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [response, setResponse] = useState<ChangePasswordResponse | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResponse(null)

    if (newPassword !== confirmPassword) {
      setResponse({ error: 'Passwords do not match' })
      return
    }

    if (newPassword.length < 8) {
      setResponse({ error: 'Password must be at least 8 characters' })
      return
    }

    setIsSubmitting(true)

    try {
      const apiResponse = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: hasExistingPassword ? currentPassword : undefined,
          newPassword,
          isSettingInitialPassword: !hasExistingPassword,
        }),
      })

      const payload = (await apiResponse.json()) as ChangePasswordResponse

      if (payload.ok) {
        setResponse({ ok: true })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        onSuccess?.()
      } else {
        setResponse(payload)
      }
    } catch {
      setResponse({ error: 'Failed to change password. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-foreground">
        {hasExistingPassword ? 'Change Password' : 'Set Password'}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {hasExistingPassword
          ? 'Update your password for email + password sign-in.'
          : 'Set a password to enable email + password sign-in alongside magic link.'}
      </p>

      <form className="mt-5 space-y-3" onSubmit={onSubmit}>
        {hasExistingPassword ? (
          <label className="space-y-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Current Password
            </span>
            <Input
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
          </label>
        ) : null}

        <label className="space-y-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            New Password
          </span>
          <Input
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
            minLength={8}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Confirm New Password
          </span>
          <Input
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </label>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving…'
            : hasExistingPassword
              ? 'Change Password'
              : 'Set Password'}
        </Button>
      </form>

      {response?.ok ? (
        <p className="mt-4 rounded-md border border-emerald-600/30 bg-emerald-600/10 p-3 text-sm text-emerald-200">
          Password {hasExistingPassword ? 'changed' : 'set'} successfully!
        </p>
      ) : null}

      {response?.error ? (
        <p className="mt-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {response.error}
        </p>
      ) : null}
    </div>
  )
}
