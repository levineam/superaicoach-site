import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { authenticateWithPassword } from '@/lib/mission-control/auth'
import { getMembershipForUserAndTenant, getTenantBySlug } from '@/lib/mission-control/data-access'
import { createSessionToken, SESSION_COOKIE_NAME } from '@/lib/mission-control/session'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; password?: string }
    const email = body.email?.trim()
    const password = body.password

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Email and password are required' }, { status: 400 })
    }

    const result = await authenticateWithPassword(email, password)

    if ('error' in result) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 401 })
    }

    // Resolve tenant ID from slug so audit and tenant-scoped queries use the correct key.
    const tenantSlug = result.tenantSlug || 'default'
    const tenant = await getTenantBySlug(tenantSlug)
    const tenantId = tenant?.id ?? result.userId // fallback: use userId (single-tenant dev mode)

    // Resolve role from tenant membership so session.role matches what Mission Control
    // permission checks (canRoleRunAction, getMembershipForUserAndTenant) expect.
    // Fall back to users.role sanitized to a valid MembershipRole when no membership row exists.
    const allowedRoles = ['owner', 'team_member', 'coach'] as const
    type MembershipRole = (typeof allowedRoles)[number]
    let safeRole: MembershipRole
    if (tenant) {
      const membership = await getMembershipForUserAndTenant(result.userId, tenant.id)
      safeRole = (membership?.role as MembershipRole | undefined) ??
        ((allowedRoles as readonly string[]).includes(result.role)
          ? (result.role as MembershipRole)
          : 'owner')
    } else {
      safeRole = (allowedRoles as readonly string[]).includes(result.role)
        ? (result.role as MembershipRole)
        : 'owner'
    }
    const signedToken = createSessionToken({
      userId: result.userId,
      tenantId,
      tenantSlug,
      role: safeRole,
      email: email,
    })

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, signedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours (matches session.ts SESSION_DURATION_MS)
    })

    return NextResponse.json({
      ok: true,
      userId: result.userId,
    })
  } catch (error) {
    console.error('Password auth error:', error)
    return NextResponse.json(
      { ok: false, error: 'Authentication failed' },
      { status: 500 },
    )
  }
}
