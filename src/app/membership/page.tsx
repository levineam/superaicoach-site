import type { Metadata } from 'next'

import { Button, TextLink } from '@/components/button'
import { JsonLd } from '@/components/json-ld'
import { UseCaseCard } from '@/components/use-cases/use-case-card'
import {
  MEMBERSHIP,
  SITE,
  STRIPE_FOUNDING_ANNUAL_URL,
  STRIPE_FOUNDING_URL,
} from '@/config/site'
import { getUseCase } from '@/content/use-cases'
import { breadcrumbSchema, faqSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'SuperAICoach Membership: Use AI in Your Personal Life First',
  description:
    'For busy professionals: a weekly personal AI playbook, the full maintained library, and a monthly live demo. Founding 50: $19/mo locked or $149/yr (regular $29/$249). Start with your personal life, not your business systems.',
  alternates: { canonical: '/membership' },
  openGraph: {
    title: 'SuperAICoach Membership: Use AI in Your Personal Life First',
    description:
      'A weekly personal playbook, full maintained library, and monthly live demo for busy professionals. Founding 50: $19/mo locked or $149/yr.',
    url: '/membership',
    type: 'website',
  },
}

const PLAYBOOK_SLUGS = [
  'personal-chief-of-staff-inbox-calendar',
  'personal-ai-travel-planning',
  'personal-family-admin-ai',
  'personal-research-learning-ai',
  'personal-health-finance-paperwork-ai',
]

const FAQS = [
  {
    q: 'Why personal life first, not my business?',
    a: 'Because you can start this week. Your own inbox, calendar, travel, and family admin need no approval, no compliance review, and no one else’s permission. The judgement you build there — what to trust, what to check, what never to paste — is exactly what makes AI useful at work later, without the liability worries that come with client data.',
  },
  {
    q: 'What do I actually get each week?',
    a: 'One personal playbook: a specific job (triage your inbox, plan a trip, clear family admin), step-by-step setup, copy-paste prompts, a faster 10-minute version, and plain “what not to paste” safety notes. Plus the full library, kept re-tested as tools change, and a monthly live demo/Q&A with Andrew (recorded).',
  },
  {
    q: 'How much of my time does it take?',
    a: 'About 5 minutes to read the weekly playbook, then however long you want to spend trying it. Every playbook is written for busy people: do the 10-minute version now, go deeper only if it earns it.',
  },
  {
    q: 'What does Founding 50 mean?',
    a: `The first ${MEMBERSHIP.foundingSpots} members lock in ${MEMBERSHIP.foundingMonthly}/mo or ${MEMBERSHIP.foundingAnnual}/yr for as long as they stay members. After that, the public price is ${MEMBERSHIP.regularMonthly}/mo or ${MEMBERSHIP.regularAnnual}/yr. Cancel anytime; founding memberships come with a 30-day money-back promise, no questions.`,
  },
  {
    q: 'Do I need to be technical?',
    a: 'No. If you can use email and a browser, you can do these playbooks. Each one names the exact tool, what to click, and what to paste. Paid or work-tier AI accounts are recommended where a playbook touches personal data, and each playbook says why.',
  },
  {
    q: 'Is my personal data used to train AI?',
    a: 'Playbooks steer you to paid/work-tier accounts whose providers say they do not train on your data, and every playbook has “what not to paste” notes (no passwords, account numbers, or other people’s private details). You stay on your own accounts, and you approve anything that gets sent.',
  },
]

function FoundingCta({ light = false }: { light?: boolean }) {
  const hasStripe = Boolean(STRIPE_FOUNDING_URL || STRIPE_FOUNDING_ANNUAL_URL)
  if (!hasStripe) {
    // No Stripe link pasted yet (see STRIPE_FOUNDING_URL in src/config/site.ts).
    // Honest placeholder: no fake checkout, no fake form — a mailto free-list join.
    return (
      <div>
        <Button
          href={`mailto:${SITE.email}?subject=${encodeURIComponent('SuperAICoach Founding 50 — join the free list')}&body=${encodeURIComponent('Please add me to the free list and let me know when Founding 50 membership opens.')}`}
          light={light}
        >
          Founding membership opens soon — join the free list
        </Button>
        <p className="fine mono" style={{ marginTop: 12 }}>
          Founding checkout opens shortly. Email to join the free list and get the first playbook.
        </p>
      </div>
    )
  }
  return (
    <div className="actions">
      {STRIPE_FOUNDING_URL && (
        <Button href={STRIPE_FOUNDING_URL} light={light}>
          Join Founding 50 — {MEMBERSHIP.foundingMonthly}/mo
        </Button>
      )}
      {STRIPE_FOUNDING_ANNUAL_URL && (
        <Button href={STRIPE_FOUNDING_ANNUAL_URL} light={light} variant="secondary">
          Join Founding 50 — {MEMBERSHIP.foundingAnnual}/yr
        </Button>
      )}
    </div>
  )
}

export default function MembershipPage() {
  const playbooks = PLAYBOOK_SLUGS.map((s) => getUseCase(s)).filter(Boolean)
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Membership', path: '/membership' },
          ]),
          faqSchema(FAQS),
        ]}
      />
      <section className="hero" aria-labelledby="membership-title">
        <div>
          <p className="eyebrow">
            SuperAICoach Membership
            <small>For busy professionals · Personal life first</small>
          </p>
          <h1 id="membership-title">
            Use AI in your personal life <em>first.</em>
          </h1>
          <p className="lede">
            You do not need an AI strategy for your business. You need your inbox sorted, your
            calendar prepped, a trip planned, and the family paperwork under control. That is where
            AI actually pays off this week — no approvals, no liability review, no boss. Learn it on
            your own life, and the work uses follow on their own.
          </p>
          <p className="lede">
            I am Andrew Levine. Every week I send members one practical playbook for using AI in
            real life, I keep the whole library current as the tools change, and once a month I demo
            what is new live. You never have to follow AI news again.
          </p>
          <FoundingCta />
        </div>
        <div className="portrait-card">
          <span className="mono">Founding 50 — first {MEMBERSHIP.foundingSpots} members</span>
          <p className="price">
            {MEMBERSHIP.foundingMonthly}
            <small>/mo locked</small>
          </p>
          <p className="plan-cadence">or {MEMBERSHIP.foundingAnnual}/yr, locked the same way</p>
          <p className="plan-summary">
            Regular price at launch: {MEMBERSHIP.regularMonthly}/mo or {MEMBERSHIP.regularAnnual}
            /yr. Founding members keep their price for as long as they stay. Cancel anytime.
            30-day money-back, no questions.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="included-title">
        <p className="section-label">
          <b>01</b> / What&apos;s included
        </p>
        <h2 id="included-title">
          A maintained system, <em>not a news feed.</em>
        </h2>
        <div className="split">
          <ul className="checks" style={{ marginTop: 8 }}>
            {MEMBERSHIP.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="prose">
            <p>
              News about AI is free everywhere. What is not free is someone testing what changed,
              rewriting the instructions, and telling you which three things matter to your actual
              life this week. That maintenance is the product.
            </p>
            <p>
              No always-on chat community to keep up with, no course to finish. One playbook a week,
              a library that stays current, and a live demo once a month.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="playbooks-title">
        <p className="section-label">
          <b>Free</b> / Week 1 playbooks — read them now
        </p>
        <h2 id="playbooks-title">
          Start with these <em>five.</em>
        </h2>
        <p className="lede">
          These are the first five personal playbooks, free to read in full. Members get a new one
          like this every week, plus the deeper versions and the maintained library.
        </p>
        <div className="uc-grid" style={{ marginTop: 34 }}>
          {playbooks.map((u) => (
            <UseCaseCard key={u!.slug} useCase={u!} />
          ))}
        </div>
        <p style={{ marginTop: 26 }}>
          <TextLink href="/use-cases/industry/personal">All personal-life playbooks</TextLink>{' '}
          · <TextLink href="/use-cases">The AI-at-work library</TextLink>
        </p>
      </section>

      <section className="section lime" aria-labelledby="join-title">
        <p className="section-label">
          <b>02</b> / Founding 50
        </p>
        <h2 id="join-title">
          Founding price, <em>locked.</em>
        </h2>
        <div className="intro-offer">
          <div>
            <span className="tag">Founding member</span>
            <p className="price">
              {MEMBERSHIP.foundingMonthly}
              <small>/mo</small>
            </p>
            <p className="plan-cadence">or {MEMBERSHIP.foundingAnnual} for a year</p>
            <p className="plan-summary">
              Locked for as long as you stay a member. First playbook this week. 30-day money-back,
              no questions. Cancel anytime.
            </p>
            <FoundingCta />
          </div>
          <div>
            <p className="plan-cadence">Regular price after Founding 50</p>
            <p className="plan-summary">
              {MEMBERSHIP.regularMonthly}/mo or {MEMBERSHIP.regularAnnual}/yr. Founding members
              never pay it while their membership stays active.
            </p>
            <ul className="checks">
              <li>Weekly personal playbook, with copy-paste prompts</li>
              <li>Full maintained library (personal + at-work)</li>
              <li>Monthly live demo and Q&amp;A, recorded</li>
              <li>Monthly “what changed that matters to you” briefing</li>
              <li>Vote on the next playbooks</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="membership-faq-title">
        <p className="section-label">
          <b>03</b> / Questions
        </p>
        <h2 id="membership-faq-title">Fair questions.</h2>
        <div className="faq">
          {FAQS.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
        <div className="actions" style={{ marginTop: 40 }}>
          <FoundingCta />
        </div>
        <p style={{ marginTop: 26 }}>
          <TextLink href="/use-cases">Browse the free library first</TextLink> ·{' '}
          <TextLink href="/contact">Questions? Get in touch</TextLink>
        </p>
      </section>
    </>
  )
}
