import type { Metadata } from 'next'

import { BookButton } from '@/components/book-button'
import { TextLink } from '@/components/button'
import { JsonLd } from '@/components/json-ld'
import { BOOKING, INTRO, PLANS } from '@/config/site'
import { localBusinessSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'AI Consultant in Philadelphia for Small Businesses',
  description:
    'A Philadelphia AI consultant for small and medium firms in Center City, University City, the Main Line, and the suburbs. Regular on-site sessions. Start with a free consult.',
  alternates: { canonical: '/philadelphia' },
}

export default function Philadelphia() {
  return (
    <>
      <JsonLd data={localBusinessSchema()} />
      <section className="page-head">
        <p className="eyebrow">
          AI Consulting Services
          <small>Philadelphia, PA</small>
        </p>
        <h1>
          AI consultant in Philadelphia, <em>at your office.</em>
        </h1>
        <p className="lede">
          A regular AI partner for Philly firms with 5 to 50 people. I come to you, show your team
          what the latest tools can do on your own work, listen to what you need, and set it up with
          you.
        </p>
        <div className="actions">
          <BookButton />
          <TextLink href="/#plans" arrow="→">
            See plans
          </TextLink>
        </div>
      </section>
      <section className="page-body">
        <div className="split">
          <div className="prose">
            <h2>Local on purpose</h2>
            <p>
              People start using AI when someone sits next to them on a real task, not after a
              webinar. And when the work is confidential, the conversation about where data goes is
              easier across a table. I’m based in Fairmount, so most of the city is a short trip.
            </p>
            <p>
              I work with law firms, CPA and accounting firms, wealth managers, property managers,
              and other professional-services teams in Center City, University City, Fishtown,
              Northern Liberties, Old City, South Philly, the Main Line, Montgomery, Delaware, Bucks,
              and Chester Counties, and South Jersey.
            </p>
            <h2>How it works</h2>
            <p>
              Start with a free {BOOKING.duration} consult. If it’s a fit, we do a two-hour{' '}
              {INTRO.name} ({INTRO.price}, credited to your first month), then pick how often we
              meet:{' '}
              {PLANS.map((p) => `${p.name} at ${p.price}${p.unit}`).join(', ')}. Month to month.
            </p>
          </div>
          <div className="portrait-card">
            <span className="mono">Common starting points</span>
            <ul>
              <li>
                <strong>Law:</strong> drafting help, intake, research, and document summaries, with
                firm rules mapped to ABA Formal Opinion 512.
              </li>
              <li>
                <strong>Accounting:</strong> chasing client documents, tax-season email, engagement
                letters.
              </li>
              <li>
                <strong>Wealth management:</strong> meeting prep, notes, and client letters inside
                your compliance rules.
              </li>
              <li>
                <strong>Property management:</strong> tenant and owner email, maintenance requests,
                lease summaries.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
