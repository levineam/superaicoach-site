#!/usr/bin/env node

const endpointBaseUrl =
  process.env.MISSION_CONTROL_HANDSHAKE_ENDPOINT_URL || process.env.MISSION_CONTROL_VAI_ENDPOINT_URL
const endpointToken =
  process.env.MISSION_CONTROL_HANDSHAKE_ENDPOINT_TOKEN || process.env.MISSION_CONTROL_VAI_ENDPOINT_TOKEN

const action =
  process.env.MISSION_CONTROL_HANDSHAKE_ACTION || process.argv[2] || 'view_status'

const tenantId =
  process.env.MISSION_CONTROL_HANDSHAKE_TENANT_ID || process.env.MISSION_CONTROL_DEFAULT_TENANT_SLUG || 'tenant_vai'

const actor =
  process.env.MISSION_CONTROL_HANDSHAKE_ACTOR || 'mission-control-endpoint-handshake@superaicoach.local'

const source = 'superaicoach-mission-control-handshake'

function fail(message) {
  console.error(`HANDSHAKE_FAILED ${message}`)
  process.exitCode = 1
}

function parseList(value) {
  if (!value) return []
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
}

function parseMethods(value) {
  return Array.from(
    new Set(
      parseList(value)
        .map((part) => part.toUpperCase())
        .filter((part) => part === 'GET' || part === 'POST'),
    ),
  )
}

function isReadOnlyAction(actionId) {
  return actionId === 'view_status' || actionId === 'view_activity' || actionId === 'refresh_status'
}

function readFallbackPaths(actionId) {
  if (actionId === 'view_status' || actionId === 'refresh_status') {
    return ['/api/mission-control/status', '/api/mission-control/health']
  }

  if (actionId === 'view_activity') {
    return ['/api/mission-control/activity']
  }

  return []
}

function classifyStatus(status) {
  if (status === 401) return 'endpoint_unauthorized'
  if (status === 403) return 'endpoint_forbidden'
  if (status === 404) return 'endpoint_not_found'
  if (status === 405) return 'endpoint_method_not_allowed'
  if (status >= 500) return 'endpoint_server_error'
  return 'endpoint_http_error'
}

function joinUrl(baseUrl, path) {
  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}`
}

function addAttempt(attempts, seen, method, path, reason, allowGet) {
  const normalizedMethod = method.toUpperCase()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (normalizedMethod === 'GET' && !allowGet) {
    return
  }

  const key = `${normalizedMethod}:${normalizedPath}`
  if (seen.has(key)) {
    return
  }

  seen.add(key)
  attempts.push({ method: normalizedMethod, path: normalizedPath, reason })
}

function buildAttempts() {
  const primaryPath = process.env.MISSION_CONTROL_ENDPOINT_ACTION_PATH || '/api/mission-control/customer-action'
  const primaryMethod = (process.env.MISSION_CONTROL_ENDPOINT_ACTION_METHOD || 'POST').toUpperCase()
  const fallbackPaths =
    parseList(process.env.MISSION_CONTROL_ENDPOINT_ACTION_FALLBACK_PATHS) || ['/api/mission-control/actions']
  const parsedFallbackPaths = fallbackPaths.length > 0 ? fallbackPaths : ['/api/mission-control/actions']
  const fallbackMethods =
    parseMethods(process.env.MISSION_CONTROL_ENDPOINT_ACTION_FALLBACK_METHODS) ||
    (primaryMethod === 'POST' ? ['GET'] : ['POST'])

  const allowGet = isReadOnlyAction(action)
  const attempts = []
  const seen = new Set()

  addAttempt(attempts, seen, primaryMethod, primaryPath, 'primary', allowGet)

  if (allowGet) {
    for (const path of readFallbackPaths(action)) {
      addAttempt(attempts, seen, 'GET', path, 'read-only-fallback', allowGet)
    }
  }

  for (const path of parsedFallbackPaths) {
    addAttempt(attempts, seen, primaryMethod, path, 'path-fallback', allowGet)
  }

  for (const method of fallbackMethods) {
    addAttempt(attempts, seen, method, primaryPath, 'method-fallback', allowGet)
  }

  for (const path of parsedFallbackPaths) {
    for (const method of fallbackMethods) {
      addAttempt(attempts, seen, method, path, 'method-path-fallback', allowGet)
    }
  }

  return attempts
}

function buildBody() {
  return {
    actionId: action,
    action,
    tenantId,
    tenant_id: tenantId,
    actor,
    source,
  }
}

function buildAttemptUrl(path, method, body) {
  const endpointUrl = joinUrl(endpointBaseUrl, path)

  if (method !== 'GET') {
    return endpointUrl
  }

  const url = new URL(endpointUrl)
  for (const [key, value] of Object.entries(body)) {
    url.searchParams.set(key, value)
  }

  return url.toString()
}

async function parsePayload(response) {
  const text = await response.text()

  try {
    return {
      json: text ? JSON.parse(text) : null,
      text,
    }
  } catch {
    return {
      json: null,
      text,
    }
  }
}

async function main() {
  if (!endpointBaseUrl || !endpointToken) {
    fail(
      'missing endpoint credentials. Set MISSION_CONTROL_VAI_ENDPOINT_URL + MISSION_CONTROL_VAI_ENDPOINT_TOKEN (or handshake-specific overrides).',
    )
    return
  }

  const attempts = buildAttempts()
  const body = buildBody()

  console.log(`Handshake action: ${action}`)
  console.log(`Endpoint base URL: ${endpointBaseUrl}`)
  console.log(`Attempt plan count: ${attempts.length}`)

  let lastFailure = null

  for (let index = 0; index < attempts.length; index += 1) {
    const attempt = attempts[index]
    const url = buildAttemptUrl(attempt.path, attempt.method, body)

    const response = await fetch(url, {
      method: attempt.method,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${endpointToken}`,
      },
      body: attempt.method === 'POST' ? JSON.stringify(body) : undefined,
    })

    const payload = await parsePayload(response)
    const summary =
      (payload.json && (payload.json.summary || payload.json.message || payload.json.error)) ||
      payload.text.slice(0, 120) ||
      'no-body'

    if (response.ok && (!payload.json || payload.json.ok !== false)) {
      console.log(
        `✓ Attempt ${index + 1}: ${attempt.method} ${attempt.path} (${attempt.reason}) -> ${response.status} (${summary})`,
      )
      console.log('HANDSHAKE_OK')
      return
    }

    const classification = classifyStatus(response.status)
    const line = `✗ Attempt ${index + 1}: ${attempt.method} ${attempt.path} (${attempt.reason}) -> ${response.status} [${classification}] (${summary})`
    console.log(line)

    lastFailure = {
      status: response.status,
      classification,
      attempt,
      summary,
    }

    if (response.status !== 404 && response.status !== 405) {
      fail(`stopped on non-fallback failure (${response.status} ${classification})`)
      return
    }
  }

  if (lastFailure) {
    fail(
      `no compatible endpoint contract found (last ${lastFailure.status} ${lastFailure.classification} at ${lastFailure.attempt.method} ${lastFailure.attempt.path})`,
    )
    return
  }

  fail('no attempts were generated')
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error))
})
