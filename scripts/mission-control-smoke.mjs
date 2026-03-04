#!/usr/bin/env node

const baseUrl =
  process.env.MISSION_CONTROL_SMOKE_BASE_URL ||
  process.argv[2] ||
  'http://localhost:3000'

const smokeEmail =
  process.env.MISSION_CONTROL_SMOKE_EMAIL ||
  process.env.MISSION_CONTROL_DEFAULT_OWNER_EMAIL ||
  'vai.owner@example.com'

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function parseJson(response) {
  const text = await response.text()

  try {
    return text ? JSON.parse(text) : {}
  } catch {
    throw new Error(`Expected JSON but got: ${text.slice(0, 180)}`)
  }
}

function extractCookieHeader(response) {
  const setCookie = response.headers.get('set-cookie')

  if (!setCookie) {
    return null
  }

  const match = setCookie.match(/sac_mc_session=[^;]+/)
  return match ? match[0] : null
}

async function main() {
  console.log(`Smoke base URL: ${baseUrl}`)
  console.log(`Smoke email: ${smokeEmail}`)

  const magicResponse = await fetch(`${baseUrl}/api/auth/magic-link`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: smokeEmail }),
  })

  const magicPayload = await parseJson(magicResponse)
  assertCondition(magicResponse.ok, `Magic link failed (${magicResponse.status})`)
  assertCondition(
    typeof magicPayload.magicLinkPreview === 'string' && magicPayload.magicLinkPreview.length > 0,
    'magicLinkPreview missing from /api/auth/magic-link response',
  )

  console.log(`✓ Magic link issued (${magicResponse.status})`)

  const verifyResponse = await fetch(magicPayload.magicLinkPreview, {
    method: 'GET',
    redirect: 'manual',
  })

  assertCondition(
    verifyResponse.status >= 300 && verifyResponse.status < 400,
    `Expected redirect from /auth/verify, got ${verifyResponse.status}`,
  )

  const sessionCookie = extractCookieHeader(verifyResponse)
  assertCondition(Boolean(sessionCookie), 'No session cookie returned from /auth/verify')

  const redirectLocation = verifyResponse.headers.get('location')
  assertCondition(Boolean(redirectLocation), 'No redirect location returned from /auth/verify')

  const tenantUrl = new URL(redirectLocation, baseUrl).toString()
  console.log(`✓ Session cookie minted, redirecting to ${tenantUrl}`)

  const tenantResponse = await fetch(tenantUrl, {
    headers: {
      cookie: sessionCookie,
    },
  })

  const tenantHtml = await tenantResponse.text()
  assertCondition(tenantResponse.ok, `Tenant shell load failed (${tenantResponse.status})`)
  assertCondition(
    tenantHtml.includes('Mission Control') && tenantHtml.includes('Vai Pilot Tenant'),
    'Tenant shell HTML missing expected Mission Control markers',
  )

  console.log(`✓ Tenant shell loaded (${tenantResponse.status})`)

  const actionConfirmRequiredResponse = await fetch(`${baseUrl}/api/mission-control/actions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: sessionCookie,
    },
    body: JSON.stringify({ actionId: 'run_last_safe_workflow' }),
  })

  const actionConfirmRequiredPayload = await parseJson(actionConfirmRequiredResponse)
  assertCondition(
    actionConfirmRequiredResponse.status === 428,
    `Expected 428 confirmation_required, got ${actionConfirmRequiredResponse.status}`,
  )
  assertCondition(
    actionConfirmRequiredPayload.error === 'confirmation_required',
    'Confirmation-required payload missing expected error value',
  )

  console.log('✓ Confirmation guard validated (428)')

  const actionConfirmedResponse = await fetch(`${baseUrl}/api/mission-control/actions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: sessionCookie,
    },
    body: JSON.stringify({ actionId: 'refresh_status', confirmed: true }),
  })

  const actionConfirmedPayload = await parseJson(actionConfirmedResponse)
  assertCondition(actionConfirmedResponse.ok, `Confirmed action failed (${actionConfirmedResponse.status})`)
  assertCondition(
    typeof actionConfirmedPayload.summary === 'string' && actionConfirmedPayload.summary.length > 0,
    'Confirmed action payload missing summary',
  )

  console.log(`✓ Confirmed action returned summary: ${actionConfirmedPayload.summary}`)

  const auditResponse = await fetch(`${baseUrl}/api/mission-control/audit`, {
    headers: {
      cookie: sessionCookie,
    },
  })

  const auditPayload = await parseJson(auditResponse)
  assertCondition(auditResponse.ok, `Audit endpoint failed (${auditResponse.status})`)
  assertCondition(Array.isArray(auditPayload.events), 'Audit payload missing events array')

  console.log(`✓ Audit loaded (${auditPayload.events.length} events)`)
  console.log('SMOKE_OK')
}

main().catch((error) => {
  console.error('SMOKE_FAILED', error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
