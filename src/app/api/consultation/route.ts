import { NextResponse } from 'next/server'

function isValidEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false
  return /^\S+@\S+\.\S+$/.test(value)
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      goal?: unknown
      email?: unknown
      source?: unknown
    }

    const goal = typeof body.goal === 'string' ? body.goal.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''

    if (!goal) {
      return NextResponse.json(
        { ok: false, error: 'Missing goal' },
        { status: 400 },
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email' },
        { status: 400 },
      )
    }

    // Intentionally no persistence yet.
    // This route exists to provide a clean success state and can be wired up
    // to an email/CRM provider later.
    void body.source

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid request' },
      { status: 400 },
    )
  }
}
