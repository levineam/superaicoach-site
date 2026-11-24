import type { Metadata } from 'next'
import Image from 'next/image'

import { BookButton } from '@/components/book-button'
import { TextLink } from '@/components/button'

const DESCRIPTION =
  'What clients say about working with Andrew Levine, a Philadelphia AI consultant: a therapy practice website in English and Spanish, booking, and an AI assistant in Slack.'

export const metadata: Metadata = {
  title: 'Testimonials: Working with a Philadelphia AI Consultant',
  description: DESCRIPTION,
  alternates: { canonical: '/testimonials' },
  openGraph: {
    title: 'Testimonials: Working with a Philadelphia AI Consultant',
    description: DESCRIPTION,
    url: '/testimonials',
    type: 'website',
  },
}

export default function Testimonials() {
  return (
    <>
      <section className="page-head">
        <p className="eyebrow">
          Testimonials
          <small>AI Consulting Services · Philadelphia</small>
        </p>
        <h1>
          In their <em>own words.</em>
        </h1>
        <p className="lede">
          I’m early in this, so there’s one for now. Amelia runs MentalXpace, a therapy practice in
          Rittenhouse Square, and I built her website and the AI setup behind it.
        </p>
      </section>
      <section className="page-body">
        <div className="split">
          <figure className="testimonial-card">
            <blockquote>
              <p>
                “Andrew didn’t just use AI to help me bootstrap MentalXpace 10x faster than I could
                have on my own. He taught me to use these tools myself. Now I post a request in Slack
                and our AI assistant gets it done, and I understand how it all works.”
              </p>
            </blockquote>
            <figcaption>
              <Image
                src="/testimonials/amelia-garcia-baumgardner.webp"
                alt="Headshot of Amelia Garcia-Baumgardner, founder of MentalXpace"
                width={320}
                height={400}
                sizes="160px"
              />
              <span>
                <strong>Amelia Garcia-Baumgardner, Founder of MentalXpace</strong>
                <a className="mono" href="https://www.mentalxpace.com">
                  mentalxpace.com ↗
                </a>
              </span>
            </figcaption>
          </figure>
          <div className="portrait-card">
            <span className="mono">What I built for MentalXpace</span>
            <ul>
              <li>
                <strong>The website.</strong> Built on Next.js and Vercel, with a page for each
                therapist and an Our Team section.
              </li>
              <li>
                <strong>English and Spanish.</strong> Every page has a full Spanish version.
              </li>
              <li>
                <strong>Booking.</strong> Appointment requests through PracticeQ, plus fees,
                insurance, and 988/911 safety information.
              </li>
              <li>
                <strong>A specialty finder.</strong> Visitors tap what they’re looking for and see
                which therapists match.
              </li>
              <li>
                <strong>An AI assistant in Slack.</strong> It watches the practice’s channel, passes
                along requests, and drafts my replies. Every change goes through a preview before
                anything is published.
              </li>
            </ul>
          </div>
        </div>
        <div className="actions" style={{ marginTop: 48 }}>
          <BookButton />
          <TextLink href="/use-cases">See use cases</TextLink>
        </div>
      </section>
    </>
  )
}
