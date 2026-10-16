import type { Metadata } from 'next'

import { BookButton } from '@/components/book-button'
import { TextLink } from '@/components/button'
import { SITE } from '@/config/site'

export const metadata: Metadata = {
  title: 'About Andrew Levine, AI Consultant in Philadelphia',
  description:
    'Andrew Levine is a Philadelphia AI consultant who works hands-on with small and medium firms: regular sessions, live demos, and setup in your own tools.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Andrew Levine, AI Consultant in Philadelphia',
    description: 'Andrew Levine is a Philadelphia AI consultant who works hands-on with small and medium firms: regular sessions, live demos, and setup in your own tools.',
    url: '/about',
    type: 'website',
  },
}

export default function About() {
  return (
    <>
      <section className="page-head">
        <p className="eyebrow">
          About
          <small>AI Consulting Services · Philadelphia</small>
        </p>
        <h1>
          Hi, I’m Andrew. <em>I’m local, and I’m hands-on.</em>
        </h1>
      </section>
      <section className="page-body">
        <div className="split">
          <div className="prose">
            <p>
              I live and work in Fairmount, and I’m an AI partner for Philadelphia firms. My job is to
              know the tools, keep up with what changes every month, and show up regularly to work it
              out with your team.
            </p>
            <p>
              I started this because I kept hearing the same thing from business owners: “We know we
              should be doing something with AI. We just don’t know what.” That’s a reasonable place
              to be. The tools move fast, nobody on staff has time to test them, and most of the help
              on offer is either a course or a consultant who wants a spec on day one.
            </p>
            <h2>What I believe</h2>
            <p>
              <strong>AI replaces meaningless work, not people.</strong> The best use of these tools
              is taking the copy-paste, the reformatting, and the blank-page drafts out of someone’s
              week, so the people you hired for their judgment get to use it.
            </p>
            <h2>Where I’m at</h2>
            <p>
              I’m early in this. My first engagement was a free pilot with a Philadelphia law firm in
              spring 2026. I don’t have a wall of logos, so I don’t ask you to bet on one. Everything
              is month to month, and it starts with a single two-hour session.
            </p>
            <p>
              Outside of client work I write about technology, intelligence, and abundance at{' '}
              <a href={SITE.personalSite}>andrarchy.com</a>, and I build my own AI tools, which is
              how I keep up.
            </p>
            <div className="actions" style={{ marginTop: 34 }}>
              <BookButton />
              <TextLink href="/#plans">See plans</TextLink>
            </div>
          </div>
          <div className="portrait-card">
            <span className="mono">How I work</span>
            <ul>
              <li>
                <strong>On a schedule.</strong> Monthly, every other week, or weekly. Regular beats
                intense.
              </li>
              <li>
                <strong>Show, then listen.</strong> I demo on your real work, then let your team tell
                me what would help.
              </li>
              <li>
                <strong>Hands on.</strong> I set things up with you, in your accounts, and adjust them
                as you learn.
              </li>
              <li>
                <strong>Straight answers.</strong> If AI isn’t the right fix for something, I’ll say
                so.
              </li>
              <li>
                <strong>I use what I recommend.</strong> My own work runs on these tools every day.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
