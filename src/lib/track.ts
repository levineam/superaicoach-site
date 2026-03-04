'use client'

export type TrackEventPayload = Record<string, unknown>

const VISITOR_ID_KEY = 'sac_vid'

function getVisitorId() {
  try {
    if (typeof window === 'undefined') return undefined
    const existing = window.localStorage.getItem(VISITOR_ID_KEY)
    if (existing) return existing
    const next = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
    window.localStorage.setItem(VISITOR_ID_KEY, next)
    return next
  } catch {
    return undefined
  }
}

export function trackEvent(event: string, payload: TrackEventPayload = {}) {
  try {
    const visitorId = getVisitorId()

    const body = JSON.stringify({
      event,
      payload: {
        ...payload,
        visitorId,
      },
      ts: Date.now(),
    })

    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon('/api/track', blob)
      return
    }

    void fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
      keepalive: true,
    }).catch(() => {
      // ignore
    })
  } catch {
    // no-op: tracking must never break UX
  }
}
