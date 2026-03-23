'use client'

import * as React from 'react'
import {
  BarChart2,
  BookOpen,
  CalendarCheck,
  CheckSquare,
  ClipboardList,
  FileText,
  Folders,
  Inbox,
  LayoutList,
  Mail,
  MessageSquare,
  Search,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/track'
import type { CoworkPack, ProfessionId } from '@/lib/cowork-packs/index'
import { packRegistry, VALID_PROFESSIONS } from '@/lib/cowork-packs/index'

// One icon per skill card slot (0-indexed, 6 per profession)
const SKILL_ICONS = [
  Folders,
  CalendarCheck,
  FileText,
  TrendingUp,
  Mail,
  ClipboardList,
] as const

const PROFESSION_TAB_ICONS: Record<ProfessionId, React.ElementType> = {
  'financial-advisor': BarChart2,
  attorney: BookOpen,
  executive: Target,
}

export function ProfessionSelector() {
  const [activeProfession, setActiveProfession] = React.useState<ProfessionId>('financial-advisor')
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = React.useState('')

  const pack: CoworkPack = packRegistry[activeProfession]

  function handleTabChange(profession: ProfessionId) {
    setActiveProfession(profession)
    setStatus('idle')
    setMessage('')
    trackEvent('cowork_profession_select', { profession })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) {
      setStatus('error')
      setMessage('Please enter your email.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/cowork-starter-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          profession: activeProfession,
          source: 'cowork',
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string; error?: string }
        | null

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || 'Something went wrong. Please try again.')
      }

      trackEvent('cowork_pack_request', { profession: activeProfession, source: 'cowork' })

      setEmail('')
      setStatus('success')
      setMessage(payload.message || 'Check your inbox — your starter pack is on its way.')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="w-full">
      {/* Tab selector */}
      <div className="flex flex-wrap gap-2 sm:gap-3" role="tablist" aria-label="Select profession">
        {VALID_PROFESSIONS.map((id) => {
          const p = packRegistry[id]
          const Icon = PROFESSION_TAB_ICONS[id]
          const isActive = id === activeProfession
          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`profession-panel-${id}`}
              onClick={() => handleTabChange(id)}
              className={cn(
                'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                isActive
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border/60 bg-card/40 text-muted-foreground hover:border-accent/50 hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {p.label}
            </button>
          )
        })}
      </div>

      {/* Skill cards */}
      <div
        id={`profession-panel-${activeProfession}`}
        role="tabpanel"
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-label={`${pack.label} skill cards`}
      >
        {pack.skillCards.map((card, index) => {
          const Icon = SKILL_ICONS[index % SKILL_ICONS.length]
          return (
            <div
              key={card.title}
              className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-xl"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
                <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold leading-snug text-foreground">{card.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {card.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Email capture */}
      <div className="mt-10 rounded-3xl border border-border/60 bg-card/30 p-6 backdrop-blur-xl sm:p-8">
        {status === 'success' ? (
          <p className="text-center text-sm font-medium text-foreground" role="status" aria-live="polite">
            {message}
          </p>
        ) : (
          <>
            <p className="mb-5 text-center text-base font-semibold text-foreground">
              Get your {pack.label} starter pack
            </p>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-full border-border/60 bg-background/95 px-5 text-base shadow-sm"
                  aria-label="Email address"
                  disabled={status === 'loading'}
                  required
                />
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 shrink-0 rounded-full bg-accent px-6 text-base font-semibold text-accent-foreground hover:bg-accent/90"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Sending…' : `Get My ${pack.label} Starter Pack`}
                </Button>
              </div>
            </form>
            {status === 'error' && message ? (
              <p
                className="mt-3 text-center text-sm text-destructive"
                role="alert"
                aria-live="assertive"
              >
                {message}
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
