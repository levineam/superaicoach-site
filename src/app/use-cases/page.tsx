import type { Metadata } from 'next'

import { TextLink } from '@/components/button'
import { JsonLd } from '@/components/json-ld'
import { ConsultCta } from '@/components/use-cases/consult-cta'
import { LibraryFooter } from '@/components/use-cases/library-footer'
import { UseCaseGrid } from '@/components/use-cases/use-case-grid'
import { SITE } from '@/config/site'
import { INDUSTRIES } from '@/content/industries'
import { USE_CASES } from '@/content/use-cases'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'AI Use Cases for Small Businesses in Philadelphia',
  description:
    'A free library of practical AI use cases for Philadelphia small and medium businesses: law, accounting, wealth management, property management, agencies, dental and medical, restaurants, contractors, real estate, nonprofits, and office operations. Real tools, honest caveats.',
  alternates: { canonical: '/use-cases' },
  openGraph: {
    title: 'AI Use Cases for Small Businesses in Philadelphia',
    description: 'A free library of practical AI use cases for Philadelphia small and medium businesses: law, accounting, wealth management, property management, agencies, dental and medical, restaurants, contractors, real estate, nonprofits, and office operations. Real tools, honest caveats.',
    url: '/use-cases',
    type: 'website',
  },
}

export default function UseCasesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'AI use cases', path: '/use-cases' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'AI use cases for small businesses',
            url: `${SITE.url}/use-cases`,
            hasPart: USE_CASES.map((u) => ({
              '@type': 'Article',
              headline: u.title,
              url: `${SITE.url}/use-cases/${u.slug}`,
            })),
          },
        ]}
      />
      <section className="page-head">
        <p className="eyebrow">
          Free library
          <small>{USE_CASES.length} use cases · for firms of 5 to 50 people</small>
        </p>
        <h1>
          AI use cases for small businesses, <em>without the hype.</em>
        </h1>
        <p className="lede">
          Concrete things Philadelphia firms can do with AI today, the real tools that do them, how
          hard they are to set up, and what to watch out for. Pick your industry.
        </p>
        <p className="uc-industry-links mono">
          {INDUSTRIES.map((i) => (
            <a key={i.id} href={`/use-cases/industry/${i.id}`}>
              {i.name} →
            </a>
          ))}
        </p>
      </section>
      <section className="page-body">
        <UseCaseGrid useCases={USE_CASES} industries={INDUSTRIES} />
        <ConsultCta title="Not sure which of these fits?" />
        <p style={{ marginTop: 26 }}>
          <TextLink href="/#plans">How working together works</TextLink>
        </p>
        <LibraryFooter />
      </section>
    </>
  )
}
