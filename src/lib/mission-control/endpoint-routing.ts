import {
  appendTenantActivity,
  getPrimaryEndpointForTenant,
} from '@/lib/mission-control/data-access'
import { decryptToken } from '@/lib/mission-control/crypto'
import {
  type CustomerActionId,
  type TenantOpenClawEndpointRecord,
} from '@/lib/mission-control/types'

export interface RoutedEndpoint {
  endpoint: TenantOpenClawEndpointRecord
  bearerToken: string
}

export type EndpointFailureCode =
  | 'endpoint_unauthorized'
  | 'endpoint_forbidden'
  | 'endpoint_not_found'
  | 'endpoint_method_not_allowed'
  | 'endpoint_http_error'
  | 'endpoint_rejected'
  | 'endpoint_invalid_response'
  | 'endpoint_timeout'
  | 'endpoint_unreachable'

export interface RouteTenantActionResult {
  ok: boolean
  summary: string
  endpointId: string | null
  endpointStatus: number | null
  failureCode: EndpointFailureCode | null
  attemptedRoutes: string[]
}

type EndpointHttpMethod = 'GET' | 'POST'

interface EndpointActionResponse {
  ok?: boolean
  summary?: string
  message?: string
  error?: string
}

interface EndpointPayload {
  json: EndpointActionResponse | null
  text: string
}

interface EndpointAttemptPlan {
  method: EndpointHttpMethod
  path: string
  reason: string
}

interface EndpointAttemptFailure {
  ok: false
  endpointStatus: number | null
  failureCode: EndpointFailureCode
  summary: string
  shouldTryFallback: boolean
}

interface EndpointAttemptSuccess {
  ok: true
  summary: string
}

function endpointActionPath(): string {
  return process.env.MISSION_CONTROL_ENDPOINT_ACTION_PATH || '/api/mission-control/customer-action'
}

function endpointActionMethod(): EndpointHttpMethod {
  const configured = (process.env.MISSION_CONTROL_ENDPOINT_ACTION_METHOD || 'POST').trim().toUpperCase()
  return configured === 'GET' ? 'GET' : 'POST'
}

function endpointFallbackMethods(): EndpointHttpMethod[] {
  const configured =
    process.env.MISSION_CONTROL_ENDPOINT_ACTION_FALLBACK_METHODS ||
    (endpointActionMethod() === 'POST' ? 'GET' : 'POST')

  return parseMethods(configured)
}

function endpointFallbackPaths(): string[] {
  const configured = process.env.MISSION_CONTROL_ENDPOINT_ACTION_FALLBACK_PATHS

  if (configured && configured.trim().length > 0) {
    return parsePathList(configured)
  }

  return ['/api/mission-control/actions']
}

function endpointTimeoutMs(): number {
  const parsed = Number(process.env.MISSION_CONTROL_ENDPOINT_TIMEOUT_MS || '15000')
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 15000
}

function endpointSimulationOnly(): boolean {
  return process.env.MISSION_CONTROL_ENDPOINT_SIMULATION_ONLY === 'true'
}

function parsePathList(value: string): string[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
}

function parseMethods(value: string): EndpointHttpMethod[] {
  const methods = value
    .split(',')
    .map((part) => part.trim().toUpperCase())
    .filter((part) => part === 'GET' || part === 'POST') as EndpointHttpMethod[]

  return dedupe(methods)
}

function dedupe<T>(items: T[]): T[] {
  return Array.from(new Set(items))
}

function joinUrl(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}`
}

function summaryFromPayload(payload: EndpointActionResponse | null): string | null {
  if (!payload) {
    return null
  }

  if (typeof payload.summary === 'string' && payload.summary.trim()) {
    return payload.summary.trim()
  }

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message.trim()
  }

  if (typeof payload.error === 'string' && payload.error.trim()) {
    return payload.error.trim()
  }

  return null
}

function isReadOnlyAction(action: CustomerActionId): boolean {
  return action === 'view_status' || action === 'view_activity' || action === 'refresh_status'
}

function readOnlyFallbackPaths(action: CustomerActionId): string[] {
  if (action === 'view_status' || action === 'refresh_status') {
    return ['/api/mission-control/status', '/api/mission-control/health']
  }

  if (action === 'view_activity') {
    return ['/api/mission-control/activity']
  }

  return []
}

function buildAttemptPlans(action: CustomerActionId): EndpointAttemptPlan[] {
  const plans: EndpointAttemptPlan[] = []
  const seen = new Set<string>()
  const primaryPath = endpointActionPath()
  const primaryMethod = endpointActionMethod()
  const fallbackPaths = endpointFallbackPaths()
  const fallbackMethods = endpointFallbackMethods()

  const addPlan = (method: EndpointHttpMethod, path: string, reason: string) => {
    if (method === 'GET' && !isReadOnlyAction(action)) {
      return
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    const key = `${method}:${normalizedPath}`
    if (seen.has(key)) {
      return
    }

    seen.add(key)
    plans.push({ method, path: normalizedPath, reason })
  }

  addPlan(primaryMethod, primaryPath, 'primary')

  if (isReadOnlyAction(action)) {
    for (const path of readOnlyFallbackPaths(action)) {
      addPlan('GET', path, 'read-only-fallback')
    }
  }

  for (const path of fallbackPaths) {
    addPlan(primaryMethod, path, 'path-fallback')
  }

  for (const method of fallbackMethods) {
    addPlan(method, primaryPath, 'method-fallback')
  }

  for (const path of fallbackPaths) {
    for (const method of fallbackMethods) {
      addPlan(method, path, 'method-path-fallback')
    }
  }

  return plans
}

function classifyHttpFailure(status: number): EndpointFailureCode {
  if (status === 401) return 'endpoint_unauthorized'
  if (status === 403) return 'endpoint_forbidden'
  if (status === 404) return 'endpoint_not_found'
  if (status === 405) return 'endpoint_method_not_allowed'
  return 'endpoint_http_error'
}

function defaultFailureSummary(action: CustomerActionId, status: number, code: EndpointFailureCode): string {
  if (code === 'endpoint_unauthorized') {
    return `Endpoint authentication failed (401) while handling ${action}. Verify endpoint token.`
  }

  if (code === 'endpoint_forbidden') {
    return `Endpoint denied access (403) for ${action}. Verify endpoint permissions.`
  }

  if (code === 'endpoint_not_found') {
    return `Endpoint route not found (404) for ${action}. Check action path configuration.`
  }

  if (code === 'endpoint_method_not_allowed') {
    return `Endpoint rejected method (405) for ${action}.`
  }

  return `Endpoint returned ${status} while handling ${action}.`
}

async function parseEndpointPayload(response: Response): Promise<EndpointPayload> {
  const text = await response.text()

  if (!text.trim()) {
    return { json: null, text }
  }

  try {
    return {
      json: JSON.parse(text) as EndpointActionResponse,
      text,
    }
  } catch {
    return {
      json: null,
      text,
    }
  }
}

function buildRequestBody(params: {
  action: CustomerActionId
  tenantId: string
  actor: string
}): Record<string, string> {
  return {
    actionId: params.action,
    action: params.action,
    tenantId: params.tenantId,
    tenant_id: params.tenantId,
    actor: params.actor,
    source: 'superaicoach-mission-control',
  }
}

function buildAttemptUrl(baseUrl: string, path: string, method: EndpointHttpMethod, body: Record<string, string>): string {
  const endpointUrl = joinUrl(baseUrl, path)

  if (method !== 'GET') {
    return endpointUrl
  }

  const url = new URL(endpointUrl)
  for (const [key, value] of Object.entries(body)) {
    url.searchParams.set(key, value)
  }

  return url.toString()
}

async function executeAttempt(params: {
  routed: RoutedEndpoint
  action: CustomerActionId
  tenantId: string
  actor: string
  plan: EndpointAttemptPlan
}): Promise<EndpointAttemptFailure | EndpointAttemptSuccess> {
  const requestBody = buildRequestBody({
    action: params.action,
    tenantId: params.tenantId,
    actor: params.actor,
  })

  const attemptUrl = buildAttemptUrl(
    params.routed.endpoint.baseUrl,
    params.plan.path,
    params.plan.method,
    requestBody,
  )

  const abort = AbortSignal.timeout(endpointTimeoutMs())

  try {
    const response = await fetch(attemptUrl, {
      method: params.plan.method,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${params.routed.bearerToken}`,
      },
      body: params.plan.method === 'POST' ? JSON.stringify(requestBody) : undefined,
      signal: abort,
    })

    const payload = await parseEndpointPayload(response)

    if (!response.ok) {
      const failureCode = classifyHttpFailure(response.status)
      const summary =
        summaryFromPayload(payload.json) ||
        defaultFailureSummary(params.action, response.status, failureCode)

      return {
        ok: false,
        endpointStatus: response.status,
        failureCode,
        summary,
        shouldTryFallback: response.status === 404 || response.status === 405,
      }
    }

    const payloadSummary = summaryFromPayload(payload.json)

    if (payload.json?.ok === false) {
      return {
        ok: false,
        endpointStatus: response.status,
        failureCode: 'endpoint_rejected',
        summary:
          payloadSummary ||
          `Endpoint rejected ${params.action} for ${params.routed.endpoint.endpointLabel}.`,
        shouldTryFallback: false,
      }
    }

    if (!payload.json && payload.text.trim().length > 0) {
      return {
        ok: true,
        summary: `Action ${params.action} routed to ${params.routed.endpoint.endpointLabel}.`,
      }
    }

    if (!payload.json && payload.text.trim().length === 0) {
      return {
        ok: false,
        endpointStatus: response.status,
        failureCode: 'endpoint_invalid_response',
        summary: 'Endpoint responded without JSON. Configure a customer-action adapter response.',
        shouldTryFallback: false,
      }
    }

    return {
      ok: true,
      summary:
        payloadSummary ||
        `Action ${params.action} routed to ${params.routed.endpoint.endpointLabel}.`,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error'
    const timedOut =
      (error instanceof Error && error.name === 'TimeoutError') ||
      message.toLowerCase().includes('timeout')

    return {
      ok: false,
      endpointStatus: null,
      failureCode: timedOut ? 'endpoint_timeout' : 'endpoint_unreachable',
      summary: timedOut
        ? `Endpoint timed out while handling ${params.action}.`
        : `Failed to reach endpoint ${params.routed.endpoint.endpointLabel}.`,
      shouldTryFallback: false,
    }
  }
}

export async function resolveTenantEndpoint(tenantId: string): Promise<RoutedEndpoint | null> {
  const endpoint = await getPrimaryEndpointForTenant(tenantId)

  if (!endpoint) {
    return null
  }

  return {
    endpoint,
    bearerToken: decryptToken(endpoint.encryptedToken),
  }
}

export async function routeTenantAction(params: {
  tenantId: string
  action: CustomerActionId
  actor: string
}): Promise<RouteTenantActionResult> {
  const routed = await resolveTenantEndpoint(params.tenantId)

  if (!routed) {
    return {
      ok: false,
      summary: 'No endpoint is mapped to this tenant yet.',
      endpointId: null,
      endpointStatus: null,
      failureCode: 'endpoint_not_found',
      attemptedRoutes: [],
    }
  }

  if (endpointSimulationOnly()) {
    const maskedTokenPreview = `${routed.bearerToken.slice(0, 4)}***`

    await appendTenantActivity({
      tenantId: params.tenantId,
      actor: params.actor,
      summary: `Simulated action ${params.action} to ${routed.endpoint.endpointLabel} (${maskedTokenPreview}).`,
      outcome: 'ok',
    })

    return {
      ok: true,
      summary: `Action ${params.action} simulated for ${routed.endpoint.endpointLabel}.`,
      endpointId: routed.endpoint.id,
      endpointStatus: 200,
      failureCode: null,
      attemptedRoutes: [],
    }
  }

  const plans = buildAttemptPlans(params.action)
  const attemptedRoutes: string[] = []
  let lastFailure: EndpointAttemptFailure | null = null

  for (const plan of plans) {
    attemptedRoutes.push(`${plan.method} ${plan.path} (${plan.reason})`)

    const attempt = await executeAttempt({
      routed,
      action: params.action,
      tenantId: params.tenantId,
      actor: params.actor,
      plan,
    })

    if (attempt.ok) {
      await appendTenantActivity({
        tenantId: params.tenantId,
        actor: params.actor,
        summary: attempt.summary,
        outcome: 'ok',
      })

      return {
        ok: true,
        summary: attempt.summary,
        endpointId: routed.endpoint.id,
        endpointStatus: 200,
        failureCode: null,
        attemptedRoutes,
      }
    }

    lastFailure = attempt

    if (!attempt.shouldTryFallback) {
      break
    }
  }

  const failure =
    lastFailure ||
    ({
      ok: false,
      endpointStatus: null,
      failureCode: 'endpoint_unreachable',
      summary: `Failed to reach endpoint ${routed.endpoint.endpointLabel}.`,
      shouldTryFallback: false,
    } as EndpointAttemptFailure)

  const routesTried = attemptedRoutes.length > 0 ? ` Routes tried: ${attemptedRoutes.join(' → ')}` : ''

  await appendTenantActivity({
    tenantId: params.tenantId,
    actor: 'system',
    summary: `Action ${params.action} failed at ${routed.endpoint.endpointLabel}: ${failure.summary}.${routesTried}`,
    outcome: failure.failureCode === 'endpoint_timeout' || failure.failureCode === 'endpoint_unreachable' ? 'error' : 'warning',
  })

  return {
    ok: false,
    summary: failure.summary,
    endpointId: routed.endpoint.id,
    endpointStatus: failure.endpointStatus,
    failureCode: failure.failureCode,
    attemptedRoutes,
  }
}
