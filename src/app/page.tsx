import type { Metadata } from 'next'
import Image from 'next/image'

import { BookButton } from '@/components/book-button'
import { Button, TextLink } from '@/components/button'
import { JsonLd } from '@/components/json-ld'
import { BOOKING, FAQS, FIRST_SESSION, FOUNDER_CREDENTIAL, SITE } from '@/config/site'
import { SKILLS } from '@/content/skills'
import { faqSchema, localBusinessSchema } from '@/lib/schema'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const STEPS = [
  {
    title: `Free ${BOOKING.duration} call`,
    body: 'Tell me what your week looks like. You’ll leave knowing the first thing I’d set up for you.',
  },
  {
    title: `First session, ${FIRST_SESSION.price}`,
    body: `Two hours at your office or over coffee. We set up something you’ll use the next day. If you keep going within ${FIRST_SESSION.creditDays} days, it counts toward your first month.`,
  },
  {
    title: 'Keep going if it’s useful',
    body: 'We pick a regular time, weekly or monthly. It’s month to month, and everything I set up stays in your accounts.',
  },
]

export default function Home() {
  return (
    <>
      <JsonLd data={[localBusinessSchema(), faqSchema(FAQS)]} />

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">
            AI coaching · Philadelphia
            <small>For business owners and executives</small>
          </p>
          <h1 id="hero-title">
            Using AI in your business <em>starts with you.</em>
          </h1>
          <p className="lede">
            I’m {SITE.founder}, an AI coach in Philadelphia. I’ll sit down with you one on one, set AI
            up in your own accounts, and you’ll leave using it on real work. When something clicks, we
            bring it to your team.
          </p>
          <div className="actions">
            <BookButton />
            <Button href="/skills" variant="secondary">
              Try a free skill
            </Button>
          </div>
          <p className="fine mono">In person in Philly and nearby, or on video</p>
        </div>
        <figure className="hero-photo">
          <Image
            src="/portrait.jpg"
            alt={`${SITE.founder} in front of the Center City Philadelphia skyline`}
            width={1280}
            height={1280}
            priority
            sizes="(max-width: 980px) 90vw, 440px"
          />
          <figcaption className="mono">
            {SITE.founder}, {FOUNDER_CREDENTIAL}
          </figcaption>
        </figure>
      </section>

      <section className="section" id="how" aria-labelledby="how-title">
        <p className="section-label">How it works</p>
        <h2 id="how-title">
          One call, one session, <em>then you decide.</em>
        </h2>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li className="step" key={s.title}>
              <span className="mono">Step {i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" id="skills" aria-labelledby="skills-title">
        <p className="section-label">Free skills</p>
        <div className="split">
          <h2 id="skills-title">
            Try one <em>before we talk.</em>
          </h2>
          <div className="prose">
            <p>
              Small AI tools for an owner’s week. Read an example, copy the prompt into any AI chat,
              or add the full skill to Claude or ChatGPT.
            </p>
          </div>
        </div>
        <div className="skill-grid">
          {SKILLS.map((s) => (
            <a className="skill-card" href={`/skills#${s.slug}`} key={s.slug}>
              <strong>{s.name}</strong>
              <span>{s.summary}</span>
              <small className="mono">Get it →</small>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="about" aria-labelledby="about-title">
        <p className="section-label">Who you’d work with</p>
        <div className="split">
          <h2 id="about-title">
            A founder who lives here <em>and uses AI every day.</em>
          </h2>
          <div className="prose">
            <p>
              I’m {SITE.founder}, one of the founders of blockchain startup Koinos Group where we
              launched the world’s first free-to-use blockchain, Koinos. I led that company for 4 years
              as CEO and now I want to leverage my experience to help entrepreneurs of all types
              integrate AI into their businesses so that they don’t get left behind.
            </p>
            <TextLink href={SITE.personalSite} arrow="↗">
              More of my work at andrarchy.com
            </TextLink>
          </div>
        </div>
      </section>

      <section className="section" id="questions" aria-labelledby="faq-title">
        <p className="section-label">Questions</p>
        <h2 id="faq-title">Questions people ask</h2>
        <div className="faq">
          {FAQS.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section closing thesis" id="book" aria-labelledby="book-title">
        <h2 id="book-title">
          The first step is a <em>{BOOKING.duration} call.</em>
        </h2>
        <p className="lede">
          You’ll talk with me directly, so bring whatever is on your mind about AI. You’ll leave
          knowing what to try first, whether or not we work together.
        </p>
        <div className="actions">
          <BookButton />
        </div>
      </section>
    </>
  )
}
