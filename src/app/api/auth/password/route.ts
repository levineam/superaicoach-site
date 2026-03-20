import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { authenticateWithPassword } from '@/lib/mission-control/auth'
import { SESSION_COOKIE_NAME } from '@/lib/mission-control/session'

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

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      ok: true,
      tenantSlug: result.tenantSlug,
      userId: result.userId,
      role: result.role,
      redirect: '/member',
    })
  } catch (error) {
    console.error('Password auth error:', error)
    return NextResponse.json(
      { ok: false, error: 'Authentication failed' },
      { status: 500 },
    )
  }
}
