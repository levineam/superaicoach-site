import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { createTenantSlugFromEmail, createUser, createWorkspaceNameFromEmail, getUserByEmail, normalizeEmail, toMembershipRole } from '@/lib/mission-control/auth'
import { ensureTenantExists } from '@/lib/mission-control/data-access'
import { createSessionToken, SESSION_COOKIE_NAME } from '@/lib/mission-control/session'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; password?: string }
    const email = body.email ? normalizeEmail(body.email) : undefined
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

    // Generate a unique tenant slug for self-registered users to ensure isolated workspaces.
    const tenantSlug = createTenantSlugFromEmail(email)

    const tenant = await ensureTenantExists({
      slug: tenantSlug,
      name: createWorkspaceNameFromEmail(email),
      pilotMode: false,
    })

    // Create the user — self-registered accounts own their workspace (single-tenant model).
    const result = await createUser(email, password, 'owner', tenantSlug)
    if (!result.success || !result.user) {
      return NextResponse.json({ ok: false, error: result.error || 'Failed to create account' }, { status: 500 })
    }

    // Auto-sign-in: serialize the persisted role through the shared Mission Control
    // sanitizer so session payloads stay aligned with the auth layer.
    const signedToken = createSessionToken({
      userId: result.user.id,
      tenantId: tenant.id,
      tenantSlug,
      role: toMembershipRole(result.user.role),
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
