'use client'

import * as React from 'react'
import { ArrowRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/track'

export type ConsultationCTAProps = {
  source?: string
  label?: string
  comingSoonMessage?: string
  buttonClassName?: string
  containerClassName?: string
  buttonSize?: React.ComponentProps<typeof Button>['size']
}

const DEFAULT_MESSAGE =
  "We're finishing the scheduling flow. If you want to be first, email hello@superaicoach.com."

export function ConsultationCTA({
  source = 'unknown',
  label = 'Book a free 15-min consult',
  comingSoonMessage = DEFAULT_MESSAGE,
  buttonClassName,
  containerClassName,
  buttonSize = 'lg',
}: ConsultationCTAProps) {
  const pathname = usePathname()
  const [showMessage, setShowMessage] = React.useState(false)
  const hideTimer = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (hideTimer.current) {
        window.clearTimeout(hideTimer.current)
      }
    }
  }, [])

  function handleClick() {
    setShowMessage(true)

    trackEvent('consult_cta_click', {
      source,
      page: pathname,
      label,
    })

    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current)
    }

    hideTimer.current = window.setTimeout(() => {
      setShowMessage(false)
    }, 6500)
  }

  return (
    <div className={cn('flex flex-col items-center gap-2', containerClassName)}>
      <Button
        type="button"
        size={buttonSize}
        onClick={handleClick}
        className={cn(
          'bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 text-base font-semibold shadow-lg shadow-accent/20 h-12',
          buttonClassName,
        )}
      >
        {label}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      {showMessage ? (
        <p
          className={cn(
            'max-w-sm text-sm text-muted-foreground',
            containerClassName?.includes('items-start') ? 'text-left' : 'text-center',
          )}
          role="status"
          aria-live="polite"
        >
          <span className="font-medium text-foreground">Coming soon.</span> {comingSoonMessage}
        </p>
      ) : null}
    </div>
  )
}
