import { AREA_SERVED, BOOKING, FAQS, INTRO, PLANS, SITE, type FAQ } from '@/config/site'

const num = (price: string) => price.replace(/[^0-9.]/g, '')

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${SITE.url}/#business`,
    name: SITE.name,
    legalName: SITE.legalName,
    description:
      'AI consultant in Philadelphia. An ongoing AI partner for small and medium firms: regular on-site sessions to demo what is new, listen to the team, and set up the tools with them.',
    url: SITE.url,
    email: SITE.email,
    priceRange: 'Free consult; plans $1,500–$6,875/mo',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Philadelphia',
      addressRegion: 'PA',
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 39.9526, longitude: -75.1652 },
    areaServed: AREA_SERVED.map((name) => ({ '@type': 'AdministrativeArea', name })),
    founder: { '@type': 'Person', name: SITE.founder, url: SITE.personalSite },
    sameAs: [SITE.personalSite],
    knowsAbout: [
      'AI consulting',
      'Generative AI adoption',
      'ChatGPT',
      'Claude',
      'Microsoft Copilot',
      'Google Workspace',
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        name: `Free ${BOOKING.duration} AI consult`,
        description: `A free ${BOOKING.duration} consult to see whether working together makes sense.`,
        price: '0',
        priceCurrency: 'USD',
        url: BOOKING.url,
      },
      ...[INTRO, ...PLANS].map((p) => ({
      '@type': 'Offer',
      name: `${p.name}${p.id === 'intro' ? '' : ' AI Partnership'}`,
      description: p.cadence,
      price: num(p.price),
      priceCurrency: 'USD',
      ...(p.id === 'intro'
        ? {}
        : {
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: num(p.price),
              priceCurrency: 'USD',
              unitCode: 'MON',
            },
          }),
      url: `${SITE.url}/#plans`,
      })),
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
