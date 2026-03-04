import { NextResponse } from 'next/server'

function safeString(value: unknown) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function dateKeyInTimeZone(timestampMs: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(timestampMs))

  const year = parts.find((p) => p.type === 'year')?.value
  const month = parts.find((p) => p.type === 'month')?.value
  const day = parts.find((p) => p.type === 'day')?.value

  if (!year || !month || !day) return undefined
  return `${year}-${month}-${day}`
}

async function getKv() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  const mod = await import('@vercel/kv')
  return mod.kv
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | null> {
  let timeoutHandle: NodeJS.Timeout | null = null

  try {
    const timeoutPromise = new Promise<null>((resolve) => {
      timeoutHandle = setTimeout(() => resolve(null), timeoutMs)
    })

    return (await Promise.race([promise, timeoutPromise])) as T | null
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle)
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | {
          event?: unknown
          payload?: unknown
          ts?: unknown
        }
      | null

    const event = safeString(body?.event) ?? 'unknown'
    const payload = body?.payload && typeof body.payload === 'object' ? body.payload : {}

    const now = Date.now()
    const ts = typeof body?.ts === 'number' ? body.ts : now

    const trackingEvent = {
      type: 'client_event',
      event,
      payload,
      ts,
      page: safeString((payload as Record<string, unknown>)?.page),
      source: safeString((payload as Record<string, unknown>)?.source),
      visitorId: safeString((payload as Record<string, unknown>)?.visitorId),
      userAgent: request.headers.get('user-agent') ?? undefined,
      referrer: request.headers.get('referer') ?? undefined,
    }

    // Always log (useful even before persistence is configured)
    console.log(JSON.stringify(trackingEvent))

    const kv = await getKv()
    if (kv && trackingEvent.visitorId) {
      const dateKey = dateKeyInTimeZone(ts, 'America/New_York')
      const prefix = 'sac:v1'

      if (dateKey) {
        const visitorId = trackingEvent.visitorId
        const page = trackingEvent.page ?? 'unknown'
        const source = trackingEvent.source ?? 'unknown'

        const ops: Promise<unknown>[] = []

        if (event === 'page_view') {
          ops.push(kv.sadd(`${prefix}:visits:${dateKey}:visitors`, visitorId))
          ops.push(kv.sadd(`${prefix}:visits:${dateKey}:pages:${page}`, visitorId))
        }

        if (event === 'consult_cta_click') {
          ops.push(kv.sadd(`${prefix}:clicks:${dateKey}:visitors`, visitorId))
          ops.push(kv.hincrby(`${prefix}:clicks:${dateKey}:sourceCounts`, source, 1))
          ops.push(kv.hincrby(`${prefix}:clicks:${dateKey}:pageCounts`, page, 1))
        }

        // Don't let tracking become a latency risk
        void withTimeout(Promise.allSettled(ops), 250)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('track route error', error)
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
