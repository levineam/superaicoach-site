import { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from '@/lib/mission-control/auth'
import { isAdminRole } from '@/lib/mission-control/permissions'
import {
  getPrimaryEndpointForTenant,
  getTenantBySlug,
} from '@/lib/mission-control/data-access'
import { decryptToken } from '@/lib/mission-control/crypto'

// Allow streaming responses up to 60 seconds
export const maxDuration = 60

// ---------------------------------------------------------------------------
// Build an AI SDK v6 UI Message Stream response from a plain text string.
//
// AI SDK v6 (ai@6+, @ai-sdk/react@3+) uses DefaultChatTransport which expects
// Server-Sent Events (SSE) format with semantic JSON chunk types:
//   data: {"type":"start","messageId":"..."}
//   data: {"type":"text-start","id":"..."}
//   data: {"type":"text-delta","id":"...","delta":"..."}
//   data: {"type":"text-end","id":"..."}
//   data: {"type":"finish","finishReason":"stop"}
//   data: [DONE]
//
// The old v4 protocol (f:/0:/e:/d: prefixes) is NOT recognized by v6's
// EventSourceParserStream — it silently drops those lines, producing an
// empty stream and leaving the assistant message (and TTS) never triggered.
// ---------------------------------------------------------------------------
function buildStreamFromText(text: string): Response {
  const messageId = `msg-jarvis-${Date.now()}`
  const textPartId = 'text-0'

  const chunks = [
    JSON.stringify({ type: 'start', messageId }),
    JSON.stringify({ type: 'text-start', id: textPartId }),
    JSON.stringify({ type: 'text-delta', id: textPartId, delta: text }),
    JSON.stringify({ type: 'text-end', id: textPartId }),
    JSON.stringify({ type: 'finish', finishReason: 'stop' }),
  ]

  // Each SSE event: "data: {json}\n\n"
  const sseBody = chunks.map((c) => `data: ${c}\n\n`).join('') + 'data: [DONE]\n\n'

  return new Response(sseBody, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'x-vercel-ai-ui-message-stream': 'v1',
    },
  })
}

export async function POST(req: NextRequest) {
  // Authenticate the session
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Determine target tenant from the header sent by the client
  const requestedSlug = req.headers.get('x-tenant-slug')?.trim()

  if (!requestedSlug) {
    return NextResponse.json({ error: 'Missing tenant slug' }, { status: 400 })
  }

  const isAdmin = isAdminRole(session.role)
  const isOwnTenant = session.tenantSlug === requestedSlug

  if (!isAdmin && !isOwnTenant) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Resolve tenant UUID for endpoint lookups and downstream headers
  let tenantId = session.tenantId
  if (isAdmin && !isOwnTenant) {
    const tenant = await getTenantBySlug(requestedSlug)
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }
    tenantId = tenant.id
  } else {
    // Resolve own-tenant slug to UUID
    const tenant = await getTenantBySlug(requestedSlug)
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }
    tenantId = tenant.id
  }

  // Get the primary endpoint for this tenant
  const endpoint = await getPrimaryEndpointForTenant(tenantId)

  if (!endpoint) {
    return NextResponse.json(
      { error: 'No gateway endpoint configured for this tenant' },
      { status: 503 }
    )
  }

  // Decrypt the bearer token
  let bearerToken: string
  try {
    bearerToken = decryptToken(endpoint.encryptedToken)
  } catch {
    return NextResponse.json(
      { error: 'Failed to resolve endpoint credentials' },
      { status: 500 }
    )
  }

  // ---------------------------------------------------------------------------
  // Parse and normalize the request body from AI SDK v6 UIMessage format
  // to the OpenAI-compatible { role, content } format expected by the gateway.
  //
  // AI SDK v6 sends UIMessage objects where content is in `parts`:
  //   { id, role, parts: [{ type: "text", text: "..." }] }
  // OpenAI-compatible APIs expect:
  //   { role, content: "..." }
  // ---------------------------------------------------------------------------
  type RawMessage = {
    role: string
    content?: string | unknown
    parts?: Array<{ type: string; text?: string }>
  }
  let messages: Array<{ role: string; content: string }>
  try {
    const body = await req.json()
    const rawMessages: RawMessage[] = body.messages ?? []
    // Guard against malformed payload where messages is not an array
    if (!Array.isArray(rawMessages)) {
      return NextResponse.json({ error: 'Invalid messages format: expected array' }, { status: 400 })
    }
    // Normalize AI SDK v6 UIMessage → OpenAI { role, content } format.
    messages = rawMessages.map((m) => {
      let content = ''
      if (typeof m.content === 'string' && m.content) {
        // Already a plain string (e.g. older SDK versions or system messages)
        content = m.content
      } else if (Array.isArray(m.parts)) {
        // AI SDK v6 UIMessage: extract and join text parts
        content = m.parts
          .filter((p) => p.type === 'text' && typeof p.text === 'string')
          .map((p) => p.text ?? '')
          .join('')
      } else if (m.content && typeof m.content !== 'string') {
        // Fallback: stringify non-string content
        content = JSON.stringify(m.content)
      }
      return { role: m.role, content }
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // If the caller provides an agent system prompt (e.g. from the AI Team chat),
  // inject it as the leading system message so the LLM adopts the right persona.
  const agentSystemPrompt = req.headers.get('x-agent-system-prompt')?.trim()
  if (agentSystemPrompt) {
    // Only prepend when there isn't already a system message
    const hasSystem = messages.some((m) => m.role === 'system')
    if (!hasSystem) {
      messages = [{ role: 'system', content: agentSystemPrompt }, ...messages]
    }
  }

  // Build the gateway URL — OpenClaw exposes an OpenAI-compatible endpoint at /v1/chat/completions
  const gatewayUrl = `${endpoint.baseUrl.replace(/\/+$/, '')}/v1/chat/completions`

  try {
    const gatewayResponse = await fetch(gatewayUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
        'x-tenant-id': tenantId,
        'x-user-email': session.email,
      },
      // Include model only if explicitly configured — avoids hardcoding a value that may be
      // rejected by non-OpenAI-compatible backends (e.g. local routers, custom gateways).
      // Set JARVIS_GATEWAY_MODEL env var to override (e.g. 'gpt-4o' for OpenAI-direct tenants).
      body: JSON.stringify({
        ...(process.env.JARVIS_GATEWAY_MODEL ? { model: process.env.JARVIS_GATEWAY_MODEL } : {}),
        messages,
      }),
      signal: AbortSignal.timeout(55_000),
    })

    if (!gatewayResponse.ok) {
      const errText = await gatewayResponse.text().catch(() => 'Unknown error')
      const isGatewayDown =
        gatewayResponse.status === 502 ||
        gatewayResponse.status === 503 ||
        gatewayResponse.status === 504
      if (isGatewayDown) {
        return buildStreamFromText(
          "I'm not available right this moment — the gateway appears to be offline. Please try again shortly."
        )
      }
      return NextResponse.json(
        { error: `Gateway returned ${gatewayResponse.status}: ${errText.slice(0, 200)}` },
        { status: gatewayResponse.status >= 500 ? 502 : gatewayResponse.status }
      )
    }

    // Parse the OpenAI-format response and stream back in Vercel AI SDK format
    const data = (await gatewayResponse.json()) as {
      choices?: Array<{ message?: { content?: string } }>
      error?: string
    }

    if (data.error) {
      return buildStreamFromText(
        'An error occurred processing your request. Please try again.'
      )
    }

    const text = data.choices?.[0]?.message?.content
    if (!text) {
      return buildStreamFromText(
        'The gateway returned an empty response. Please try again.'
      )
    }

    return buildStreamFromText(text)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    const timedOut =
      message.toLowerCase().includes('timeout') ||
      message.toLowerCase().includes('abort')

    if (timedOut) {
      return buildStreamFromText(
        'The gateway timed out. Your OpenClaw instance may be offline or processing a long request.'
      )
    }

    return buildStreamFromText(
      `Failed to reach gateway: ${message.slice(0, 100)}`
    )
  }
}
