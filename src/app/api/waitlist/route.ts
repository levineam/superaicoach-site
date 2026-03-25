import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; source?: string }
    const email = body.email?.trim().toLowerCase()

    if (!email) {
      return NextResponse.json({ ok: false, error: 'Email is required' }, { status: 400 })
    }

    // TODO: persist to Supabase or external service
    // For now, log and return success
    console.log(`[waitlist] ${email} from ${body.source ?? 'unknown'}`)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
