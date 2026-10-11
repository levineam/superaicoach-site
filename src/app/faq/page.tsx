import type { Metadata } from 'next'

import { BookButton } from '@/components/book-button'
import { TextLink } from '@/components/button'
import { JsonLd } from '@/components/json-ld'
import { FAQS } from '@/config/site'
import { faqSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'FAQ: Working with a Philadelphia AI Consultant',
  description:
    'Answers about the free consult, the Intro Session, client data, pricing, cancelling, and how an ongoing AI partnership works for Philadelphia firms.',
  alternates: { canonical: '/faq' },
}

export default function Faq() {
  return (
    <>
      <JsonLd data={faqSchema(FAQS)} />
      <section className="page-head">
        <p className="eyebrow">
          FAQ
          <small>AI Consulting Services · Philadelphia</small>
        </p>
        <h1>
          Fair <em>questions.</em>
        </h1>
      </section>
      <section className="page-body">
        <div className="faq">
          {FAQS.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
        <div className="actions" style={{ marginTop: 40 }}>
          <BookButton />
          <TextLink href="/contact">Ask something else</TextLink>
        </div>
      </section>
    </>
  )
}
