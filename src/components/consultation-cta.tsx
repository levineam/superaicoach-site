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
  label = 'Free 15-minute call',
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
          'inline-flex h-12 items-center gap-2 rounded-full bg-accent px-8 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-colors hover:bg-accent/90',
          buttonClassName,
        )}
      >
        {label}
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  )
}
