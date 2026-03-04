/**
 * Shared gateway session-fetching logic.
 *
 * Used by:
 *   - /api/sessions          — external consumers (API-key auth)
 *   - /api/mission-control/sessions — Mission Control frontend (MC session auth)
 *
 * Data source: OpenClaw Gateway WebSocket RPC → `status` method.
 */

import { randomUUID } from 'crypto'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AgentSession {
  /** Agent identifier (main, chad, steve, imessage, ops) */
  id: string
  /** Human-readable display name */
  name: string
  /** One-line description of the agent's role */
  role: string
  /** Activity status derived from last session timestamp */
  status: 'active' | 'idle' | 'offline'
  /** ISO-8601 timestamp of the agent's most recent activity */
  lastSeen: string | null
}

// ---------------------------------------------------------------------------
// Agent metadata
// ---------------------------------------------------------------------------

export const AGENT_META: Record<string, { name: string; role: string }> = {
  main: { name: 'Jarvis', role: 'Main orchestrator — strategy, memory, and coordination' },
  chad: { name: 'Chad', role: 'Growth agent — content, outreach, and audience building' },
  steve: { name: 'Steve', role: 'Research & security agent — deep dives and threat analysis' },
  imessage: { name: 'iMessage', role: 'Communication relay — iMessage and SMS handling' },
  ops: { name: 'Ops', role: 'Operations agent — cron jobs, monitoring, and system health' },
}

/** Age threshold in ms for "active" vs "idle" classification */
export const ACTIVE_THRESHOLD_MS = 5 * 60 * 1000  // 5 minutes
export const IDLE_THRESHOLD_MS = 30 * 60 * 1000   // 30 minutes

// ---------------------------------------------------------------------------
// Gateway WebSocket client
// ---------------------------------------------------------------------------

interface GatewayStatusPayload {
  sessions?: {
    recent?: Array<{
      agentId: string
      key: string
      updatedAt: number
      age: number
    }>
  }
  heartbeat?: {
    agents?: Array<{ agentId: string; enabled: boolean }>
  }
}

export async function fetchGatewayStatus(
  wsUrl: string,
  token: string,
  timeoutMs = 8000,
): Promise<GatewayStatusPayload> {
  return new Promise((resolve, reject) => {
    // P2 fix: declare ws before the timer so the callback always has a valid ref
    let ws: WebSocket | null = null
    let settled = false

    const settle = (fn: () => void) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      ws?.close()
      fn()
    }

    const timer = setTimeout(() => {
      settle(() => reject(new Error('gateway status timeout')))
    }, timeoutMs)

    ws = new WebSocket(wsUrl)
    let connected = false
    let connectReqId: string | null = null
    const statusReqId = 'status-' + randomUUID()

    ws.onmessage = (e: MessageEvent) => {
      let msg: Record<string, unknown>
      try {
        msg = JSON.parse(e.data as string) as Record<string, unknown>
      } catch {
        return
      }

      // Step 1: Challenge → send connect
      if (msg.type === 'event' && msg.event === 'connect.challenge') {
        connectReqId = randomUUID()
        ws.send(
          JSON.stringify({
            type: 'req',
            id: connectReqId,
            method: 'connect',
            params: {
              minProtocol: 3,
              maxProtocol: 3,
              client: {
                id: 'sessions-api',
                displayName: 'Sessions API Route',
                version: 'dev',
                platform: process.platform,
                mode: 'cli',
                instanceId: randomUUID(),
              },
              caps: [],
              auth: { token },
              role: 'operator',
              scopes: ['operator.admin'],
            },
          }),
        )
        return
      }

      // Step 2: Connect ack → send status request
      if (!connected && msg.type === 'res' && msg.id === connectReqId && msg.ok === true) {
        connected = true
        ws.send(
          JSON.stringify({
            type: 'req',
            id: statusReqId,
            method: 'status',
            params: {},
          }),
        )
        return
      }

      // Step 3: Status response → resolve
      if (msg.id === statusReqId) {
        if (msg.ok) {
          settle(() => resolve((msg.payload as GatewayStatusPayload) ?? {}))
        } else {
          settle(() => reject(new Error((msg as Record<string, Record<string, string>>).error?.message ?? 'gateway status failed')))
        }
      }
    }

    ws.onerror = (e: Event) => {
      settle(() => reject(new Error('gateway websocket error: ' + String(e))))
    }

    // P1 fix: reject on close regardless of auth state — covers the case where
    // the socket closes after auth succeeds but before the status reply arrives.
    ws.onclose = () => {
      settle(() => reject(new Error(
        connected
          ? 'gateway connection closed before status reply'
          : 'gateway connection closed before auth',
      )))
    }
  })
}

// ---------------------------------------------------------------------------
// Map gateway payload → AgentSession[]
// ---------------------------------------------------------------------------

export function buildAgentSessions(payload: GatewayStatusPayload): AgentSession[] {
  const latestByAgent: Record<string, number> = {}

  for (const session of payload.sessions?.recent ?? []) {
    const prev = latestByAgent[session.agentId]
    if (prev === undefined || session.updatedAt > prev) {
      latestByAgent[session.agentId] = session.updatedAt
    }
  }

  const now = Date.now()
  const knownAgentIds = new Set([
    ...Object.keys(AGENT_META),
    ...Object.keys(latestByAgent),
  ])

  return Array.from(knownAgentIds)
    .filter((id) => id in AGENT_META)
    .map((id) => {
      const meta = AGENT_META[id]
      const updatedAt = latestByAgent[id] ?? null
      const age = updatedAt !== null ? now - updatedAt : Infinity

      let status: AgentSession['status'] = 'offline'
      if (age < ACTIVE_THRESHOLD_MS) status = 'active'
      else if (age < IDLE_THRESHOLD_MS) status = 'idle'

      return {
        id,
        name: meta.name,
        role: meta.role,
        status,
        lastSeen: updatedAt !== null ? new Date(updatedAt).toISOString() : null,
      }
    })
    .sort((a, b) => {
      const order = { active: 0, idle: 1, offline: 2 }
      return order[a.status] - order[b.status] || a.name.localeCompare(b.name)
    })
}
