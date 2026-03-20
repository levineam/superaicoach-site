import Script from 'next/script'

interface OrganizationData {
  type: 'Organization' | 'LocalBusiness'
  name: string
  description: string
  url: string
  telephone?: string
  email?: string
  address?: {
    streetAddress?: string
    addressLocality: string
    addressRegion: string
    postalCode?: string
    addressCountry: string
  }
  sameAs?: string[]
  founder?: {
    '@type': string
    name: string
  }
  areaServed?: string | string[]
  serviceType?: string[]
}

interface StructuredDataProps {
  organization: OrganizationData
}

interface ServiceStructuredDataProps {
  name: string
  description: string
  url: string
  providerName: string
  providerUrl: string
  areaServed?: string | string[]
  serviceType?: string
}

interface FAQItem {
  question: string
  answer: string
}

interface FAQStructuredDataProps {
  faqs: FAQItem[]
}

interface HowToStep {
  name: string
  text: string
}

interface HowToStructuredDataProps {
  name: string
  description: string
  url: string
  totalTime?: string
  steps: HowToStep[]
}

function buildOrganizationSchema(organization: OrganizationData) {
  return {
    '@context': 'https://schema.org',
    '@type': organization.type,
    name: organization.name,
    description: organization.description,
    url: organization.url,
    ...(organization.telephone && { telephone: organization.telephone }),
    ...(organization.email && { email: organization.email }),
    ...(organization.address && {
      address: {
        '@type': 'PostalAddress',
        ...organization.address,
      },
    }),
    ...(organization.sameAs && { sameAs: organization.sameAs }),
    ...(organization.founder && { founder: organization.founder }),
    ...(organization.areaServed && { areaServed: organization.areaServed }),
    ...(organization.serviceType && { serviceType: organization.serviceType }),
  }
}

export function StructuredData({ organization }: StructuredDataProps) {
  const structuredData = buildOrganizationSchema(organization)

  return (
    <Script
      id="structured-data-organization"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function ServiceStructuredData(props: ServiceStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: props.name,
    description: props.description,
    url: props.url,
    provider: {
      '@type': 'Organization',
      name: props.providerName,
      url: props.providerUrl,
    },
    areaServed: props.areaServed ?? 'United States',
    ...(props.serviceType && { serviceType: props.serviceType }),
    offers: {
      '@type': 'Offer',
      name: 'Curated AI stack membership',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/PreOrder',
      url: 'https://superaicoach.com/#cta',
    },
  }

  return (
    <Script
      id="structured-data-service"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function FAQStructuredData({ faqs }: FAQStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <Script
      id="structured-data-faq"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function HowToStructuredData({
  name,
  description,
  url,
  totalTime,
  steps,
}: HowToStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    url,
    ...(totalTime && { totalTime }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }

  return (
    <Script
      id="structured-data-howto"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Default organization data for the main site
export const DEFAULT_ORGANIZATION_DATA: OrganizationData = {
  type: 'Organization',
  name: 'SuperAIcoach',
  description:
    'Pre-configured AI skills, daily briefings, and starter kits for busy professionals. Built on OpenClaw. No tinkering required.',
  url: 'https://superaicoach.com',
  email: 'hello@superaicoach.com',
  founder: {
    '@type': 'Person',
    name: 'Andrew Levine',
  },
  areaServed: ['United States', 'Philadelphia'],
  serviceType: [
    'AI Productivity Membership',
    'Curated AI Skills',
    'AI Automation',
    'AI Starter Kits',
  ],
  sameAs: ['https://x.com/andrewlevine'],
}

export const DEFAULT_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Do I need to be technical?',
    answer:
      'No. If you can install an app and follow a setup guide, you can use this. The whole point is that someone else did the hard part.',
  },
  {
    question: 'What AI tools does this work with?',
    answer:
      'The stack is built on OpenClaw — an open-source AI agent runtime. Skills work with ChatGPT, Claude, Gmail, Calendar, Apple Notes, Discord, GitHub, and many more.',
  },
  {
    question: 'What do I actually get as a member?',
    answer:
      'Access to the full skill catalog with install guides, pre-built starter configs, the daily AI briefing newsletter, Discord community, and new releases as they ship.',
  },
  {
    question: 'Is there a free tier?',
    answer:
      'Yes. The /resources page has free guides and articles. The daily newsletter preview is also free. Full skill catalog, configs, and community require membership.',
  },
  {
    question: 'How is this different from ChatGPT Plus or Claude Pro?',
    answer:
      'Those are the AI models. This is the layer on top — pre-built workflows, integrations, and configs that make the models actually useful for daily work.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes. No contracts, no commitment. Cancel from your account page.',
  },
]

export const DEFAULT_HOW_TO_STEPS: HowToStep[] = [
  {
    name: 'Pick your profile',
    text: "Tell us what you use AI for — writing, research, content, building. We'll match you to a starter config.",
  },
  {
    name: 'Install & go',
    text: 'Download your config, install the skills, follow the quickstart. Most people are up in under 30 minutes.',
  },
  {
    name: 'Stay current',
    text: 'New skills, updated configs, and a daily briefing land in your inbox. Your AI stack keeps getting better without effort.',
  },
]

// Philadelphia-specific organization data
export const PHILADELPHIA_ORGANIZATION_DATA: OrganizationData = {
  type: 'LocalBusiness',
  name: 'SuperAIcoach Philadelphia',
  description:
    'Personal AI coaching in Philadelphia. In-person and virtual training on ChatGPT, Claude, and AI automation tools.',
  url: 'https://superaicoach.com/philly',
  email: 'hello@superaicoach.com',
  address: {
    addressLocality: 'Philadelphia',
    addressRegion: 'Pennsylvania',
    addressCountry: 'US',
  },
  founder: {
    '@type': 'Person',
    name: 'Andrew Levine',
  },
  areaServed: 'Philadelphia',
  serviceType: [
    'AI Training',
    'Personal Coaching',
    'Technology Consulting',
    'Productivity Coaching',
    'In-Person Training',
  ],
  sameAs: ['https://x.com/andrewlevine'],
}
