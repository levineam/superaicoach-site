import type { ReactNode } from 'react'

type Props = {
  href: string
  children: ReactNode
  arrow?: '→' | '↓' | '↗'
  variant?: 'primary' | 'secondary' | 'quiet'
  light?: boolean
  block?: boolean
  track?: string
  className?: string
}

/** andrarchy "Instrument" button: square, corner ticks, arrow in its own cell. */
export function Button({
  href,
  children,
  arrow = '→',
  variant = 'primary',
  light = false,
  block = false,
  track,
  className = '',
}: Props) {
  const external = /^https?:\/\//.test(href)
  const classes = [
    'ab-btn',
    variant === 'secondary' && 'ab-secondary',
    variant === 'quiet' && 'ab-quiet',
    light && 'ab-light',
    block && 'ab-block',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <a
      className={classes}
      href={href}
      data-track={track}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
    >
      <span className="ab-label">{children}</span>
      <span className="ab-arrow" aria-hidden="true">
        {arrow}
      </span>
    </a>
  )
}

export function TextLink({
  href,
  children,
  arrow = '→',
}: {
  href: string
  children: ReactNode
  arrow?: '→' | '↓' | '↗' | '←'
}) {
  const external = /^https?:\/\//.test(href)
  return (
    <a className="ab-link" href={href} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
      <span className="ab-label">{children}</span>
      <span className={`ab-arrow${arrow === '↗' ? ' ab-ext' : ''}`} aria-hidden="true">
        {arrow}
      </span>
    </a>
  )
}
