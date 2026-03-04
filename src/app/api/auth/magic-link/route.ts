import { NextResponse } from 'next/server'
import { Resend } from 'resend'

import { issueMagicLink } from '@/lib/mission-control/auth'

interface Payload {
  email?: string
}

// Lazy init so the module can load at build time even without the key
let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set.')
    }
    _resend = new Resend(apiKey)
  }
  return _resend
}

const FROM_ADDRESS = 'noreply@superaicoach.com'

function buildEmailHtml(magicLinkUrl: string): string {
  return `
<div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #0f172a; font-size: 20px; margin-bottom: 8px;">Sign in to Mission Control</h2>
  <p style="color: #475569; font-size: 15px; margin-bottom: 24px;">Click the button below to sign in. This link expires in 30 minutes and can only be used once.</p>
  <a href="${magicLinkUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">Log in to Mission Control</a>
  <p style="color: #94a3b8; font-size: 13px; margin-top: 24px;">If you didn't request this, you can safely ignore this email.</p>
</div>
`.trim()
}

export async function POST(request: Request) {
  let body: Payload

  try {
    body = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
  }

  const issued = await issueMagicLink(email, new URL(request.url).origin)

  // Send email via Resend
  try {
    const { error: sendError } = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: 'Your Mission Control sign-in link',
      html: buildEmailHtml(issued.magicLink),
    })

    if (sendError) {
      console.error('[magic-link] Resend delivery error:', sendError)
      return NextResponse.json(
        { error: 'Failed to send sign-in email. Please try again.' },
        { status: 500 },
      )
    }
  } catch (err) {
    console.error('[magic-link] Resend client error:', err)
    return NextResponse.json(
      { error: 'Email delivery is not configured. Contact support.' },
      { status: 500 },
    )
  }

  // In non-production environments, include a preview URL for easy testing
  const debugPayload =
    process.env.NODE_ENV !== 'production' ? { magicLinkPreview: issued.magicLink } : {}

  return NextResponse.json({
    ok: true,
    message: 'Check your email for a sign-in link',
    ...debugPayload,
  })
}
