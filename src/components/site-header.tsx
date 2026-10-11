import Link from 'next/link'

import { SITE } from '@/config/site'

import { BookButton } from './book-button'

const NAV = [
  { href: '/#how', label: 'How it works' },
  { href: '/#plans', label: 'Plans' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="brand">
        <Link className="wordmark" href="/" aria-label={`${SITE.name} home`}>
          superaicoach
        </Link>
        <a className="by-line mono" href={SITE.personalSite}>
          by Andrew Levine ↗
        </a>
      </div>
      <nav className="site-nav mono" aria-label="Main">
        {NAV.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-cta">
        <BookButton label="Book" />
      </div>
    </header>
  )
}
