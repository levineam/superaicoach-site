import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://superaicoach.com'

export const metadata: Metadata = {
  title: "Philadelphia's Personal AI Assistant Setup Service | SuperAIcoach",
  description:
    'Get a personal AI assistant that actually knows you — set up in your home or office by an expert. Philadelphia-area in-person AI setup consulting at $100/hour.',
  keywords:
    'Philadelphia personal AI assistant, AI assistant setup Philadelphia, in-person AI setup Philadelphia, AI coaching Philadelphia, home AI setup, personal AI assistant installation, on-site AI setup Philadelphia, OpenClaw setup service Philadelphia, Hermes Agent setup Philadelphia, AI assistant for home use Philadelphia',
  alternates: {
    canonical: '/philadelphia',
  },
  openGraph: {
    title: "Philadelphia's Personal AI Assistant Setup Service | SuperAIcoach",
    description:
      'Get a personal AI assistant that actually knows you — set up in your home or office by an expert. Starting at $100/hour.',
    url: `${baseUrl}/philadelphia`,
    type: 'website',
    locale: 'en_US',
    siteName: 'SuperAIcoach',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Philadelphia's Personal AI Assistant Setup Service | SuperAIcoach",
    description:
      'Personal AI assistant setup in your home or office. Starting at $100/hour in Philadelphia.',
  },
  other: {
    'geo.region': 'US-PA',
    'geo.placename': 'Philadelphia',
  },
}

export default function PhiladelphiaLayout({ children }: { children: React.ReactNode }) {
  return children
}
