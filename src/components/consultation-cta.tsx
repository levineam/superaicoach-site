'use client'

import * as React from 'react'
import { ArrowRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/track'

export type ConsultationCTAProps = {
  source?: string
  label?: string
  buttonClassName?: string
  containerClassName?: string
}

export function ConsultationCTA({
  source = 'unknown',
  label = 'Book your free 15-minute consult',
  buttonClassName,
  containerClassName,
}: ConsultationCTAProps) {
  const pathname = usePathname()

  return (
    <div className={cn('flex flex-col items-center gap-2', containerClassName)}>
      <a
        href="https://calendly.com/levineam/30min"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackEvent('consult_cta_click', {
            source,
            page: pathname,
            label,
          })
        }}
        className={cn(
          'inline-flex h-12 items-center gap-2 rounded-full border border-accent/90 bg-accent px-8 text-base font-semibold text-accent-foreground shadow-md shadow-foreground/10 transition-colors hover:bg-accent/92',
          buttonClassName,
        )}
      >
        {label}
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  )
}
