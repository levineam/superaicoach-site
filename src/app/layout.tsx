import type { Metadata, Viewport } from 'next'
import Script from 'next/script'

import { ButtonsMotion } from '@/components/buttons-motion'
import { GoogleAnalytics } from '@/components/google-analytics'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { SITE } from '@/config/site'

import './globals.css'

const title = 'AI Coach and Consultant in Philadelphia | SuperAICoach'
const description =
  'One-on-one AI coaching for Philadelphia business owners and executives. Sit down with a local coach, set AI up in your own accounts, and leave using it on real work. Start with a free 30-minute call.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: title, template: '%s | SuperAICoach' },
  description,
  applicationName: SITE.name,
  publisher: SITE.legalName,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.url,
    siteName: SITE.name,
    title,
    description,
  },
  twitter: { card: 'summary_large_image', title, description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }], apple: '/favicon.svg' },
  other: { 'geo.region': 'US-PA', 'geo.placename': 'Philadelphia' },
}

export const viewport: Viewport = {
  themeColor: '#11120f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        <ButtonsMotion />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <Script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "13e9ac77a67a4d57aec0f2759ae61422"}' strategy="afterInteractive" />
      </body>
    </html>
  )
}
