import { SESSION_COOKIE_NAME } from '@/lib/mission-control/session-constants'
import { type SessionPayload } from '@/lib/mission-control/types'

export { SESSION_COOKIE_NAME }

function sessionSecret(): string {
  return process.env.MISSION_CONTROL_SESSION_SECRET || 'superaicoach-mission-control-dev-session-secret'
}

function decodeBase64Url(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  return atob(padded)
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(sessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return encodeBase64Url(new Uint8Array(signature))
}

function signaturesEqual(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false
  }

  let result = 0
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }

  return result === 0
}

export async function verifySessionTokenEdge(token: string): Promise<SessionPayload | null> {
  const [payload, signature] = token.split('.')

  if (!payload || !signature) {
    return null
  }

  const expected = await sign(payload)

  if (!signaturesEqual(signature, expected)) {
    return null
  }

  try {
    const session = JSON.parse(decodeBase64Url(payload)) as SessionPayload

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      return null
    }

    return session
  } catch {
    return null
  }
}
