import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'

import {
  consumeMagicLinkToken,
  createMagicLinkToken,
  findOrCreateUserByEmail,
  findUserByEmail,
  findUserById,
  getDefaultMembershipForUser,
  getTenantById,
  setUserPassword,
} from '@/lib/mission-control/data-access'
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from '@/lib/mission-control/session'
import { type SessionPayload } from '@/lib/mission-control/types'

const BCRYPT_ROUNDS = 12

interface MagicLinkResult {
  magicLink: string
  expiresAt: string
  userId: string
  tenantId: string
  role: SessionPayload['role']
}

export async function issueMagicLink(email: string, origin: string): Promise<MagicLinkResult> {
  const user = await findOrCreateUserByEmail(email)
  const membership = await getDefaultMembershipForUser(user.id)

  if (!membership) {
    throw new Error('No tenant membership found for this user')
  }

  const magicToken = await createMagicLinkToken({
    userId: user.id,
    tenantId: membership.tenantId,
    role: membership.role,
  })

  const magicLink = `${origin}/auth/verify?token=${magicToken.token}`

  return {
    magicLink,
    expiresAt: magicToken.expiresAt,
    userId: user.id,
    tenantId: membership.tenantId,
    role: membership.role,
  }
}

export async function consumeMagicLinkAndCreateSession(token: string): Promise<{
  sessionToken: string
  tenantSlug: string
} | null> {
  const magicLink = await consumeMagicLinkToken(token)

  if (!magicLink) {
    return null
  }

  const user = await findUserById(magicLink.userId)
  const tenant = await getTenantById(magicLink.tenantId)

  if (!user || !tenant) {
    return null
  }

  const sessionToken = createSessionToken({
    userId: user.id,
    tenantId: tenant.id,
    tenantSlug: tenant.slug,
    role: magicLink.role,
    email: user.email,
  })

  return {
    sessionToken,
    tenantSlug: tenant.slug,
  }
}

export async function getServerSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionToken) {
    return null
  }

  return verifySessionToken(sessionToken)
}

/**
 * ------------------------------
 * Password authentication
 * ------------------------------
 */

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

interface PasswordAuthResult {
  sessionToken: string
  tenantSlug: string
  userId: string
  tenantId: string
  role: SessionPayload['role']
}

export async function authenticateWithPassword(
  email: string,
  password: string,
): Promise<PasswordAuthResult | { error: string }> {
  const user = await findUserByEmail(email)

  if (!user) {
    return { error: 'Invalid email or password' }
  }

  if (!user.passwordHash) {
    return { error: 'Password login not enabled for this account. Use magic link.' }
  }

  const isValid = await verifyPassword(password, user.passwordHash)

  if (!isValid) {
    return { error: 'Invalid email or password' }
  }

  const membership = await getDefaultMembershipForUser(user.id)

  if (!membership) {
    return { error: 'No tenant membership found for this user' }
  }

  const tenant = await getTenantById(membership.tenantId)

  if (!tenant) {
    return { error: 'Tenant not found' }
  }

  const sessionToken = createSessionToken({
    userId: user.id,
    tenantId: tenant.id,
    tenantSlug: tenant.slug,
    role: membership.role,
    email: user.email,
  })

  return {
    sessionToken,
    tenantSlug: tenant.slug,
    userId: user.id,
    tenantId: tenant.id,
    role: membership.role,
  }
}

export async function setPasswordForUser(
  userId: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  const user = await findUserById(userId)

  if (!user) {
    return { success: false, error: 'User not found' }
  }

  const passwordHash = await hashPassword(newPassword)
  const updated = await setUserPassword(userId, passwordHash)

  if (!updated) {
    return { success: false, error: 'Failed to update password' }
  }

  return { success: true }
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  const user = await findUserById(userId)

  if (!user) {
    return { success: false, error: 'User not found' }
  }

  // If user has no password set, they can set one without verifying current
  if (user.passwordHash) {
    const isCurrentValid = await verifyPassword(currentPassword, user.passwordHash)
    if (!isCurrentValid) {
      return { success: false, error: 'Current password is incorrect' }
    }
  }

  const passwordHash = await hashPassword(newPassword)
  const updated = await setUserPassword(userId, passwordHash)

  if (!updated) {
    return { success: false, error: 'Failed to update password' }
  }

  return { success: true }
}
