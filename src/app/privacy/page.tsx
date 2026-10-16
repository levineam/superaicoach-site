import type { Metadata } from 'next'

import { SITE } from '@/config/site'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'How SuperAICoach handles information collected through this website.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy',
    description: 'How SuperAICoach handles information collected through this website.',
    url: '/privacy',
    type: 'website',
  },
}

export default function Privacy() {
  return (
    <>
      <section className="page-head">
        <p className="eyebrow">
          Privacy
          <small>Last updated October 2026</small>
        </p>
        <h1>
          Privacy, <em>in plain English.</em>
        </h1>
      </section>
      <section className="page-body">
        <div className="prose">
          <p>
            This site is run by {SITE.legalName} in Philadelphia, PA. It has no accounts, no sign-in,
            and no forms that store your information on this site.
          </p>
          <h2>What is collected</h2>
          <ul>
            <li>
              <strong>Booking.</strong> When you book a consult, you leave this site for our
              scheduling provider (Calendly), which collects your name, email, and appointment
              details under its own privacy policy. We receive your name, email, the time you
              booked, and anything you write in the booking form. We don’t take payments on this
              site.
            </li>
            <li>
              <strong>Email.</strong> If you email us, we keep the message and your address to reply
              and to keep a record of our work together.
            </li>
            <li>
              <strong>Analytics.</strong> We may use basic website analytics (such as Google
              Analytics) to see which pages are visited and whether the booking button is used. This
              can involve cookies set by the analytics provider. We do not sell data or use it for
              advertising.
            </li>
            <li>
              <strong>Hosting logs.</strong> Our hosting and security providers (Vercel and
              Cloudflare) process standard request data such as IP address and browser type to serve
              and protect the site.
            </li>
          </ul>
          <h2>How it is used</h2>
          <p>
            Only to schedule and deliver sessions, reply to you, send invoices, and understand whether
            the site is working. We don’t sell or rent personal information.
          </p>
          <h2>Client work</h2>
          <p>
            Anything you share during an engagement is kept confidential and handled under the terms
            we agree in writing. That is separate from this website policy.
          </p>
          <h2>Your choices</h2>
          <p>
            You can ask us what we hold about you, or ask us to correct or delete it, by emailing{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. You can block analytics cookies in your
            browser settings.
          </p>
        </div>
      </section>
    </>
  )
}
