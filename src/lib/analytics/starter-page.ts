'use client'

import { trackGA } from '@/components/google-analytics'
import { trackEvent } from '@/lib/track'

export type StarterProfessionKey = 'consultant' | 'wealth-manager' | 'attorney'
export type StarterPlatformKey = 'openclaw' | 'claude'
export type StarterLibraryType = 'tool_library' | 'setup_library'

export const STARTER_PAGE_PATH = '/member'
export const DEFAULT_PROFESSION: StarterProfessionKey = 'consultant'
export const DEFAULT_PLATFORM: StarterPlatformKey = 'openclaw'
const STARTER_PAGE_SOURCE = 'member_starter_page'
const STARTER_PAGE_LAST_VISIT_KEY = 'sac_member_starter_last_visit_at'

export const STARTER_PAGE_EVENT_SCHEMA = {
  starter_page_view: {
    description: 'Fires once when the profession-first starter page renders.',
    properties: ['page', 'source', 'profession', 'platform'],
  },
  starter_profession_selected: {
    description: 'Fires when a user switches the active profession recommendation.',
    properties: ['page', 'source', 'profession', 'platform'],
  },
  starter_platform_selected: {
    description: 'Fires when a user switches between OpenClaw and Claude tracks.',
    properties: ['page', 'source', 'profession', 'platform'],
  },
  starter_workflow_started: {
    description: 'Fires when a user clicks the primary recommended setup CTA.',
    properties: ['page', 'source', 'profession', 'platform', 'targetHref'],
  },
  starter_library_browse_clicked: {
    description: 'Fires when a user opens the full tool or setup library from the starter page.',
    properties: ['page', 'source', 'profession', 'platform', 'library', 'targetHref'],
  },
  starter_return_visit: {
    description: 'Fires when the page loads for a visitor who has opened the starter page before.',
    properties: ['page', 'source', 'profession', 'platform', 'previousVisitAt', 'daysSinceLastVisit'],
  },
} as const

type StarterEventName = keyof typeof STARTER_PAGE_EVENT_SCHEMA

type StarterEventContext = {
  profession: StarterProfessionKey
  platform: StarterPlatformKey
}

function emitStarterPageEvent(event: StarterEventName, payload: Record<string, unknown>) {
  const normalizedPayload = {
    page: STARTER_PAGE_PATH,
    source: STARTER_PAGE_SOURCE,
    ...payload,
  }

  trackEvent(event, normalizedPayload)
  trackGA(event, normalizedPayload)
}

export function readPreviousStarterVisit() {
  try {
    if (typeof window === 'undefined') return undefined

    const previousVisitAt = window.localStorage.getItem(STARTER_PAGE_LAST_VISIT_KEY)
    return previousVisitAt ? Number(previousVisitAt) : undefined
  } catch {
    return undefined
  }
}

export function rememberStarterVisit(timestampMs = Date.now()) {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STARTER_PAGE_LAST_VISIT_KEY, String(timestampMs))
  } catch {
    // no-op: analytics must never break UX
  }
}

export function trackStarterPageView(context: StarterEventContext) {
  emitStarterPageEvent('starter_page_view', context)
}

export function trackStarterProfessionSelected(context: StarterEventContext) {
  emitStarterPageEvent('starter_profession_selected', context)
}

export function trackStarterPlatformSelected(context: StarterEventContext) {
  emitStarterPageEvent('starter_platform_selected', context)
}

export function trackStarterWorkflowStarted(
  context: StarterEventContext & { targetHref: string },
) {
  emitStarterPageEvent('starter_workflow_started', context)
}

export function trackStarterLibraryBrowseClicked(
  context: StarterEventContext & {
    library: StarterLibraryType
    targetHref: string
  },
) {
  emitStarterPageEvent('starter_library_browse_clicked', context)
}

export function trackStarterReturnVisit(
  context: StarterEventContext & { previousVisitAt: number },
) {
  const daysSinceLastVisit = Math.max(
    0,
    Math.round((Date.now() - context.previousVisitAt) / (1000 * 60 * 60 * 24) * 10) / 10,
  )

  emitStarterPageEvent('starter_return_visit', {
    ...context,
    daysSinceLastVisit,
  })
}
