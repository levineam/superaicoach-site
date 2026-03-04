import { NextResponse } from 'next/server'

async function getKv() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  const mod = await import('@vercel/kv')
  return mod.kv
}

function getDateFromQuery(url: string) {
  const { searchParams } = new URL(url)
  const date = searchParams.get('date')
  return date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null
}

export async function GET(request: Request) {
  const date = getDateFromQuery(request.url)

  if (!date) {
    return NextResponse.json(
      { ok: false, error: 'Missing or invalid date (expected YYYY-MM-DD)' },
      { status: 200 },
    )
  }

  const kv = await getKv()
  if (!kv) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Tracking store not configured. Connect a Redis/KV integration to the Vercel project so KV_REST_API_URL/TOKEN are set.',
      },
      { status: 200 },
    )
  }

  const prefix = 'sac:v1'

  const uniqueVisitsKey = `${prefix}:visits:${date}:visitors`
  const uniqueClicksKey = `${prefix}:clicks:${date}:visitors`
  const sourceCountsKey = `${prefix}:clicks:${date}:sourceCounts`

  const [uniqueVisits, uniqueConsultClicks, sourceCounts] = await Promise.all([
    kv.scard(uniqueVisitsKey),
    kv.scard(uniqueClicksKey),
    kv.hgetall<Record<string, string | number>>(sourceCountsKey),
  ])

  const uniqueVisitsNum = typeof uniqueVisits === 'number' ? uniqueVisits : Number(uniqueVisits ?? 0)
  const uniqueClicksNum =
    typeof uniqueConsultClicks === 'number'
      ? uniqueConsultClicks
      : Number(uniqueConsultClicks ?? 0)

  const counts: Record<string, number> = {}
  if (sourceCounts && typeof sourceCounts === 'object') {
    for (const [k, v] of Object.entries(sourceCounts)) {
      const num = typeof v === 'number' ? v : Number(v)
      counts[k] = Number.isFinite(num) ? num : 0
    }
  }

  let topCtaSource: { source: string; clicks: number } | null = null
  for (const [source, clicks] of Object.entries(counts)) {
    if (!topCtaSource || clicks > topCtaSource.clicks) {
      topCtaSource = { source, clicks }
    }
  }

  const ctr = uniqueVisitsNum > 0 ? uniqueClicksNum / uniqueVisitsNum : 0

  return NextResponse.json({
    ok: true,
    date,
    uniqueVisits: uniqueVisitsNum,
    uniqueConsultClicks: uniqueClicksNum,
    ctr,
    topCtaSource,
    sourceCounts: counts,
  })
}
