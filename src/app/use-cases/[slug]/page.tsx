import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { TextLink } from '@/components/button'
import { JsonLd } from '@/components/json-ld'
import { ConsultCta } from '@/components/use-cases/consult-cta'
import { AffiliateDisclosure, LibraryFooter } from '@/components/use-cases/library-footer'
import { UseCaseCard } from '@/components/use-cases/use-case-card'
import { getIndustry } from '@/content/industries'
import { getTool, toolHref } from '@/content/tools'
import { USE_CASES, getUseCase, casesForIndustry } from '@/content/use-cases'
import { breadcrumbSchema } from '@/lib/schema'
import { schemasForUseCase } from '@/lib/use-case-schema'

type Params = { slug: string }

export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return USE_CASES.map((u) => ({ slug: u.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const u = getUseCase(slug)
  if (!u) return {}
  const industry = getIndustry(u.industry)
  const title = `${u.title}: AI for ${industry?.name ?? 'small businesses'}`
  return {
    title,
    description: `${u.summary} Tools, setup difficulty, and what to watch out for.`,
    alternates: { canonical: `/use-cases/${u.slug}` },
    openGraph: { title, description: u.summary, type: 'article', url: `/use-cases/${u.slug}` },
  }
}

export default async function UseCasePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const u = getUseCase(slug)
  if (!u) notFound()
  const industry = getIndustry(u.industry)!
  const related = casesForIndustry(u.industry).filter((r) => r.slug !== u.slug).slice(0, 3)

  return (
    <>
      <JsonLd
        data={[
          ...schemasForUseCase(u),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'AI use cases', path: '/use-cases' },
            { name: industry.name, path: `/use-cases/industry/${industry.id}` },
            { name: u.title, path: `/use-cases/${u.slug}` },
          ]),
        ]}
      />
      <section className="page-head">
        <p className="eyebrow">
          <a href={`/use-cases/industry/${industry.id}`}>{industry.name}</a>
          <small>
            <Link href="/use-cases">← All use cases</Link>
          </small>
        </p>
        <h1 className="uc-title">{u.title}</h1>
        <p className="lede">{u.summary}</p>
        <dl className="uc-facts mono">
          <div>
            <dt>Setup</dt>
            <dd>{u.difficulty}</dd>
          </div>
          <div>
            <dt>Effort</dt>
            <dd>{u.setupEstimate}</dd>
          </div>
        </dl>
      </section>
      <section className="page-body">
        <div className="split">
          <div className="prose">
            <h2>The time sink</h2>
            <p>{u.problem}</p>
            <h2>What the AI does</h2>
            <p>{u.aiDoes}</p>
            {u.typicalEffect && (
              <p className="uc-estimate mono">Estimate: {u.typicalEffect}</p>
            )}
            <h2>How to set it up</h2>
            <ol className="contact-steps">
              {u.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <h2>What to watch out for</h2>
            <ul className="uc-watch">
              {u.watchOuts.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="portrait-card">
              <span className="mono">Tools</span>
              <ul>
                {u.tools.map((id) => {
                  const t = getTool(id)
                  return (
                    <li key={id}>
                      <a
                        href={toolHref(t)}
                        target="_blank"
                        rel={t.affiliateUrl ? 'sponsored noopener' : 'noopener'}
                      >
                        <strong>{t.name}</strong> ↗
                      </a>
                    </li>
                  )
                })}
              </ul>
              <AffiliateDisclosure />
            </div>
          </div>
        </div>
        <ConsultCta />
        {related.length > 0 && (
          <div className="uc-related">
            <p className="section-label">More for {industry.name.toLowerCase()}</p>
            <div className="uc-grid">
              {related.map((r) => (
                <UseCaseCard key={r.slug} useCase={r} />
              ))}
            </div>
            <p style={{ marginTop: 24 }}>
              <TextLink href={`/use-cases/industry/${industry.id}`}>
                All {industry.name.toLowerCase()} use cases
              </TextLink>
            </p>
          </div>
        )}
        <LibraryFooter />
      </section>
    </>
  )
}
