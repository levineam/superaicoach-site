/**
 * GET /api/mission-control/sessions
 *
 * Internal endpoint for the Mission Control AI Team page.
 * Returns live agent session data from the OpenClaw gateway.
 *
 * Auth: requires a valid Mission Control session cookie (same auth as the rest
 * of Mission Control). No external API key needed — the browser is already
 * authenticated via the MC session.
 *
 * This is distinct from /api/sessions which is for external callers (API-key auth).
 */

import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/mission-control/auth'
import { fetchGatewayStatus, buildAgentSessions } from '@/lib/gateway/sessions'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Require Mission Control session
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
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
        headers: { 'Cache-Control': 'no-store' },
      },
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[mc/sessions] gateway error:', message)

    return NextResponse.json(
      { ok: false, error: 'Failed to fetch from gateway: ' + message },
      { status: 502 },
    )
  }
}
