import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { authenticateWithPassword } from '@/lib/mission-control/auth'
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

    // Create HMAC-signed session token that the member auth layer can verify
    const signedToken = createSessionToken({
      userId: result.userId,
      tenantId: result.userId,       // simplified — no multi-tenant
      tenantSlug: result.tenantSlug || 'default',
      role: (result.role as 'admin' | 'owner' | 'team_member' | 'coach') || 'owner',
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
