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
      url: 'https://calendly.com/andrew-superaicoach/30min',
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
    question: 'Do I need to pay to read the resources?',
    answer:
      'No. The public library is designed to be useful on its own. The broader offer is a curated resources membership, which means some pieces can stay free while deeper collections, roundups, and implementation notes can live behind the membership over time.',
  },
  {
    question: 'What kind of resources are included?',
    answer:
      'We publish practical AI guides, workflow breakdowns, prompt patterns, and curated roundups of the best tools and ideas we find each week. The goal is not more noise. It is to save you from digging through endless AI content on your own.',
  },
  {
    question: 'How often do you publish new material?',
    answer:
      'The cadence is simple: a daily newsletter captures what is worth paying attention to, one new evergreen resource article is published each week, and the best ideas from the week are distilled into a weekly roundup.',
  },
  {
    question: 'Is this coaching, a course, or a membership?',
    answer:
      'The main offer here is the curated resources membership. Think of it as a practical research desk for busy people who want high-signal AI help without turning this into a full-time hobby. Coaching can still exist around the edges, but the core product is the library and weekly curation.',
  },
  {
    question: 'Who is this for?',
    answer:
      'Busy professionals, founders, operators, and curious people who want to use AI well without becoming AI obsessives. If you want useful workflows, sharp explanations, and fewer rabbit holes, you are in the right place.',
  },
  {
    question: 'How do you decide what makes the cut?',
    answer:
      'We look for resources that are practical, trustworthy, and immediately usable. If something is flashy but not helpful in real work, it does not make the library. The bar is simple: it should save time, improve judgment, or unlock a workflow you can actually use.',
  },
]

export const DEFAULT_HOW_TO_STEPS: HowToStep[] = [
  {
    name: 'Book a free consult',
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
