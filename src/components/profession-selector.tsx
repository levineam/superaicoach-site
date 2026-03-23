'use client'

import { useState } from 'react'
import {
  BookOpen,
  Brain,
  Briefcase,
  Calendar,
  CheckSquare,
  ClipboardList,
  Clock,
  FileText,
  Lightbulb,
  ListChecks,
  Loader2,
  Mail,
  Presentation,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import { trackEvent } from '@/lib/track'
import { COWORK_PACKS, type CoworkPack, type SkillCard } from '@/lib/cowork-packs'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Brain,
  Briefcase,
  Calendar,
  CheckSquare,
  ClipboardList,
  Clock,
  FileText,
  Lightbulb,
  ListChecks,
  Mail,
  Presentation,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
}

function SkillCardItem({ card }: { card: SkillCard }) {
  const Icon = iconMap[card.icon] ?? FileText
  return (
    <div className="flex gap-4 rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground">{card.title}</h3>
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
      </div>
    </div>
  )
}

export function ProfessionSelector() {
  const [selected, setSelected] = useState<CoworkPack>(COWORK_PACKS[0])
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  function handleProfessionChange(pack: CoworkPack) {
    setSelected(pack)
    setStatus('idle')
    setMessage('')
    trackEvent('cowork_profession_select', { profession: pack.profession })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    trackEvent('cowork_pack_request', { profession: selected.profession, email: email.trim() })

    try {
      const res = await fetch('/api/cowork-starter-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          profession: selected.profession,
          source: 'cowork-page',
        }),
      })
      const data = await res.json()

      if (data.ok) {
        setStatus('success')
        setMessage(data.message || 'Check your inbox!')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <div>
      {/* Tab selector */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {COWORK_PACKS.map((pack) => (
          <button
            key={pack.profession}
            onClick={() => handleProfessionChange(pack)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
              selected.profession === pack.profession
                ? 'bg-accent text-accent-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            {pack.label}
          </button>
        ))}
      </div>

      {/* Tagline */}
      <p className="mb-6 text-center text-base text-muted-foreground">{selected.tagline}</p>

      {/* Skill cards grid */}
      <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
        {selected.skillCards.map((card) => (
          <SkillCardItem key={card.title} card={card} />
        ))}
      </div>

      {/* Email capture */}
      <div className="mx-auto mt-10 max-w-md">
        {status === 'success' ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-center dark:border-emerald-800 dark:bg-emerald-950">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              {message}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={status === 'loading'}
              className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === 'loading' || !email.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                `Get My ${selected.label} Pack`
              )}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="mt-2 text-center text-sm text-red-600 dark:text-red-400">{message}</p>
        )}
      </div>
    </div>
  )
}
