import type { Metadata } from 'next'
import { Target, AlertCircle, Zap, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard — Mission Control',
  description: 'What should I work on right now?',
}

const blockers = [
  { id: 'b1', label: 'Magic link email delivery', detail: 'Testing in progress — Resend integration needs end-to-end verification before Mark demo.' },
  { id: 'b2', label: 'Mission Control UI polish', detail: 'Dashboard, org chart, and task modal updates pending. Blocking clean demo experience.' },
  { id: 'b3', label: 'Mark pitch deck slides', detail: 'AI Playbook slide images not yet generated. Needed for Thursday presentation.' },
]

const quickWins = [
  { id: 'q1', label: 'Review AI Playbook report', detail: 'Scan the generated report for accuracy before Thursday.' },
  { id: 'q2', label: 'Test Jarvis chat end-to-end', detail: 'Verify the Cloudflare tunnel + gateway proxy is live and responsive.' },
  { id: 'q3', label: 'Generate remaining pitch deck images', detail: 'Run image gen for the 3 remaining slide placeholders.' },
]

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-3xl space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          What should I work on right now?
        </p>
      </div>

      {/* ── Current Focus ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-4 w-4 text-accent" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">Current Focus</h2>
        </div>
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 shadow-[0_0_32px_-8px_hsl(var(--accent)/0.20)]">
          <p className="text-xs uppercase tracking-widest text-accent/60 mb-1">Top Priority</p>
          <p className="text-xl font-semibold text-foreground leading-snug">
            Super AI Coach — Mark demo prep
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">Thu Feb 26</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">Active</span>
          </div>
        </div>
      </section>

      {/* ── What's Blocking You ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-4 w-4 text-rose-400" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-rose-400">What&apos;s Blocking You</h2>
        </div>
        <div className="flex flex-col gap-3">
          {blockers.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-card p-4 flex items-start gap-3 transition-all hover:border-rose-400/30 hover:shadow-[0_0_16px_-4px_rgba(251,113,133,0.12)]"
            >
              <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-rose-400" />
              <div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick Wins ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-amber-400" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-400">Quick Wins</h2>
        </div>
        <div className="flex flex-col gap-3">
          {quickWins.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-card p-4 flex items-start gap-3 transition-all hover:border-amber-400/30 hover:shadow-[0_0_16px_-4px_rgba(251,191,36,0.10)]"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400/60" />
              <div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
