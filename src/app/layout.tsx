import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { DM_Sans, Inter } from 'next/font/google'

import { PageViewTracker } from '@/components/page-view-tracker'
import { GoogleAnalytics } from '@/components/google-analytics'

import './globals.css'

const _dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const _inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://superaicoach.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'SuperAIcoach — Personal AI Assistant Coaching',
  description:
    'SuperAIcoach helps busy professionals use ChatGPT and Claude as a practical virtual AI assistant for writing, planning, and repetitive admin work through 1:1 coaching.',
  keywords: 'personal ai assistant, virtual ai assistant, ai coach, personal ai coach, chatgpt coach, claude coach, ai productivity coaching',
  authors: [{ name: 'Andrew Levine', url: 'https://superaicoach.com' }],
  creator: 'SuperAIcoach',
  publisher: 'SuperAIcoach',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    title: 'SuperAIcoach — Personal AI Assistant Coaching',
    description: 'SuperAIcoach helps busy professionals use ChatGPT and Claude as a practical virtual AI assistant for writing, planning, and repetitive admin work.',
    siteName: 'SuperAIcoach',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SuperAIcoach — Personal AI Assistant Coaching',
    description: 'SuperAIcoach helps busy professionals use ChatGPT and Claude as a practical virtual AI assistant for writing, planning, and repetitive admin work.',
    creator: '@andrewlevine',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: {
      url: '/favicon.svg',
      type: 'image/svg+xml',
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1917',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${_dmSans.variable} ${_inter.variable} scroll-smooth motion-reduce:scroll-auto`}
    >
      <Script id="enable-js" strategy="beforeInteractive">
        {`document.documentElement.classList.add('js')`}
      </Script>
      <body className="font-sans antialiased">
        <GoogleAnalytics />
        <PageViewTracker />
        {children}
      </body>
    </html>
  )
}
