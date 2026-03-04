import { createHmac, timingSafeEqual } from 'node:crypto'

import { SESSION_COOKIE_NAME } from '@/lib/mission-control/session-constants'
import { type SessionPayload } from '@/lib/mission-control/types'

export { SESSION_COOKIE_NAME }

const SESSION_DURATION_MS = 1000 * 60 * 60 * 8

function sessionSecret(): string {
  return process.env.MISSION_CONTROL_SESSION_SECRET || 'superaicoach-mission-control-dev-session-secret'
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url')
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function sign(data: string): string {
  return createHmac('sha256', sessionSecret()).update(data).digest('base64url')
}

function isSignatureValid(payload: string, signature: string): boolean {
  const expectedSignature = sign(payload)

  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (signatureBuffer.byteLength !== expectedBuffer.byteLength) {
    return false
  }

  return timingSafeEqual(signatureBuffer, expectedBuffer)
}

export function createSessionToken(input: Omit<SessionPayload, 'expiresAt'>): string {
  const payload: SessionPayload = {
    ...input,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
  }

  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  return `${encodedPayload}.${sign(encodedPayload)}`
}

export function verifySessionToken(sessionToken: string): SessionPayload | null {
  const [payload, signature] = sessionToken.split('.')

  if (!payload || !signature) {
    return null
  }

  if (!isSignatureValid(payload, signature)) {
    return null
  }

  try {
    const session = JSON.parse(base64UrlDecode(payload)) as SessionPayload

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      return null
    }

    return session
  } catch {
    return null
  }
}
