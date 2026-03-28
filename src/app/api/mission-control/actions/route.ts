import { NextRequest, NextResponse } from 'next/server'

import { createRequestId, logCustomerAction } from '@/lib/mission-control/audit'
import { getTenantBySlug } from '@/lib/mission-control/data-access'
import { routeTenantAction } from '@/lib/mission-control/endpoint-routing'
import {
  canRoleRunAction,
  CUSTOMER_ACTIONS,
  isPilotModeActionAllowed,
} from '@/lib/mission-control/permissions'
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/mission-control/session'
import { type CustomerActionId } from '@/lib/mission-control/types'

interface ActionPayload {
  actionId?: CustomerActionId
  confirmed?: boolean
}

export async function POST(request: NextRequest) {
  const requestId = createRequestId()
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const session = verifySessionToken(sessionCookie)

  if (!session) {
    return NextResponse.json({ error: 'Session expired or invalid.' }, { status: 401 })
  }

  let body: ActionPayload

  try {
    body = (await request.json()) as ActionPayload
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (!body.actionId || !(body.actionId in CUSTOMER_ACTIONS)) {
    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
  }

  const actionPolicy = CUSTOMER_ACTIONS[body.actionId]
  const tenant = await getTenantBySlug(session.tenantSlug)

  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found.' }, { status: 404 })
  }

  const baseMetadata = {
    tenantSlug: tenant.slug,
    requestId,
    riskLevel: actionPolicy.riskLevel,
  }

  if (!canRoleRunAction(session.role, actionPolicy.id)) {
    await logCustomerAction({
      requestId,
      tenantId: tenant.id,
      userId: session.userId,
      role: session.role,
      endpointId: null,
      action: actionPolicy.id,
      result: 'blocked',
      error: 'role_not_allowed',
      metadata: baseMetadata,
    })

    return NextResponse.json(
      { error: 'Your role cannot run this action.', requestId },
      { status: 403 },
    )
  }

  if (tenant.pilotMode && !isPilotModeActionAllowed(actionPolicy.id)) {
    await logCustomerAction({
      requestId,
      tenantId: tenant.id,
      userId: session.userId,
      role: session.role,
      endpointId: null,
      action: actionPolicy.id,
      result: 'blocked',
      error: 'pilot_mode_restriction',
      metadata: baseMetadata,
    })

    return NextResponse.json(
      { error: 'Action is blocked in pilot mode.', requestId },
      { status: 403 },
    )
  }

  if (actionPolicy.requiresConfirmation && !body.confirmed) {
    await logCustomerAction({
      requestId,
      tenantId: tenant.id,
      userId: session.userId,
      role: session.role,
      endpointId: null,
      action: actionPolicy.id,
      result: 'blocked',
      error: 'confirmation_required',
      metadata: baseMetadata,
    })

    return NextResponse.json(
      {
        error: 'confirmation_required',
        requestId,
        message: `Confirm you want to run "${actionPolicy.label}" for tenant ${tenant.slug}. This stays inside customer-safe boundaries.`,
        confirmationHint: 'POST again with { "confirmed": true }',
      },
      { status: 428 },
    )
  }

  const routed = await routeTenantAction({
    tenantId: tenant.id,
    action: actionPolicy.id,
    actor: session.email,
  })

  await logCustomerAction({
    requestId,
    tenantId: tenant.id,
    userId: session.userId,
    role: session.role,
    endpointId: routed.endpointId,
    action: actionPolicy.id,
    result: routed.ok ? 'allowed' : 'failed',
    error: routed.ok ? null : routed.failureCode ?? 'routing_failed',
    metadata: {
      ...baseMetadata,
      summary: routed.summary,
      endpointStatus: routed.endpointStatus == null ? 'none' : String(routed.endpointStatus),
      failureCode: routed.failureCode ?? 'none',
      attemptedRoutes:
        routed.attemptedRoutes.length > 0
          ? routed.attemptedRoutes.slice(0, 6).join(' | ')
          : 'none',
    },
  })

  if (!routed.ok) {
    const status = routed.failureCode === 'endpoint_timeout' ? 504 : 502

    return NextResponse.json(
      {
        ok: false,
        error: routed.summary,
        requestId,
        summary: routed.summary,
        endpointErrorCode: routed.failureCode,
        endpointStatus: routed.endpointStatus,
        attemptedRoutes: routed.attemptedRoutes,
        pilotMode: tenant.pilotMode,
      },
      { status },
    )
  }

  return NextResponse.json({
    ok: true,
    requestId,
    summary: routed.summary,
    endpointStatus: routed.endpointStatus,
    pilotMode: tenant.pilotMode,
  })
}
