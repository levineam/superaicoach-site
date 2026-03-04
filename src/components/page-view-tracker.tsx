'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

import { trackEvent } from '@/lib/track'

export function PageViewTracker() {
  const pathname = usePathname()

  React.useEffect(() => {
    trackEvent('page_view', {
      page: pathname,
    })
  }, [pathname])

  return null
}
