import { NextResponse } from 'next/server'
import { Resend } from 'resend'

import { getMissionControlDbClient } from '@/lib/mission-control/db'
import {
  getPackByProfession,
  buildPackEmailHtml,
  buildInternalNotificationHtml,
} from '@/lib/cowork-packs'

interface Payload {
  email?: string
  profession?: string
  source?: string
}

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) throw new Error('RESEND_API_KEY is not set.')
    _resend = new Resend(apiKey)
  }
  return _resend
}

const FROM_ADDRESS = 'noreply@superaicoach.com'
const INTERNAL_ADDRESS = 'hello@superaicoach.com'

function isValidEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false
  return /^\S+@\S+\.\S+$/.test(value.trim())
}

export async function POST(request: Request) {
  let body: Payload
  try {
    body = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const profession = typeof body.profession === 'string' ? body.profession.trim() : ''
  const source = typeof body.source === 'string' ? body.source.trim() : 'cowork'

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'A valid email is required.' }, { status: 400 })
  }

  const pack = getPackByProfession(profession)
  if (!pack) {
    return NextResponse.json(
      { ok: false, error: 'Unknown profession. Pick Financial Advisor, Attorney, or Executive.' },
      { status: 400 },
    )
  }

  // 1. Save lead to Supabase
  const db = getMissionControlDbClient()
  if (db) {
    try {
      await db.from('cowork_leads').insert({ email, profession, source })
    } catch (err) {
      console.error('[cowork] Supabase insert error:', err)
      // Non-blocking — continue to send emails
    }
  } else {
    console.log(`[cowork-lead] ${email} | ${profession} | ${source} | ${new Date().toISOString()}`)
  }

  // 2. Send internal notification
  try {
    await getResend().emails.send({
      from: FROM_ADDRESS,
      to: INTERNAL_ADDRESS,
      subject: `Cowork Pack Request: ${pack.label} — ${email}`,
      html: buildInternalNotificationHtml(email, pack, source),
    })
  } catch (err) {
    console.error('[cowork] Internal notification error:', err)
    // Non-blocking
  }

  // 3. Send pack email to user
  try {
    const { error: sendError } = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: `Your ${pack.label} Cowork Starter Pack`,
      html: buildPackEmailHtml(pack),
    })

    if (sendError) {
      console.error('[cowork] Pack email delivery error:', sendError)
      return NextResponse.json(
        { ok: false, error: 'Failed to send your starter pack. Please try again.' },
        { status: 500 },
      )
    }
  } catch (err) {
    console.error('[cowork] Pack email client error:', err)
    return NextResponse.json(
      { ok: false, error: 'Email delivery is not configured. Contact support.' },
      { status: 500 },
    )
  }

  return NextResponse.json({
    ok: true,
    message: `Your ${pack.label} starter pack is on the way! Check your inbox.`,
  })
}
