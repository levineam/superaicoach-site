import { type NextRequest, NextResponse } from 'next/server'

import { getMissionControlDbClient } from '@/lib/mission-control/db'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string }
    const email = body.email?.trim().toLowerCase()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { ok: false, error: 'A valid email is required.' },
        { status: 400 },
      )
    }

    const db = getMissionControlDbClient()

    if (db) {
      // Check if already on waitlist
      const { data: existing } = await db
        .from('waitlist')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      if (!existing) {
        await db.from('waitlist').insert({ email })
      }
    } else {
      // No database — log to stdout so we don't lose signups
      console.log(`[waitlist] ${email} — ${new Date().toISOString()}`)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { ok: false, error: 'Something went wrong. Try again.' },
      { status: 500 },
    )
  }
}
