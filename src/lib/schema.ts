import {
  AREA_SERVED,
  BOOKING,
  FAQS,
  FIRST_SESSION,
  FOUNDER_CREDENTIAL,
  SITE,
  type FAQ,
} from '@/config/site'

const num = (price: string) => price.replace(/[^0-9.]/g, '')

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${SITE.url}/#business`,
    name: SITE.name,
    legalName: SITE.legalName,
    description: `One-on-one AI coaching for business owners and executives in Philadelphia with ${SITE.founder}, ${FOUNDER_CREDENTIAL}. In-person or video sessions that set up AI in your own accounts and daily work.`,
    url: SITE.url,
    email: SITE.email,
    priceRange: `Free call; first session ${FIRST_SESSION.price}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Philadelphia',
      addressRegion: 'PA',
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 39.9526, longitude: -75.1652 },
    areaServed: AREA_SERVED.map((name) => ({ '@type': 'AdministrativeArea', name })),
    founder: {
      '@type': 'Person',
      name: SITE.founder,
      url: SITE.personalSite,
      description: `${SITE.founder}, ${FOUNDER_CREDENTIAL}.`,
    },
    sameAs: [SITE.personalSite],
    knowsAbout: [
      'AI coaching',
      'Generative AI adoption',
      'ChatGPT',
      'Claude',
      'Microsoft Copilot',
      'Google Workspace',
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        name: `Free ${BOOKING.duration} AI call`,
        description: `A free ${BOOKING.duration} call to talk through your work and the first thing worth setting up.`,
        price: '0',
        priceCurrency: 'USD',
        url: BOOKING.url,
      },
      {
        '@type': 'Offer',
        name: 'First AI coaching session',
        description: `${FIRST_SESSION.hours} hours, in person or on video, setting up AI in your own accounts.`,
        price: num(FIRST_SESSION.price),
        priceCurrency: 'USD',
        url: `${SITE.url}/#how`,
      },
    ],
  }
}

export function faqSchema(faqs: FAQ[] = FAQS) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  }
}
