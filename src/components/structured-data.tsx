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
      name: 'Free 15-minute AI coaching consult',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://calendly.com/levineam/30min',
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
    'SuperAIcoach helps busy professionals turn ChatGPT and Claude into a practical virtual AI assistant for writing, planning, and repetitive admin work.',
  url: 'https://superaicoach.com',
  email: 'hello@superaicoach.com',
  founder: {
    '@type': 'Person',
    name: 'Andrew Levine',
  },
  areaServed: ['United States', 'Philadelphia'],
  serviceType: [
    'AI Training',
    'Personal Coaching',
    'Technology Consulting',
    'Productivity Coaching',
  ],
  sameAs: ['https://x.com/andrewlevine'],
}

export const DEFAULT_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Do I need any technical skills or AI experience?',
    answer:
      'Not at all. Coaching is designed for people starting from zero AI experience. If you can use email and a web browser, you can use this system. We focus on practical workflows you can run immediately, not technical jargon.',
  },
  {
    question: 'Which AI tools do you work with?',
    answer:
      'Most clients use ChatGPT and Claude, and some also use OpenClaw for 24/7 agent support. We match tools to your workflow and budget first. If a simple low-cost setup works, we recommend that over unnecessary complexity.',
  },
  {
    question: 'Do you need access to my accounts or private data?',
    answer:
      'No. You keep full control of your accounts and data. During sessions, you share your screen while we coach step-by-step. We never require your passwords or direct account access.',
  },
  {
    question: 'What happens after the free 15-minute consult?',
    answer:
      'You leave with a clear plan. If it is a fit, we book a paid coaching session focused on building 2-3 repeatable workflows around your real tasks. No subscription is required.',
  },
  {
    question: 'How long does it take to see results?',
    answer:
      'Most clients get useful workflow wins in the first session. The goal is immediate application: writing faster, planning better, and reducing repetitive admin work the same day.',
  },
]

export const DEFAULT_HOW_TO_STEPS: HowToStep[] = [
  {
    name: 'Free 15-minute call',
    text: 'Start by booking a free 15-minute call to define the highest-value AI workflow for your current work.',
  },
  {
    name: 'Share your real use case',
    text: 'Bring one real writing, planning, research, or admin task. We use your live workflow instead of a generic demo.',
  },
  {
    name: 'Build your AI workflow',
    text: 'In session, we configure prompts, process steps, and guardrails so the workflow is practical and repeatable.',
  },
  {
    name: 'Run it immediately',
    text: 'Before you leave, you run the workflow yourself and leave with next steps to keep momentum.',
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
