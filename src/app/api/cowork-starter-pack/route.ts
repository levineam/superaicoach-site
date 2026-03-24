import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { packRegistry, VALID_PROFESSIONS } from '@/lib/cowork-packs/index'
import type { ProfessionId } from '@/lib/cowork-packs/index'
import { getMissionControlDbClient } from '@/lib/mission-control/db'

interface Payload {
  email?: string
  profession?: string
  source?: string
}

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
const DESTINATION_ADDRESS = 'hello@superaicoach.com'

/** Allowed source values — must match the CHECK constraint in the cowork_leads migration. */
const VALID_SOURCES = ['cowork', 'landing', 'referral'] as const
type SourceId = (typeof VALID_SOURCES)[number]

function isValidSource(value: unknown): value is SourceId {
  return typeof value === 'string' && (VALID_SOURCES as readonly string[]).includes(value)
}

/* ── Simple in-memory rate limiter (per-IP, 5 requests / 15 min) ── */
const RATE_WINDOW_MS = 15 * 60 * 1000
const RATE_MAX = 5
const ipHits = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = ipHits.get(ip)
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > RATE_MAX
}

function isValidEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false
  return /^\S+@\S+\.\S+$/.test(value)
}

function isValidProfession(value: unknown): value is ProfessionId {
  return typeof value === 'string' && (VALID_PROFESSIONS as readonly string[]).includes(value)
}

/** Escape a string for safe embedding in HTML. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildInternalNotificationHtml(email: string, profession: string, source: string): string {
  return `
<div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; color: #0f172a;">
  <h2 style="font-size: 20px; margin-bottom: 12px;">New Cowork starter pack request</h2>
  <p style="font-size: 15px; line-height: 1.6; margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
  <p style="font-size: 15px; line-height: 1.6; margin: 0 0 8px;"><strong>Profession:</strong> ${escapeHtml(profession)}</p>
  <p style="font-size: 15px; line-height: 1.6; margin: 0 0 8px;"><strong>Source:</strong> ${escapeHtml(source)}</p>
  <p style="font-size: 13px; color: #64748b; margin-top: 24px;">Sent automatically from the SuperAIcoach Cowork funnel.</p>
</div>
`.trim()
}

function buildPackEmailHtml(profession: ProfessionId): string {
  const pack = packRegistry[profession]

  const folderListItems = pack.folderStructure
    .map(
      (f) =>
        `<li style="font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.8; color: #0f172a;">${f}</li>`,
    )
    .join('\n')

  const workflowListItems = pack.workflows
    .map(
      (w, i) =>
        `<li style="font-size: 14px; line-height: 1.7; color: #0f172a; margin-bottom: 4px;"><strong>${i + 1}.</strong> ${w}</li>`,
    )
    .join('\n')

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin: 0; padding: 0; background-color: #f8fafc;">
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #0f172a;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px; padding: 32px; margin-bottom: 24px; text-align: center;">
      <p style="font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #34d399; margin: 0 0 8px;">Claude Cowork Starter Pack</p>
      <h1 style="font-size: 26px; font-weight: 700; color: #f8fafc; margin: 0;">${pack.label}</h1>
      <p style="font-size: 14px; color: #94a3b8; margin: 8px 0 0;">Your pre-configured AI workspace is ready.</p>
    </div>

    <!-- Custom Instructions -->
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
      <h2 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 12px;">Your Custom Instructions</h2>
      <p style="font-size: 13px; color: #64748b; margin: 0 0 12px;">Paste this into Claude's Custom Instructions field in your Cowork project:</p>
      <div style="background: #0f172a; border-radius: 8px; padding: 16px; border-left: 3px solid #34d399;">
        <p style="font-family: 'Courier New', Courier, monospace; font-size: 13px; line-height: 1.7; color: #e2e8f0; margin: 0; white-space: pre-wrap;">${pack.customInstructions}</p>
      </div>
    </div>

    <!-- Suggested Folder Structure -->
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
      <h2 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 12px;">Suggested Project Structure</h2>
      <p style="font-size: 13px; color: #64748b; margin: 0 0 12px;">Organize your Cowork project with these folders:</p>
      <ul style="list-style: none; padding: 0; margin: 0; background: #f8fafc; border-radius: 8px; padding: 16px;">
        ${folderListItems}
      </ul>
    </div>

    <!-- Workflows -->
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
      <h2 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 12px;">Included Workflows</h2>
      <p style="font-size: 13px; color: #64748b; margin: 0 0 12px;">Start with these three proven workflows for ${pack.label}s:</p>
      <ol style="list-style: none; padding: 0; margin: 0;">
        ${workflowListItems}
      </ol>
    </div>

    <!-- Connectors -->
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
      <h2 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 12px;">Connector Setup</h2>
      <p style="font-size: 13px; color: #64748b; margin: 0 0 16px;">Connect these sources to unlock the full power of your ${pack.label} workspace:</p>

      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 10px;">
        <p style="font-size: 14px; font-weight: 600; color: #0f172a; margin: 0 0 4px;">📁 Google Drive</p>
        <p style="font-size: 13px; color: #475569; margin: 0; line-height: 1.6;">In Claude Cowork, go to Connectors → Add → Google Drive. Authorize your Google account and select the folders you want Claude to access. Once connected, you can reference documents directly in conversations.</p>
      </div>

      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
        <p style="font-size: 14px; font-weight: 600; color: #0f172a; margin: 0 0 4px;">✉️ Gmail</p>
        <p style="font-size: 13px; color: #475569; margin: 0; line-height: 1.6;">In Claude Cowork, go to Connectors → Add → Gmail. Authorize your Google account. Claude can then reference emails and threads when drafting responses or summarizing communications.</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding-top: 16px;">
      <p style="font-size: 13px; color: #94a3b8; margin: 0 0 8px;">More AI tools, workflows, and guides for professionals:</p>
      <a href="https://superaicoach.com" style="font-size: 14px; font-weight: 600; color: #10b981; text-decoration: none;">superaicoach.com</a>
      <p style="font-size: 12px; color: #cbd5e1; margin: 16px 0 0;">You received this because you requested a Cowork starter pack at superaicoach.com.</p>
    </div>
  </div>
</body>
</html>
`.trim()
}

export async function POST(request: Request) {
  /* ── Rate-limit check ── */
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again later.' },
      { status: 429 },
    )
  }

  let body: Payload

  try {
    body = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  const profession = body.profession?.trim().toLowerCase()
  const source: SourceId = isValidSource(body.source?.trim()) ? body.source!.trim() as SourceId : 'cowork'

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'A valid email is required.' }, { status: 400 })
  }

  if (!isValidProfession(profession)) {
    return NextResponse.json(
      {
        ok: false,
        error: `Profession must be one of: ${VALID_PROFESSIONS.join(', ')}.`,
      },
      { status: 400 },
    )
  }

  /* ── Persist lead (best-effort — email delivery is the priority) ── */
  const db = getMissionControlDbClient()
  if (db) {
    const { error: dbError } = await db
      .from('cowork_leads')
      .insert({ email, profession, source, created_at: new Date().toISOString() })
    if (dbError) {
      console.error('[cowork-starter-pack] cowork_leads insert error:', dbError)
    }
  }

  try {
    const resend = getResend()

    const { error: notificationError } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: DESTINATION_ADDRESS,
      subject: `New Cowork starter pack request: ${profession} — ${email}`,
      html: buildInternalNotificationHtml(email, profession, source),
    })

    if (notificationError) {
      console.error('[cowork-starter-pack] Internal notification error:', notificationError)
      return NextResponse.json(
        { ok: false, error: 'Failed to process your request. Please try again.' },
        { status: 500 },
      )
    }

    const { error: packEmailError } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: `Your ${packRegistry[profession].label} Cowork Starter Pack`,
      html: buildPackEmailHtml(profession),
    })

    if (packEmailError) {
      console.error('[cowork-starter-pack] Pack email error:', packEmailError)
      return NextResponse.json(
        { ok: false, error: 'Request received, but pack email failed to send. Please try again.' },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('[cowork-starter-pack] Resend client error:', error)
    return NextResponse.json(
      { ok: false, error: 'Email delivery is not configured yet. Contact support.' },
      { status: 500 },
    )
  }

  return NextResponse.json({
    ok: true,
    message: `Check your inbox — your ${packRegistry[profession].label} starter pack is on its way.`,
  })
}
