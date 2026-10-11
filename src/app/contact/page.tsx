import type { Metadata } from 'next'

import { BookButton } from '@/components/book-button'
import { TextLink } from '@/components/button'
import { BOOKING, SITE } from '@/config/site'

export const metadata: Metadata = {
  title: 'Book an Intro Session | AI Consultant Philadelphia',
  description:
    'Book a paid two-hour AI Intro Session at your Philadelphia office, or email Andrew Levine with questions.',
  alternates: { canonical: '/contact' },
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
          The way in is a single Intro Session: {BOOKING.price}, two hours at your office, credited to
          your first month if you keep going.
        </p>
      </section>
      <section className="page-body">
        <div className="split">
          <div>
            <ol className="contact-steps">
              <li>
                <strong>Pick a time and pay online.</strong> It takes about two minutes.
              </li>
              <li>
                <strong>Tell me a little about the firm.</strong> Size, what you’ve tried with AI
                (nothing counts), and what’s eating your team’s week.
              </li>
              <li>
                <strong>I come to you.</strong> Demos on your work, listening, and one thing set up
                before I leave.
              </li>
              <li>
                <strong>You get a short written plan</strong> within two business days. Then you
                decide.
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
