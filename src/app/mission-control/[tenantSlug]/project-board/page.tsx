'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Loader2, RefreshCw } from 'lucide-react'

type Priority = 'High' | 'Medium' | 'Low'
type ColumnId = 'active' | 'in-review' | 'needs-you' | 'done'

type Card = {
  id: string
  project: string
  status: string
  description: string
  priority: Priority
  column: ColumnId
}

type ApiResponse = {
  cards: Card[]
  projects: string[]
  counts: {
    total: number
    active: number
    inReview: number
    needsYou: number
    done: number
  }
}

const columnDefs: { id: ColumnId; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'in-review', label: 'In Review' },
  { id: 'needs-you', label: 'Needs You' },
  { id: 'done', label: 'Done' },
]

const columnStyles: Record<ColumnId, { header: string; indicator: string }> = {
  active: { header: 'text-emerald-400', indicator: 'bg-emerald-400' },
  'in-review': { header: 'text-amber-400', indicator: 'bg-amber-400' },
  'needs-you': { header: 'text-rose-400', indicator: 'bg-rose-400' },
  done: { header: 'text-muted-foreground', indicator: 'bg-muted-foreground/40' },
}

const priorityStyles: Record<Priority, string> = {
  High: 'bg-rose-400/10 text-rose-400 ring-rose-400/20',
  Medium: 'bg-amber-400/10 text-amber-400 ring-amber-400/20',
  Low: 'bg-sky-400/10 text-sky-400 ring-sky-400/20',
}

const columnStatusStyles: Record<ColumnId, string> = {
  active: 'bg-emerald-400/10 text-emerald-400 ring-emerald-400/20',
  'in-review': 'bg-amber-400/10 text-amber-400 ring-amber-400/20',
  'needs-you': 'bg-rose-400/10 text-rose-400 ring-rose-400/20',
  done: 'bg-muted/30 text-muted-foreground ring-border/40',
}

function TaskModal({
  card,
  columnLabel,
  onClose,
  onMarkDone,
}: {
  card: Card
  columnLabel: string
  onClose: () => void
  onMarkDone: (id: string) => void
}) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [handleKey])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-border/40 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="text-xs uppercase tracking-widest text-accent/60 mb-1">{card.project}</p>
        <h2 className="text-lg font-semibold text-foreground leading-snug pr-8">{card.status}</h2>

        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${columnStatusStyles[card.column]}`}
          >
            {columnLabel}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${priorityStyles[card.priority]}`}
          >
            {card.priority} Priority
          </span>
        </div>

        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{card.description}</p>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            Take Action
          </button>
          <button
            onClick={() => {
              onMarkDone(card.id)
              onClose()
            }}
            className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-border/20 transition-colors"
          >
            Mark as Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProjectBoardPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [projects, setProjects] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/mission-control/projects')
      if (!res.ok) throw new Error('Failed to fetch projects')
      const data: ApiResponse = await res.json()
      setCards(data.cards)
      setProjects(data.projects)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const markDone = (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, column: 'done' } : c))
    )
  }

  const selectedColumnLabel =
    selectedCard
      ? columnDefs.find((col) => col.id === selectedCard.column)?.label ?? ''
      : ''

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground">Loading projects from vault...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-6 text-center">
          <p className="text-rose-400 font-medium">Failed to load projects</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <button
            onClick={fetchProjects}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Project Board</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Live status across {projects.length} active projects • {cards.length} total tasks
            </p>
          </div>
          <button
            onClick={fetchProjects}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-border/20 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
        
        {/* Project pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {projects.map((project) => (
            <span
              key={project}
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-accent/10 text-accent ring-1 ring-inset ring-accent/20"
            >
              {project}
            </span>
          ))}
        </div>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {columnDefs.map((col) => {
          const styles = columnStyles[col.id]
          const colCards = cards.filter((c) => c.column === col.id)
          return (
            <div key={col.id} className="flex flex-col gap-3">
              {/* Column header */}
              <div className="flex items-center gap-2 px-1">
                <span className={`h-2 w-2 rounded-full ${styles.indicator}`} />
                <span className={`text-xs font-semibold uppercase tracking-widest ${styles.header}`}>
                  {col.label}
                </span>
                <span className="ml-auto text-xs text-muted-foreground/60 tabular-nums">
                  {colCards.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto">
                {colCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className="text-left rounded-xl border border-border bg-card p-4 transition-all hover:border-accent/30 hover:shadow-[0_0_16px_-4px_hsl(var(--accent)/0.12)] cursor-pointer w-full"
                  >
                    <p className="text-[13px] font-semibold text-foreground leading-snug">
                      {card.project}
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {card.status}
                    </p>
                    <div className="mt-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${priorityStyles[card.priority]}`}
                      >
                        {card.priority}
                      </span>
                    </div>
                  </button>
                ))}
                {colCards.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground/50">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Task modal */}
      {selectedCard && (
        <TaskModal
          card={selectedCard}
          columnLabel={selectedColumnLabel}
          onClose={() => setSelectedCard(null)}
          onMarkDone={markDone}
        />
      )}
    </div>
  )
}
