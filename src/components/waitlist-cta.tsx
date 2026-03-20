'use client'

import * as React from 'react'
import { ArrowRight, Check, Loader2 } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/track'

export type WaitlistCTAProps = {
  source?: string
  label?: string
  buttonClassName?: string
  containerClassName?: string
  buttonSize?: React.ComponentProps<typeof Button>['size']
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export function WaitlistCTA({
  source = 'unknown',
  label = 'Join the Waitlist',
  buttonClassName,
  containerClassName,
  buttonSize = 'lg',
}: WaitlistCTAProps) {
  const pathname = usePathname()
  const [showForm, setShowForm] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [state, setState] = React.useState<SubmitState>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!email.trim()) return

    setState('submitting')
    setErrorMessage('')

    trackEvent('waitlist_submit', {
      source,
      page: pathname,
      email: email.trim(),
    })

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (res.ok) {
        setState('success')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMessage(data.error || 'Something went wrong. Try again.')
        setState('error')
      }
    } catch {
      setErrorMessage('Unable to reach the server. Try again.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className={cn('flex flex-col items-center gap-2', containerClassName)}>
        <div className="flex items-center gap-2 rounded-full bg-accent/10 px-5 py-3 text-accent">
          <Check className="h-5 w-5" />
          <span className="text-base font-semibold">You&apos;re on the list!</span>
        </div>
        <p className="text-sm text-muted-foreground">
          We&apos;ll email you when spots open.
        </p>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className={cn('flex flex-col items-center gap-2', containerClassName)}>
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-sm items-center gap-2"
        >
          <Input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-full px-5"
            disabled={state === 'submitting'}
          />
          <Button
            type="submit"
            size={buttonSize}
            disabled={state === 'submitting'}
            className={cn(
              'bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6 h-12 shrink-0',
              buttonClassName,
            )}
          >
            {state === 'submitting' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Join
                <ArrowRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
        {state === 'error' && errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : null}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col items-center gap-2', containerClassName)}>
      <Button
        type="button"
        size={buttonSize}
        onClick={() => {
          setShowForm(true)
          trackEvent('waitlist_cta_click', {
            source,
            page: pathname,
            label,
          })
        }}
        className={cn(
          'bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 text-base font-semibold shadow-lg shadow-accent/20 h-12',
          buttonClassName,
        )}
      >
        {label}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
