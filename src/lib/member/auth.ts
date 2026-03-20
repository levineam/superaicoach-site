import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/mission-control/session'
import { type SessionPayload } from '@/lib/mission-control/types'

/**
 * Get the currently authenticated user session, or null if not logged in.
 */
export async function getSessionUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) return null

  return verifySessionToken(token)
}

/**
 * Require authentication. Redirects to /sign-in if not logged in.
 * Returns the session payload if authenticated.
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSessionUser()

  if (!session) {
    redirect('/sign-in?next=/member')
  }

  return session
}
