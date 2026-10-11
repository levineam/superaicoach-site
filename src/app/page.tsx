import type { Metadata } from 'next'

import { BookButton } from '@/components/book-button'
import { Button, TextLink } from '@/components/button'
import { HeroLoop } from '@/components/hero-loop'
import { JsonLd } from '@/components/json-ld'
import { BOOKING, EVERY_PLAN, FAQS, INTRO, PLANS, TERMS } from '@/config/site'
import { faqSchema, localBusinessSchema } from '@/lib/schema'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const HOME_FAQS = FAQS.slice(0, 4)

const STEPS = [
  {
    title: 'I show you what’s new',
    body: 'Live demos on your own material, not slides. What changed this month, what’s worth your attention, and what to ignore.',
  },
  {
    title: 'I listen',
    body: 'Where your team’s week actually goes, what’s frustrating, and what clients keep asking for.',
  },
  {
    title: 'We set it up together',
    body: 'Accounts, templates, assistants, and connections in the tools you already pay for: Microsoft 365, Google Workspace, ChatGPT, Claude, Copilot, your CRM.',
  },
  {
    title: 'We adjust as you go',
    body: 'Next session we keep what worked, fix what didn’t, and look at what’s new since last time.',
  },
]

export default function Home() {
  return (
    <>
      <JsonLd data={[localBusinessSchema(), faqSchema(HOME_FAQS)]} />

      <section className="hero" aria-labelledby="hero-title">
        <div>
          <p className="eyebrow">
            AI Consulting Services
            <small>For Philadelphia small and medium businesses</small>
          </p>
          <h1 id="hero-title">
            Your firm’s AI partner, <em>in the room.</em>
          </h1>
          <p className="lede">
            You don’t need to know what you want from AI. I’m Andrew Levine, an AI consultant in
            Philadelphia. I know the tools, I keep up with what’s new, and I meet with your team on a
            regular schedule to show you what’s worth using, listen to what you need, and set it up
            with you.
          </p>
          <div className="actions">
            <BookButton />
            <Button href="#plans" arrow="↓" variant="secondary">
              See plans
            </Button>
          </div>
          <p className="fine mono">On site in Philly and nearby · Month to month · No courses, no memberships</p>
        </div>
        <div className="hero-visual">
          <HeroLoop />
          <span className="hero-coordinate mono">39.95° N · 75.16° W</span>
        </div>
      </section>

      <section className="section" id="problem" aria-labelledby="problem-title">
        <p className="section-label">
          <b>01</b> / The problem
        </p>
        <div className="split">
          <div>
            <h2 id="problem-title">
              You don’t need to know what you want <em>from AI.</em>
            </h2>
            <div className="prose">
              <p>
                Nobody at your firm has time to keep up with it, and that’s normal. You can’t write a
                spec for something you haven’t seen work. A course won’t fix that, and neither will a
                consultant whose first question is which process you’d like automated.
              </p>
              <p>
                What helps is someone who already knows the tools, shows you what’s possible on your
                own work, and sticks around while you figure out what’s worth keeping.
              </p>
            </div>
          </div>
          <ul className="problem-list">
            <li>
              <span>01</span>The tools change every month, and every vendor says theirs does everything.
            </li>
            <li>
              <span>02</span>A few people are trying things on their own, on personal accounts.
            </li>
            <li>
              <span>03</span>Someone is rightly nervous about client data.
            </li>
            <li>
              <span>04</span>And the way the firm actually works hasn’t changed.
            </li>
          </ul>
        </div>
      </section>

      <section className="section" id="how" aria-labelledby="how-title">
        <p className="section-label">
          <b>02</b> / What working together looks like
        </p>
        <h2 id="how-title">
          A regular meeting with someone who <em>knows the tools.</em>
        </h2>
        <div className="steps">
          {STEPS.map((s, i) => (
            <div className="step" key={s.title}>
              <span className="mono">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
        <p className="loop-note">
          Then we repeat: monthly, every other week, or weekly. You choose. Built for Philly firms of 5
          to 50 people: law, accounting, wealth management, property management, and other
          professional services.
        </p>
      </section>

      <section className="section thesis" aria-labelledby="thesis-title">
        <p className="section-label">
          <b>03</b> / What I believe
        </p>
        <div className="split">
          <h2 id="thesis-title">
            AI replaces meaningless work, <em>not people.</em>
          </h2>
          <div className="prose">
            <p>
              I don’t sell AI as a way to cut staff. The point is to take the reformatting, the
              blank-page first drafts, and the copy-paste out of your team’s week, so they spend it on
              the work clients pay for.
            </p>
            <p>
              Your people are in every session, because they’re the ones who will use it. And if AI
              isn’t the right fix for something, I’ll say so.
            </p>
          </div>
        </div>
      </section>

      <section className="section lime" id="plans" aria-labelledby="plans-title">
        <p className="section-label">
          <b>04</b> / Plans and pricing
        </p>
        <h2 id="plans-title">
          Start with a free consult. Then pick <em>how often we meet.</em>
        </h2>
        <p className="lede">
          First, a free {BOOKING.duration} consult to see whether it’s a fit. After that, every plan
          includes demos of what’s new, time spent listening to your team, and hands-on setup in
          your tools. Month to month.
        </p>

        <div className="intro-offer" id="intro">
          <div>
            <span className="tag">After the free consult</span>
            <h3 style={{ marginTop: 18 }}>{INTRO.name}</h3>
            <p className="price">
              {INTRO.price}
              <small>{INTRO.unit}</small>
            </p>
            <p className="plan-cadence">{INTRO.cadence}</p>
            <p className="plan-summary">{INTRO.summary}</p>
            <BookButton light />
          </div>
          <div>
            <ul className="checks">
              {INTRO.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="plans">
          {PLANS.map((p) => (
            <div className={`plan${p.recommended ? ' recommended' : ''}`} key={p.id}>
              <span className="mono">{p.recommended ? 'Recommended' : 'Partnership'}</span>
              <h3 style={{ marginTop: 14 }}>{p.name}</h3>
              <p className="price">
                {p.price}
                <small>{p.unit}</small>
              </p>
              <p className="plan-cadence">{p.cadence}</p>
              <p className="plan-summary">{p.summary}</p>
              <ul className="checks">
                {p.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="every">
          <div>
            <h3>Every plan includes</h3>
            <ul>
              {EVERY_PLAN.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>The fine print</h3>
            <ul>
              {TERMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="about" aria-labelledby="about-title">
        <p className="section-label">
          <b>05</b> / Who you’d work with
        </p>
        <div className="split">
          <div>
            <h2 id="about-title">
              Hi, I’m Andrew. <em>I live here.</em>
            </h2>
            <div className="prose">
              <p>
                I’m based in Fairmount, so Center City is a short trip and on-site sessions are the
                default, not an upsell. My job is to know the tools, keep up with what changes every
                month, and show up regularly to work it out with your team.
              </p>
              <p>I run my own work on these tools every day. Every demo is something I actually use.</p>
            </div>
            <TextLink href="/about">More about me</TextLink>
          </div>
          <div className="portrait-card">
            <span className="mono">How I work</span>
            <ul>
              <li>
                <strong>On a schedule.</strong> Regular beats intense.
              </li>
              <li>
                <strong>Show, then listen.</strong> Demos on your real work first.
              </li>
              <li>
                <strong>Hands on.</strong> I set things up with you, in your accounts.
              </li>
              <li>
                <strong>Straight answers.</strong> Including “don’t use AI for that.”
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="faq" aria-labelledby="faq-title">
        <p className="section-label">
          <b>06</b> / Questions
        </p>
        <h2 id="faq-title">Fair questions.</h2>
        <div className="faq">
          {HOME_FAQS.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
        <p style={{ marginTop: 26 }}>
          <TextLink href="/faq">All questions</TextLink>
        </p>
      </section>

      <section className="section closing thesis" id="book" aria-labelledby="book-title">
        <p className="section-label">
          <b>07</b> / Book
        </p>
        <h2 id="book-title">
          Not sure where to start? <em>Good. That’s the job.</em>
        </h2>
        <p className="lede">
          Book a free {BOOKING.duration} consult. Tell me about your firm and I’ll tell you honestly
          whether working together makes sense. If it’s not a fit, that’s the end of it.
        </p>
        <div className="actions">
          <BookButton />
          <TextLink href="/contact">Questions first? Get in touch</TextLink>
        </div>
      </section>
    </>
  )
}
