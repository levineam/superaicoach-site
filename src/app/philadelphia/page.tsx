import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ScrollReveal } from '@/components/scroll-reveal'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://superaicoach.com'

export const metadata: Metadata = {
  title: "Philadelphia's Personal AI Assistant Setup Service | SuperAIcoach",
  description:
    'Get a personal AI assistant that actually knows you — set up in your home or office by an expert. Philadelphia-area in-person AI setup consulting at $100/hour.',
  keywords:
    'Philadelphia personal AI assistant, AI assistant setup Philadelphia, in-person AI setup Philadelphia, AI coaching Philadelphia, home AI setup',
  alternates: {
    canonical: '/philadelphia',
  },
  openGraph: {
    title: "Philadelphia's Personal AI Assistant Setup Service | SuperAIcoach",
    description:
      'Get a personal AI assistant that actually knows you — set up in your home or office by an expert. Starting at $100/hour.',
    url: `${baseUrl}/philadelphia`,
    type: 'website',
    locale: 'en_US',
    siteName: 'SuperAIcoach',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Philadelphia's Personal AI Assistant Setup Service | SuperAIcoach",
    description:
      'Personal AI assistant setup in your home or office. Starting at $100/hour in Philadelphia.',
  },
}

export default function PhiladelphiaPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-28">
        {/* Hero */}
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left — Copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md">
              <MapPin className="h-4 w-4" />
              Philadelphia &amp; surrounding area
            </div>

            <h1 className="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              Philadelphia AI Personal Assistant Setup
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              On-site installation of OpenClaw or Hermes Agents, customized to your needs
            </p>

            <p className="mt-3 text-base font-medium text-foreground">
              Introductory pricing:{' '}
              <span className="text-accent">$100/hour</span>,{' '}
              <span className="line-through text-muted-foreground">$200/hour</span>
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-4" id="book">
              <Link
                href="https://calendly.com/superaicoach"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-8 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-colors hover:bg-accent/90"
              >
                Book a session
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Questions first?{' '}
              <a
                href="mailto:hello@superaicoach.com"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Email us
              </a>
            </p>
          </div>

          {/* Right — Image */}
          <div className="relative">
            <Image
              src="/philadelphia-hero.png"
              alt="Philadelphia AI Personal Assistant Setup"
              width={949}
              height={414}
              className="rounded-2xl border border-border/60 shadow-lg"
              priority
            />
          </div>
        </div>

        {/* What you get */}
        <section className="mt-20">
          <ScrollReveal>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">What you get</h2>
          </ScrollReveal>
          <ScrollReveal delayMs={60} className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Personalized',
                body: 'Your assistant is configured around your work style, habits, and goals — not a generic preset.',
              },
              {
                title: 'Private',
                body: 'Your data stays yours. We set up a system you own and control, not something that phones home.',
              },
              {
                title: 'Works the way you do',
                body: "We fit the setup to how you actually operate — whether that's at a desk, on the go, or both.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border/60 bg-card/40 p-7 backdrop-blur-xl"
              >
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </ScrollReveal>
        </section>

        {/* How it works */}
        <section className="mt-20">
          <ScrollReveal>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">How it works</h2>
          </ScrollReveal>
          <ScrollReveal delayMs={60} className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              { step: '1', title: 'Book', body: 'Pick a time that works for you — we come to your home or office in the Philadelphia area.' },
              { step: '2', title: 'We come to you', body: 'We spend 1–2 hours setting everything up in person, tailored to your specific setup.' },
              { step: '3', title: "You're set up", body: 'Walk away with a working personal AI assistant, not homework.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </section>

        {/* Technology */}
        <section className="mt-20">
          <ScrollReveal className="rounded-3xl border border-border/60 bg-card/60 p-10 backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Technology</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
              Built on tools that actually work
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              We support{' '}
              <span className="font-medium text-foreground">OpenClaw</span> and{' '}
              <span className="font-medium text-foreground">Hermes</span> setups — two of the most
              capable personal AI platforms available. If you&apos;re technical, you&apos;ll
              appreciate the depth. If you&apos;re not, we handle all of it for you.
            </p>
          </ScrollReveal>
        </section>

        {/* Price + CTA */}
        <section className="mt-20">
          <ScrollReveal className="rounded-3xl border border-border/60 bg-primary p-10 text-primary-foreground">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Pricing</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Starting at $100/hour</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-primary-foreground/75">
              In-person, at your location in the Philadelphia area. Most sessions run 1–2 hours.
              No subscription required — pay for the time you need.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="https://calendly.com/superaicoach"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-8 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-colors hover:bg-accent/90"
              >
                Book a session
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="mailto:hello@superaicoach.com"
                className="text-sm text-primary-foreground/75 underline underline-offset-4 hover:text-primary-foreground"
              >
                Questions? Email us
              </a>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </>
  )
}
