import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { createUser, getUserByEmail } from '@/lib/mission-control/auth'
import { ensureTenantExists } from '@/lib/mission-control/data-access'
import { createSessionToken, SESSION_COOKIE_NAME } from '@/lib/mission-control/session'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; password?: string }
    const email = body.email?.trim().toLowerCase()
    const password = body.password

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Email and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ ok: false, error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // Check if user already exists
    const existing = await getUserByEmail(email)
    if (existing) {
      return NextResponse.json({ ok: false, error: 'An account with this email already exists' }, { status: 409 })
    }

    // Create the user — self-registered accounts own their workspace (single-tenant model).
    const result = await createUser(email, password, 'owner')
    if (!result.success || !result.user) {
      return NextResponse.json({ ok: false, error: result.error || 'Failed to create account' }, { status: 500 })
    }

    // Ensure the tenant exists so tenant-scoped session payloads always carry a UUID.
    const tenantSlug = result.user.tenant_slug || 'default'
    const tenant = await ensureTenantExists({
      slug: tenantSlug,
      name: `${email}'s Workspace`,
      pilotMode: false,
    })

    // Auto-sign-in: create HMAC-signed session token using the persisted role.
    // createUser is called with 'owner' above, so this will always resolve to 'owner'.
    // The allowedRoles guard ensures we never accidentally serialize 'admin' or an unknown role.
    const allowedRoles = ['owner', 'team_member', 'coach'] as const
    type SignUpRole = (typeof allowedRoles)[number]
    const safeRole: SignUpRole = (allowedRoles as readonly string[]).includes(result.user.role)
      ? (result.user.role as SignUpRole)
      : 'owner'
    const signedToken = createSessionToken({
      userId: result.user.id,
      tenantId: tenant.id,
      tenantSlug,
      role: safeRole,
      email,
    })

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, signedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    })

    return NextResponse.json({ ok: true, userId: result.user.id })
  } catch (error) {
    console.error('Sign-up error:', error)
    return NextResponse.json({ ok: false, error: 'Sign-up failed' }, { status: 500 })
  }
}
