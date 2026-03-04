/**
 * GET /api/sessions
 *
 * Returns the current status of each AI agent managed by the OpenClaw gateway.
 * Consumed by external callers (e.g., OpenClaw itself, monitoring dashboards).
 *
 * Auth: requires X-API-Key header (or ?key= query param) matching SESSIONS_API_KEY env var.
 * If SESSIONS_API_KEY is not set, the endpoint is open (suitable for local dev).
 *
 * For the Mission Control frontend, use /api/mission-control/sessions instead
 * (authenticates via MC session cookie, no API key needed in the browser).
 *
 * Data source: OpenClaw Gateway WebSocket RPC → `status` method.
 * Gateway URL: OPENCLAW_GATEWAY_WS_URL env var (default: ws://127.0.0.1:18789)
 * Gateway token: OPENCLAW_GATEWAY_TOKEN env var
 */

import { NextRequest, NextResponse } from 'next/server'
import { fetchGatewayStatus, buildAgentSessions } from '@/lib/gateway/sessions'

export async function GET(request: NextRequest) {
  // Auth check: only allow requests with the correct API key (if configured)
  const apiKey = process.env.SESSIONS_API_KEY
  if (apiKey) {
    const provided = request.headers.get('x-api-key') ?? request.nextUrl.searchParams.get('key')
    if (!provided || provided !== apiKey) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
  }

  const wsUrl = process.env.OPENCLAW_GATEWAY_WS_URL ?? 'ws://127.0.0.1:18789'
  const token = process.env.OPENCLAW_GATEWAY_TOKEN

  if (!token) {
    return NextResponse.json(
      { ok: false, error: 'OPENCLAW_GATEWAY_TOKEN not configured' },
      { status: 503 },
    )
  }

  try {
    const payload = await fetchGatewayStatus(wsUrl, token)
    const sessions = buildAgentSessions(payload)

    return NextResponse.json(
      { ok: true, sessions, fetchedAt: new Date().toISOString() },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': 'https://superaicoach.com',
        },
      },
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[sessions API] gateway error:', message)

    return NextResponse.json(
      { ok: false, error: 'Failed to fetch from gateway: ' + message },
      { status: 502 },
    )
  }
}
