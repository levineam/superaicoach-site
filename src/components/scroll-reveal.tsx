'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export type ScrollRevealProps = {
  delayMs?: number
  once?: boolean
  threshold?: number
  rootMargin?: string
} & React.HTMLAttributes<HTMLDivElement>

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function ScrollReveal({
  delayMs = 0,
  once = true,
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  children,
  className,
  style,
  ...rest
}: ScrollRevealProps) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [revealed, setRevealed] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      setRevealed(true)
      return
    }

    if (!('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        if (entry.isIntersecting) {
          setRevealed(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setRevealed(false)
        }
      },
      {
        threshold,
        rootMargin,
      },
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [once, rootMargin, threshold])

  return (
    <div
      ref={ref}
      data-revealed={revealed ? 'true' : 'false'}
      className={cn('reveal', className)}
      style={
        {
          ...style,
          '--reveal-delay': delayMs ? `${delayMs}ms` : undefined,
        } as React.CSSProperties
      }
      {...rest}
    >
      {children}
    </div>
  )
}
