import type { Metadata } from 'next'

import { BookButton } from '@/components/book-button'
import { TextLink } from '@/components/button'
import { BOOKING, SITE } from '@/config/site'

export const metadata: Metadata = {
  title: 'Book a Free Consult | AI Consultant Philadelphia',
  description:
    'Book a free consult with Andrew Levine, a Philadelphia AI consultant, or email with questions. No cost and no commitment.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Book a Free Consult | AI Consultant Philadelphia',
    description: 'Book a free consult with Andrew Levine, a Philadelphia AI consultant, or email with questions. No cost and no commitment.',
    url: '/contact',
    type: 'website',
  },
}

export default function Contact() {
  return (
    <>
      <section className="page-head">
        <p className="eyebrow">
          Book
          <small>AI Consulting Services · Philadelphia</small>
        </p>
        <h1>
          Let’s get you <em>started.</em>
        </h1>
        <p className="lede">
          The way in is a free {BOOKING.duration} consult. No cost, no card, no commitment.
        </p>
      </section>
      <section className="page-body">
        <div className="split">
          <div>
            <ol className="contact-steps">
              <li>
                <strong>Pick a time.</strong> It’s free and takes about a minute.
              </li>
              <li>
                <strong>Tell me a little about the firm.</strong> Size, what you’ve tried with AI
                (nothing counts), and what’s eating your team’s week.
              </li>
              <li>
                <strong>We talk.</strong> I’ll tell you honestly whether working together makes
                sense, and what I’d suggest first.
              </li>
              <li>
                <strong>If it’s a fit,</strong> the next step is an Intro Session at your office. If
                not, that’s the end of it.
              </li>
            </ol>
            <BookButton />
          </div>
          <dl className="detail-list">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                <br />
                Questions before booking are welcome.
              </dd>
            </div>
            <div>
              <dt>On site</dt>
              <dd>
                Philadelphia (Center City, University City, Fairmount, Fishtown, Northern Liberties,
                and the rest of the city), the Main Line, Montgomery, Delaware, Bucks, and Chester
                Counties, and South Jersey.
              </dd>
            </div>
            <div>
              <dt>Video</dt>
              <dd>Anywhere.</dd>
            </div>
            <div>
              <dt>Business</dt>
              <dd>{SITE.legalName}, Philadelphia, PA</dd>
            </div>
          </dl>
        </div>
        <p style={{ marginTop: 40 }}>
          <TextLink href="/#plans">See plans and pricing</TextLink>
        </p>
      </section>
    </>
  )
}
