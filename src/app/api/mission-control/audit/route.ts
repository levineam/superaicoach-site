import { NextRequest, NextResponse } from 'next/server'

import { getTenantAuditLog } from '@/lib/mission-control/audit'
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/mission-control/session'

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value

  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const session = verifySessionToken(sessionToken)

  if (!session) {
    return NextResponse.json({ error: 'Session expired or invalid.' }, { status: 401 })
  }

  const events = await getTenantAuditLog(session.tenantId, 25)

  return NextResponse.json({
    tenantId: session.tenantId,
    events,
  })
}
