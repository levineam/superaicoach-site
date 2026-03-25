'use client'

import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface MembershipWaitlistFormProps {
  source?: string
  buttonLabel?: string
}

export function MembershipWaitlistForm({
  source = 'default',
  buttonLabel = 'Get Early Access',
}: MembershipWaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return

    setStatus('loading')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, source }),
      })

      if (res.ok) {
        setStatus('success')
        setMessage("You're on the list! We'll be in touch soon.")
        setEmail('')
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-center text-sm font-medium text-green-600 dark:text-green-400">
        {message}
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          if (status === 'error') setStatus('idle')
        }}
        required
        className="flex-1"
        aria-label="Email address"
      />
      <Button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Joining…' : buttonLabel}
      </Button>
      {status === 'error' && message && (
        <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
      )}
    </form>
  )
}
