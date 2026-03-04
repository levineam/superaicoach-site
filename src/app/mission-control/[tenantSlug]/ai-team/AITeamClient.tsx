"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  Star,
  Brain,
  PenLine,
  Settings,
  MessageSquare,
  X,
  RefreshCw,
  WifiOff,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { AgentChat } from "./AgentChat"
import type { AgentInfo } from "./AgentChat"
import type { LucideIcon } from "lucide-react"

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AgentSession {
  id: string
  name: string
  role: string
  status: "active" | "idle" | "offline"
  lastSeen: string | null
}

// ─── Agent icon mapping ────────────────────────────────────────────────────────

const AGENT_ICONS: Record<string, LucideIcon> = {
  main: Star,
  chad: PenLine,
  steve: Brain,
  imessage: MessageSquare,
  ops: Settings,
}

// ─── Fallback offline sessions ─────────────────────────────────────────────────
// Shown when the gateway is unreachable. Keeps layout stable (no broken UI).

const FALLBACK_SESSIONS: AgentSession[] = [
  {
    id: "main",
    name: "Jarvis",
    role: "Main orchestrator — strategy, memory, and coordination",
    status: "offline",
    lastSeen: null,
  },
  {
    id: "chad",
    name: "Chad",
    role: "Growth agent — content, outreach, and audience building",
    status: "offline",
    lastSeen: null,
  },
  {
    id: "steve",
    name: "Steve",
    role: "Research & security agent — deep dives and threat analysis",
    status: "offline",
    lastSeen: null,
  },
  {
    id: "imessage",
    name: "iMessage",
    role: "Communication relay — iMessage and SMS handling",
    status: "offline",
    lastSeen: null,
  },
  {
    id: "ops",
    name: "Ops",
    role: "Operations agent — cron jobs, monitoring, and system health",
    status: "offline",
    lastSeen: null,
  },
]

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  active: {
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-400 ring-emerald-400/20",
    label: "Active",
    pulse: true,
  },
  idle: {
    dot: "bg-amber-400",
    badge: "bg-amber-400/10 text-amber-400 ring-amber-400/20",
    label: "Idle",
    pulse: false,
  },
  offline: {
    dot: "bg-zinc-500",
    badge: "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20",
    label: "Offline",
    pulse: false,
  },
} as const

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatLastSeen(lastSeen: string | null): string {
  if (!lastSeen) return "Never"
  const diffMs = Date.now() - new Date(lastSeen).getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 1) return "Just now"
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  return `${Math.floor(diffHr / 24)}d ago`
}

// ─── Hook: useSessions ─────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 30_000

interface UseSessionsResult {
  sessions: AgentSession[]
  error: string | null
  loading: boolean
  lastFetch: Date | null
  refetch: () => Promise<void>
}

function useSessions(): UseSessionsResult {
  const [sessions, setSessions] = useState<AgentSession[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)
  // Track mount state to avoid updating state after unmount
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/mission-control/sessions", { cache: "no-store" })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      const json = (await res.json()) as {
        ok: boolean
        sessions?: AgentSession[]
        error?: string
      }

      if (!json.ok || !json.sessions) {
        throw new Error(json.error ?? "Invalid response from sessions API")
      }

      if (!mountedRef.current) return
      setSessions(json.sessions)
      setError(null)
    } catch (err) {
      if (!mountedRef.current) return
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg)
      // Graceful fallback: mark existing sessions offline, or show fallback list
      setSessions((prev) =>
        prev.length > 0
          ? prev.map((s) => ({ ...s, status: "offline" as const }))
          : FALLBACK_SESSIONS,
      )
    } finally {
      if (!mountedRef.current) return
      setLoading(false)
      setLastFetch(new Date())
    }
  }, [])

  useEffect(() => {
    void fetchSessions()
    const id = setInterval(() => void fetchSessions(), POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [fetchSessions])

  return { sessions, error, loading, lastFetch, refetch: fetchSessions }
}

// ─── Skeleton Card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-pulse">
      <div className="mb-4 h-10 w-10 rounded-lg bg-accent/10" />
      <div className="h-3 w-24 rounded bg-muted mb-2" />
      <div className="h-2.5 w-full rounded bg-muted mb-1.5" />
      <div className="h-2.5 w-3/4 rounded bg-muted" />
      <div className="mt-4 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-muted" />
        <div className="h-4 w-14 rounded-full bg-muted" />
      </div>
    </div>
  )
}

// ─── Agent Card ────────────────────────────────────────────────────────────────

function AgentCard({
  session,
  selected,
  onClick,
}: {
  session: AgentSession
  selected: boolean
  onClick: () => void
}) {
  const Icon = AGENT_ICONS[session.id] ?? Star
  const { dot, badge, label, pulse } = STATUS_CONFIG[session.status]

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative rounded-xl border bg-card transition-all text-left w-full",
        "hover:border-accent/60 hover:shadow-[0_0_24px_-4px_hsl(var(--accent)/0.15)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        "cursor-pointer p-5",
        selected
          ? "border-accent/70 shadow-[0_0_28px_-4px_hsl(var(--accent)/0.25)] ring-1 ring-accent/30"
          : "border-border",
      )}
      aria-pressed={selected}
    >
      {/* Selected indicator dot */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-accent"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
      </AnimatePresence>

      {/* Icon */}
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent/15 transition-colors">
        <Icon className="h-5 w-5" />
      </div>

      {/* Name + role */}
      <h2 className="font-semibold text-sm text-foreground">{session.name}</h2>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {session.role}
      </p>

      {/* Status badge */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              dot,
              pulse && "animate-pulse",
            )}
          />
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
              badge,
            )}
          >
            {label}
          </span>
        </div>

        {/* Chat hint */}
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground/50 group-hover:text-accent/60 transition-colors">
          <MessageSquare className="h-3 w-3" />
          Chat
        </span>
      </div>

      {/* Last seen */}
      <p className="mt-2 text-[10px] text-muted-foreground/40">
        Last seen: {formatLastSeen(session.lastSeen)}
      </p>
    </button>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

interface AITeamClientProps {
  tenantSlug: string
  hasEndpoint: boolean
}

export function AITeamClient({ tenantSlug, hasEndpoint }: AITeamClientProps) {
  const { sessions, error, loading, lastFetch, refetch } = useSessions()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const chatSectionRef = useRef<HTMLDivElement>(null)

  const selectedSession = sessions.find((s) => s.id === selectedId) ?? null

  const handleCardClick = (session: AgentSession) => {
    if (selectedId === session.id) {
      setSelectedId(null)
      return
    }
    setSelectedId(session.id)
    requestAnimationFrame(() => {
      setTimeout(() => {
        chatSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 50)
    })
  }

  // Map AgentSession → AgentInfo for the chat panel
  const selectedAgentInfo: AgentInfo | null = selectedSession
    ? {
        role: selectedSession.name,
        description: selectedSession.role,
        icon: AGENT_ICONS[selectedSession.id] ?? Star,
      }
    : null

  const displaySessions = loading
    ? []
    : sessions.length > 0
      ? sessions
      : FALLBACK_SESSIONS

  return (
    <div className="p-4 sm:p-6">
      {/* ── Header ── */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">AI Team</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your dedicated intelligence team — always on, always ready.{" "}
            <span className="text-accent/70">Click any agent to start chatting.</span>
          </p>

          {/* Gateway unreachable warning */}
          {error && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400/80">
              <WifiOff className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Gateway unreachable — showing last known state</span>
            </div>
          )}
        </div>

        {/* Refresh + last-updated */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <button
            onClick={() => void refetch()}
            title="Refresh agent status"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          {lastFetch && (
            <p className="text-[10px] text-muted-foreground/40">
              Updated {formatLastSeen(lastFetch.toISOString())}
            </p>
          )}
        </div>
      </div>

      {/* ── Agent grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displaySessions.map((session) => (
            <AgentCard
              key={session.id}
              session={session}
              selected={selectedId === session.id}
              onClick={() => handleCardClick(session)}
            />
          ))}
        </div>
      )}

      {/* ── Chat section ── */}
      <AnimatePresence mode="wait">
        {selectedAgentInfo && selectedSession && (
          <motion.div
            ref={chatSectionRef}
            key={selectedSession.id}
            className="mt-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35 }}
          >
            {/* Chat header */}
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <selectedAgentInfo.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-foreground truncate">
                    Chat with {selectedAgentInfo.role}
                  </h2>
                  <p className="text-xs text-muted-foreground truncate">
                    {selectedAgentInfo.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="flex-shrink-0 rounded-lg p-1.5 text-muted-foreground/50 hover:text-foreground hover:bg-accent/10 transition-colors"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat panel */}
            <div className="rounded-xl border border-border/60 bg-background/50 p-5">
              <AgentChat
                key={selectedSession.id}
                tenantSlug={tenantSlug}
                agent={selectedAgentInfo}
                hasEndpoint={hasEndpoint}
              />
            </div>

            <p className="mt-3 text-center text-[11px] text-muted-foreground/40">
              Responses are generated by your AI gateway. Context resets when you switch agents.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!loading && !selectedId && (
        <div className="mt-10 text-center">
          <p className="text-xs text-muted-foreground/50">
            Select any team member above to start a conversation.
          </p>
        </div>
      )}
    </div>
  )
}
