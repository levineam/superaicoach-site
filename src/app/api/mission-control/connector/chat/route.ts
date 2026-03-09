/**
 * SAC Connector — Chat Route
 *
 * Attached-runtime chat: reads live workspace state, injects it as grounded
 * context, calls Claude directly (no OpenClaw gateway required).
 *
 * Auth: session-gated, tenant-scoped (same pattern as /api/mission-control/jarvis/chat).
 * Streaming: AI SDK v6 SSE format (compatible with useChat / DefaultChatTransport).
 */

import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'

import { getServerSession } from '@/lib/mission-control/auth'
import { isAdminRole } from '@/lib/mission-control/permissions'
import { getTenantBySlug } from '@/lib/mission-control/data-access'
import { readWorkspaceContext, formatWorkspaceForPrompt } from '@/lib/connector/workspace'
import type { ConnectorMessage } from '@/lib/connector/types'

export const maxDuration = 60

// ---------------------------------------------------------------------------
// System prompt — Jarvis in workspace-aware mode
// ---------------------------------------------------------------------------

function buildSystemPrompt(workspaceSummary: string, tenantSlug: string): string {
  return `You are Jarvis — Andrew Leveiss's personal AI assistant, operating in Mission Control workspace mode.

You have real-time access to the project board for workspace "${tenantSlug}". Use the workspace state below to answer questions directly and concisely. When the user asks about tasks, priorities, or what needs their attention, use this data — do not speculate.

${workspaceSummary}

---

Your role in this context:
- Answer questions about the current board state using the data above
- Help prioritize: "what needs me most urgently?" → look at Needs You tasks by priority
- Suggest next actions based on the board state
- Help draft status updates, task descriptions, or plans when asked
- If asked to create or update a task, explain what you'd do (mutations are coming in a future version)

Communication style: direct, concise, no filler. 2-4 sentences for simple questions. You are Jarvis. Act like it.`
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  // Auth
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const requestedSlug = req.headers.get('x-tenant-slug')?.trim()
  if (!requestedSlug) {
    return NextResponse.json({ error: 'Missing x-tenant-slug header' }, { status: 400 })
  }

  const isAdmin = isAdminRole(session.role)
  const isOwnTenant = session.tenantSlug === requestedSlug
  if (!isAdmin && !isOwnTenant) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Resolve tenant for cross-tenant admin access
  if (isAdmin && !isOwnTenant) {
    const tenant = await getTenantBySlug(requestedSlug)
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }
  }

  // Parse messages from AI SDK v6 UIMessage format
  type RawMessage = {
    role: string
    content?: string | unknown
    parts?: Array<{ type: string; text?: string }>
  }

  let messages: ConnectorMessage[]
  try {
    const body = await req.json()
    const rawMessages: RawMessage[] = body.messages ?? []
    if (!Array.isArray(rawMessages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }
    messages = rawMessages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => {
        let content = ''
        if (typeof m.content === 'string' && m.content) {
          content = m.content
        } else if (Array.isArray(m.parts)) {
          content = m.parts
            .filter((p) => p.type === 'text' && typeof p.text === 'string')
            .map((p) => p.text ?? '')
            .join('')
        }
        return { role: m.role as 'user' | 'assistant', content }
      })
      .filter((m) => m.content.trim().length > 0)
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (messages.length === 0) {
    return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
  }

  // Read live workspace context
  const workspaceCtx = await readWorkspaceContext(requestedSlug)
  const workspaceSummary = formatWorkspaceForPrompt(workspaceCtx)
  const systemPrompt = buildSystemPrompt(workspaceSummary, requestedSlug)

  // Stream via Claude (direct Anthropic SDK — no gateway required)
  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    maxOutputTokens: 1024,
  })

  return result.toUIMessageStreamResponse()
}
