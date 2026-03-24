import { type NextRequest, NextResponse } from 'next/server'

import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; password?: string }
    const email = body.email?.trim().toLowerCase()
    const password = body.password

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: 'Email and password are required' },
        { status: 400 },
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { ok: false, error: 'Password must be at least 8 characters' },
        { status: 400 },
      )
    }

    const supabase = await createServerClient()
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 },
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { ok: false, error: 'Sign-up failed. Please try again.' },
        { status: 500 },
      )
    }

    return NextResponse.json({ ok: true, userId: data.user.id })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 },
    )
  }
}
