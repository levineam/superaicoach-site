'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  X,
  Loader2,
  RefreshCw,
  ListTodo,
  UserRound,
  CheckCircle,
  Info,
  FolderOpen,
} from 'lucide-react'

type Priority = 'High' | 'Medium' | 'Low'
type ColumnId = 'active' | 'in-review' | 'needs-you' | 'done'
type LaneId = 'queue' | 'needs-you' | 'done'

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
  diagnostics?: {
    dbEnabled: boolean
    totalInDb: number
    filtered: number
    error?: string
    hint?: string
  }
}

/** Map the 4-column DB model → 3-lane AI-first view */
function cardLane(column: ColumnId): LaneId {
  if (column === 'needs-you') return 'needs-you'
  if (column === 'done') return 'done'
  return 'queue' // active + in-review both go to Queue
}

const laneConfig = [
  {
    id: 'queue' as LaneId,
    title: 'Queue',
    description: 'Work in progress or queued',
    Icon: ListTodo,
    headerCls: 'text-blue-400',
    indicatorCls: 'bg-blue-400',
    badgeCls: 'bg-blue-400/10 text-blue-400 ring-1 ring-inset ring-blue-400/20',
    borderCls: 'border-blue-400/20',
  },
  {
    id: 'needs-you' as LaneId,
    title: 'Needs You',
    description: 'Blocked — needs your input or decision',
    Icon: UserRound,
    headerCls: 'text-rose-400',
    indicatorCls: 'bg-rose-400',
    badgeCls: 'bg-rose-400/10 text-rose-400 ring-1 ring-inset ring-rose-400/20',
    borderCls: 'border-rose-400/20',
  },
  {
    id: 'done' as LaneId,
    title: 'Done',
    description: 'Completed tasks',
    Icon: CheckCircle,
    headerCls: 'text-muted-foreground',
    indicatorCls: 'bg-muted-foreground/40',
    badgeCls: 'bg-muted/30 text-muted-foreground ring-1 ring-inset ring-border/40',
    borderCls: 'border-border/40',
  },
]

const priorityStyles: Record<Priority, string> = {
  High: 'bg-rose-400/10 text-rose-400 ring-1 ring-inset ring-rose-400/20',
  Medium: 'bg-amber-400/10 text-amber-400 ring-1 ring-inset ring-amber-400/20',
  Low: 'bg-sky-400/10 text-sky-400 ring-1 ring-inset ring-sky-400/20',
}

function TaskModal({
  card,
  onClose,
  onMarkDone,
}: {
  card: Card
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

  const lane = laneConfig.find((l) => l.id === cardLane(card.column))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`task-modal-title-${card.id}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-border/40 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="text-xs uppercase tracking-widest text-accent/60 mb-1">{card.project}</p>
        <h2 id={`task-modal-title-${card.id}`} className="text-lg font-semibold text-foreground leading-snug pr-8">{card.status}</h2>

        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {lane && (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${lane.badgeCls}`}>
              {lane.title}
            </span>
          )}
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${priorityStyles[card.priority]}`}
          >
            {card.priority} Priority
          </span>
        </div>

        {card.description && (
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{card.description}</p>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            Take Action
          </button>
          {card.column !== 'done' && (
            <button
              onClick={() => {
                onMarkDone(card.id)
                onClose()
              }}
              className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-border/20 transition-colors"
            >
              Mark as Done
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProjectBoardPage() {
  const [allCards, setAllCards] = useState<Card[]>([])
  const [allProjects, setAllProjects] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  const [diagnostics, setDiagnostics] = useState<ApiResponse['diagnostics']>(undefined)

  const fetchBoard = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/mission-control/projects')
      const data: ApiResponse & { error?: string } = await res.json()
      if (!res.ok) {
        // Surface diagnostics even on error so user can debug
        if (data.diagnostics) setDiagnostics(data.diagnostics)
        throw new Error(data.error || `HTTP ${res.status}`)
      }
      setAllCards(data.cards ?? [])
      setAllProjects(data.projects ?? [])
      setDiagnostics(data.diagnostics)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBoard()
  }, [fetchBoard])

  const markDone = async (id: string) => {
    const prev = allCards
    setAllCards((cards) => cards.map((c) => (c.id === id ? { ...c, column: 'done' } : c)))
    try {
      const res = await fetch('/api/mission-control/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, column: 'done' }),
      })
      if (!res.ok) {
        console.error('Failed to persist markDone:', await res.text())
        setAllCards(prev)
      }
    } catch (err) {
      console.error('Error persisting markDone:', err)
      setAllCards(prev)
    }
  }

  // Client-side project filter
  const visibleCards = useMemo(() => {
    return selectedProject === 'all'
      ? allCards
      : allCards.filter((c) => c.project === selectedProject)
  }, [allCards, selectedProject])

  // Group into 3 lanes
  const lanes = useMemo(() => {
    return laneConfig.map((lane) => ({
      ...lane,
      cards: visibleCards.filter((c) => cardLane(c.column) === lane.id),
    }))
  }, [visibleCards])

  const totalVisible = visibleCards.length
  const needsYouCount = visibleCards.filter((c) => c.column === 'needs-you').length

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground">Loading project board...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-6 text-center">
          <p className="text-rose-400 font-medium">Failed to load project board</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          {diagnostics?.dbEnabled === false && (
            <p className="text-xs text-amber-400 mt-3">
              Database not configured — set{' '}
              <code className="font-mono">MISSION_CONTROL_SUPABASE_URL</code> and{' '}
              <code className="font-mono">MISSION_CONTROL_SUPABASE_SERVICE_ROLE_KEY</code>
            </p>
          )}
          {diagnostics?.hint && (
            <p className="text-xs text-muted-foreground mt-2">{diagnostics.hint}</p>
          )}
          <button
            onClick={fetchBoard}
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
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Project Board</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {totalVisible} task{totalVisible !== 1 ? 's' : ''} across {allProjects.length}{' '}
              project{allProjects.length !== 1 ? 's' : ''}
              {needsYouCount > 0 && (
                <span className="ml-2 text-rose-400 font-medium">
                  · {needsYouCount} need{needsYouCount !== 1 ? '' : 's'} you
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-colors ${
                showDiagnostics
                  ? 'border-accent text-accent bg-accent/10'
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-border/20'
              }`}
              title="Toggle diagnostics"
            >
              <Info className="h-4 w-4" />
            </button>
            <button
              onClick={fetchBoard}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-border/20 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Project filter */}
        <div className="mt-4 flex items-center gap-1.5">
          <FolderOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Projects</option>
            {allProjects.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Metrics strip */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          {lanes.map((lane) => {
            const { Icon } = lane
            return (
              <div
                key={lane.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${lane.badgeCls} ${lane.borderCls}`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="font-semibold tabular-nums">{lane.cards.length}</span>
                <span className="hidden sm:inline opacity-70">{lane.title}</span>
              </div>
            )
          })}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground ml-auto">
            <span className="font-semibold tabular-nums">{totalVisible}</span>
            <span className="hidden sm:inline">Total</span>
          </div>
        </div>
      </div>

      {/* Diagnostics panel */}
      {showDiagnostics && (
        <div className="mb-6 rounded-xl border border-border bg-muted/20 p-4 text-xs space-y-2">
          <p className="font-medium text-muted-foreground uppercase tracking-widest text-[10px]">
            Diagnostics
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-foreground">
            <div>
              <span className="text-muted-foreground">DB connected: </span>
              <span className={`font-medium ${diagnostics?.dbEnabled ? 'text-emerald-400' : 'text-rose-400'}`}>
                {diagnostics?.dbEnabled ? 'yes' : 'no'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Total in DB: </span>
              <span className="font-medium">{diagnostics?.totalInDb ?? '—'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Showing: </span>
              <span className="font-medium">{totalVisible}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Projects: </span>
              <span className="font-medium">{allProjects.length}</span>
            </div>
          </div>
          {diagnostics?.error && (
            <p className="text-rose-400">⚠ {diagnostics.error}</p>
          )}
          {allProjects.length > 0 && (
            <p className="text-muted-foreground">
              <span className="font-medium">Project list:</span> {allProjects.join(', ')}
            </p>
          )}
          {totalVisible === 0 && diagnostics?.dbEnabled && (
            <p className="text-amber-400">
              No rows returned — check that the <code className="font-mono">project_cards</code> table has data.
            </p>
          )}
        </div>
      )}

      {/* 3-lane kanban */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {lanes.map((lane) => {
          const { Icon } = lane
          return (
            <div key={lane.id} className="flex flex-col gap-3">
              {/* Lane header */}
              <div className="flex items-center gap-2 px-1">
                <span className={`h-2 w-2 rounded-full flex-shrink-0 ${lane.indicatorCls}`} />
                <Icon className={`h-3.5 w-3.5 ${lane.headerCls}`} />
                <span className={`text-xs font-semibold uppercase tracking-widest ${lane.headerCls}`}>
                  {lane.title}
                </span>
                <span className="ml-auto text-xs text-muted-foreground/60 tabular-nums">
                  {lane.cards.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto">
                {lane.cards.map((card) => (
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
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${priorityStyles[card.priority]}`}
                      >
                        {card.priority}
                      </span>
                    </div>
                  </button>
                ))}

                {lane.cards.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border/50 p-6 text-center">
                    <p className="text-xs text-muted-foreground/50">
                      {lane.id === 'needs-you'
                        ? 'Nothing needs your attention'
                        : lane.id === 'done'
                          ? 'No completed tasks'
                          : allCards.length === 0
                            ? 'No tasks in the database'
                            : 'Nothing queued'}
                    </p>
                    {allCards.length === 0 && lane.id === 'queue' && (
                      <p className="text-[11px] text-muted-foreground/40 mt-1">
                        Check DB connection or populate the{' '}
                        <code className="font-mono">project_cards</code> table
                      </p>
                    )}
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
          onClose={() => setSelectedCard(null)}
          onMarkDone={markDone}
        />
      )}
    </div>
  )
}
