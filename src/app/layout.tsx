import type { Metadata, Viewport } from 'next'

import { ButtonsMotion } from '@/components/buttons-motion'
import { GoogleAnalytics } from '@/components/google-analytics'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { SITE } from '@/config/site'

import './globals.css'

const title = 'AI Consultant in Philadelphia | AI Consulting Services | SuperAICoach'
const description =
  'AI consulting services for Philadelphia small and medium businesses. An ongoing AI partner who knows the tools, meets with your team on a regular schedule, demos what is new, and sets it up with you. Month to month.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: title, template: '%s | SuperAICoach' },
  description,
  applicationName: SITE.name,
  authors: [{ name: SITE.founder, url: SITE.personalSite }],
  creator: SITE.founder,
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
      </body>
    </html>
  )
}
