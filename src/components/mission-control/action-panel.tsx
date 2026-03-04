'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { ROLE_CAPABILITY_COPY } from '@/lib/mission-control/permissions'
import {
  type CustomerActionPolicy,
  type MembershipRole,
} from '@/lib/mission-control/types'

interface ActionApiResponse {
  ok?: boolean
  error?: string
  summary?: string
  requestId?: string
  message?: string
  confirmationHint?: string
}

export function MissionControlActionPanel({
  actions,
  role,
  pilotMode,
}: {
  actions: CustomerActionPolicy[]
  role: MembershipRole
  pilotMode: boolean
}) {
  const [message, setMessage] = useState<string | null>(null)
  const [busyAction, setBusyAction] = useState<string | null>(null)

  async function triggerAction(actionId: string, confirmed = false) {
    setBusyAction(actionId)
    setMessage(null)

    try {
      const response = await fetch('/api/mission-control/actions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ actionId, confirmed }),
      })

      const payload = (await response.json()) as ActionApiResponse

      if (response.status === 428) {
        const shouldConfirm = window.confirm(
          payload.message ||
            'Please confirm you want to run this action. It stays within customer-safe boundaries.',
        )

        if (shouldConfirm) {
          await triggerAction(actionId, true)
          return
        }

        setMessage('Action cancelled before execution.')
        return
      }

      if (!response.ok) {
        setMessage(payload.error || 'Action failed.')
        return
      }

      setMessage(`${payload.summary || 'Action completed.'} (request ${payload.requestId})`)
    } catch {
      setMessage('Failed to reach Mission Control action API.')
    } finally {
      setBusyAction(null)
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-lg font-semibold text-foreground">Approved actions</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Role: <span className="font-medium text-foreground">{ROLE_CAPABILITY_COPY[role].label}</span>
        {pilotMode ? ' · Pilot mode active (Vai safe slice)' : ''}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{ROLE_CAPABILITY_COPY[role].summary}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <div key={action.id} className="rounded-lg border border-border p-3">
            <p className="text-sm font-medium text-foreground">{action.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
              Risk: {action.riskLevel}
              {action.requiresConfirmation ? ' · requires confirmation' : ''}
            </p>
            <Button
              className="mt-3 w-full"
              size="sm"
              variant={action.riskLevel === 'medium' ? 'outline' : 'secondary'}
              disabled={busyAction === action.id}
              onClick={() => void triggerAction(action.id)}
            >
              {busyAction === action.id ? 'Running…' : action.label}
            </Button>
          </div>
        ))}
      </div>

      {message ? (
        <p className="mt-4 rounded-md border border-border bg-background p-3 text-xs text-muted-foreground">
          {message}
        </p>
      ) : null}
    </section>
  )
}
