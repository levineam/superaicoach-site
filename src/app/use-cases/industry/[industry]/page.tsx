import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { TextLink } from '@/components/button'
import { JsonLd } from '@/components/json-ld'
import { ConsultCta } from '@/components/use-cases/consult-cta'
import { LibraryFooter } from '@/components/use-cases/library-footer'
import { UseCaseCard } from '@/components/use-cases/use-case-card'
import { SITE } from '@/config/site'
import { INDUSTRIES, getIndustry } from '@/content/industries'
import { casesForIndustry } from '@/content/use-cases'
import { breadcrumbSchema } from '@/lib/schema'

type Params = { industry: string }

export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return INDUSTRIES.map((i) => ({ industry: i.id }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { industry: id } = await params
  const industry = getIndustry(id)
  if (!industry) return {}
  return {
    title: industry.metaTitle,
    description: industry.metaDescription,
    alternates: { canonical: `/use-cases/industry/${industry.id}` },
    openGraph: {
      title: industry.metaTitle,
      description: industry.metaDescription,
      url: `/use-cases/industry/${industry.id}`,
      type: 'website',
    },
  }
}

export default async function IndustryPage({ params }: { params: Promise<Params> }) {
  const { industry: id } = await params
  const industry = getIndustry(id)
  if (!industry) notFound()
  const list = casesForIndustry(industry.id)

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'AI use cases', path: '/use-cases' },
            { name: industry.name, path: `/use-cases/industry/${industry.id}` },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: industry.headline,
            description: industry.metaDescription,
            url: `${SITE.url}/use-cases/industry/${industry.id}`,
            about: { '@type': 'Thing', name: industry.name },
            spatialCoverage: { '@type': 'Place', name: 'Philadelphia, PA' },
          },
        ]}
      />
      <section className="page-head">
        <p className="eyebrow">
          AI use cases
          <small>
            <Link href="/use-cases">← All industries</Link>
          </small>
        </p>
        <h1>{industry.headline}</h1>
        {industry.intro.map((p) => (
          <p className="lede" key={p}>
            {p}
          </p>
        ))}
      </section>
      <section className="page-body">
        <div className="uc-grid">
          {list.map((u) => (
            <UseCaseCard key={u.slug} useCase={u} />
          ))}
        </div>
        <ConsultCta title="Want help putting these to work?" />
        <p style={{ marginTop: 26 }}>
          <TextLink href="/philadelphia">AI consulting in Philadelphia</TextLink>
        </p>
        <LibraryFooter />
      </section>
    </>
  )
}
