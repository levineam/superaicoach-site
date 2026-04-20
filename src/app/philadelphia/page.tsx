import Script from 'next/script'
import Link from 'next/link'
import { MapPin, ArrowRight, Sparkles, Mail, Workflow, Shield } from 'lucide-react'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ScrollReveal } from '@/components/scroll-reveal'
import { HeroChat } from '@/components/hero-chat'
import {
  buildFAQSchema,
  buildOrganizationSchema,
  buildServiceSchema,
} from '@/components/structured-data'

import { PhiladelphiaFAQ } from './philadelphia-faq'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://superaicoach.com'

const howItWorks = [
  {
    step: '01',
    title: 'Tell us what you need',
    subtitle: '30-minute call',
    body: 'We learn how you work, what tools you use, and where you\'re losing time.',
  },
  {
    step: '02',
    title: 'We set it up for you',
    subtitle: 'In-person',
    body: 'We install your AI assistant, connect your email and calendar, and configure it to your life — at your home or office.',
  },
  {
    step: '03',
    title: 'It just works',
    subtitle: 'Walk away ready',
    body: 'Walk away with a working assistant. No homework, no technical setup left on your plate.',
  },
]

const useCases = [
  {
    title: 'Family meal planning on autopilot',
    body: 'Plans weekly meals, generates grocery lists sorted by store aisle, checks weather for grill nights. Saves ~1 hour every week.',
  },
  {
    title: 'Travel that manages itself',
    body: 'Calendar-aware assistant checks in for flights 24 hours before departure, handles boarding without any prompting.',
  },
  {
    title: '15,000 emails cleared on day one',
    body: 'Inbox zero on autopilot — categorizes, unsubscribes, archives spam, drafts replies. Saves 2-3 hours every day.',
  },
  {
    title: 'Control your house by text',
    body: '"Set living room to evening mode" — lights, thermostat, and music all adjust. Built on a Raspberry Pi in 20 minutes.',
  },
  {
    title: 'Custom meditations based on your body',
    body: 'Reads WHOOP or Oura recovery data, writes meditation scripts tailored to that day\'s strain, and generates audio.',
  },
  {
    title: 'A lawyer\'s 24/7 research assistant',
    body: 'Real law firm uses OpenClaw for case research, document management, and client intake — all on their own hardware.',
  },
]

const included = [
  {
    icon: MapPin,
    title: 'Personal setup',
    body: 'At your home or office in the Philadelphia area. We come to you.',
  },
  {
    icon: Mail,
    title: 'Email & calendar connected',
    body: 'Works with Gmail, Outlook, Apple Calendar, and more. Functional from day one.',
  },
  {
    icon: Workflow,
    title: 'Custom workflows',
    body: 'Automations configured for your actual routines — meal planning, scheduling, follow-ups.',
  },
  {
    icon: Shield,
    title: 'Privacy-first',
    body: 'Your data stays on your hardware. Nothing leaves your infrastructure. Period.',
  },
]

const faqs = [
  {
    question: 'What exactly does the AI assistant do?',
    answer:
      'It reads and triages your email, manages your calendar, drafts replies, runs custom workflows, and handles repetitive tasks you define. Think of it as a personal assistant that works 24/7 and never drops the ball.',
  },
  {
    question: 'Do I need to know anything about AI?',
    answer:
      'No. We handle all the technical work. You tell us what you need help with, and we configure everything. You interact with your assistant through iMessage, WhatsApp, or whatever messaging app you already use.',
  },
  {
    question: 'How long does setup take?',
    answer:
      'Most sessions run 1-2 hours. In-person in the Philadelphia area. You walk away with a fully working assistant.',
  },
  {
    question: 'Where does my data go?',
    answer:
      'Nowhere. Your AI assistant runs on hardware you own. Your emails, documents, and personal data never leave your infrastructure.',
  },
  {
    question: 'What if I want changes after setup?',
    answer:
      'Reach out anytime. We can adjust workflows, add new automations, or reconfigure as your needs change.',
  },
  {
    question: 'Is this for business or personal use?',
    answer:
      'Both. Some people use it for work — email triage, scheduling, client follow-ups. Others use it for home life — meal planning, family calendars, smart home control. Most use it for both.',
  },
]

const localBusinessSchema = buildOrganizationSchema({
  type: 'LocalBusiness',
  name: 'SuperAIcoach',
  description:
    'In-person AI personal assistant setup service in Philadelphia. We install and configure OpenClaw or Hermes Agent on your hardware, tailored to your life.',
  url: `${baseUrl}/philadelphia`,
  email: 'hello@superaicoach.com',
  areaServed: [
    { '@type': 'City', name: 'Philadelphia' },
    { '@type': 'State', name: 'Pennsylvania' },
  ],
  address: {
    addressLocality: 'Philadelphia',
    addressRegion: 'PA',
    addressCountry: 'US',
  },
  priceRange: '$100-$200',
  sameAs: ['https://x.com/andrewlevine'],
})

const serviceSchema = buildServiceSchema({
  name: 'Personal AI Assistant Setup',
  description:
    'In-person installation and configuration of OpenClaw or Hermes Agent AI assistants for personal and professional use in the Philadelphia area.',
  url: `${baseUrl}/philadelphia`,
  providerName: 'SuperAIcoach',
  providerUrl: baseUrl,
  providerType: 'LocalBusiness',
  serviceType: 'AI Assistant Installation and Configuration',
  areaServed: { '@type': 'City', name: 'Philadelphia' },
  offers: {
    '@type': 'Offer',
    name: 'Introductory Setup',
    description: 'In-person AI assistant setup at your home or office in Philadelphia',
    price: '100',
    priceCurrency: 'USD',
    billingIncrement: 'PT1H',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'AI Setup Services',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Introductory Setup',
        description: 'In-person AI assistant setup at your home or office in Philadelphia',
        price: '100',
        priceCurrency: 'USD',
        billingIncrement: 'PT1H',
      },
    ],
  },
})

const faqSchema = buildFAQSchema({ faqs })

export default function PhiladelphiaPage() {
  return (
    <>
      <Script
        id="structured-data-philadelphia-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Script
        id="structured-data-philadelphia-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Script
        id="structured-data-philadelphia-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navbar mode="pill-on-scroll" />
      <main>
        <section className="pt-28 sm:pt-32 md:pt-36">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 md:grid-cols-5 md:pb-24">
            <div className="md:col-span-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                Philadelphia &amp; surrounding area
              </div>

              <h1 className="mt-6 text-balance font-[family-name:var(--font-inter-tight)] text-4xl font-semibold leading-[1.04] tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl">
                Philadelphia AI personal{' '}
                <span className="font-display italic font-normal text-primary">assistant</span>{' '}
                setup
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                On-site installation of OpenClaw or Hermes Agents, customized to your life and work.
              </p>

              <p className="mt-4 text-base font-medium text-foreground">
                Introductory pricing: <span className="text-primary">$100/hour</span>,{' '}
                <span className="line-through text-muted-foreground">$200/hour</span>
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4" id="book">
                <Link
                  href="https://calendly.com/levineam/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition-colors hover:bg-primary/90"
                >
                  Book a Call
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="mailto:hello@superaicoach.com"
                  className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  Questions? Email us
                </a>
              </div>
            </div>

            <div className="md:col-span-2">
              <HeroChat />
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24" id="how-it-works">
          <div className="mx-auto max-w-6xl px-6">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
                How it works
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-inter-tight)] text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
                Three steps. Live within hours.
              </h2>
            </ScrollReveal>
            <ScrollReveal delayMs={60} className="mt-12 grid gap-8 md:grid-cols-3">
              {howItWorks.map((item) => (
                <div key={item.step} className="flex gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-inter-tight)] text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                      {item.subtitle}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
                What&apos;s possible
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-inter-tight)] text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
                Real things real people are doing with personal AI assistants
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                These aren&apos;t testimonials — they&apos;re documented examples from the OpenClaw and
                Hermes Agent community.
              </p>
            </ScrollReveal>
            <ScrollReveal delayMs={60} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {useCases.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_12px_32px_-16px_rgba(20,40,80,0.18)]"
                >
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="mt-3 font-[family-name:var(--font-inter-tight)] text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
                Included
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-inter-tight)] text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
                Every setup includes the full package
              </h2>
            </ScrollReveal>
            <ScrollReveal delayMs={60} className="mt-10 grid gap-6 sm:grid-cols-2">
              {included.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-inter-tight)] text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <ScrollReveal className="rounded-3xl border border-primary bg-primary p-10 text-primary-foreground md:p-14">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[hsl(var(--gold))]">
                Pricing
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-inter-tight)] text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                Starting at $100/hour
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-primary-foreground/75">
                In-person, at your location in the Philadelphia area. Most sessions run 1–2 hours. No
                subscription required — pay for the time you need.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="https://calendly.com/levineam/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-[hsl(var(--gold))] px-8 text-base font-semibold text-primary shadow-lg transition-colors hover:bg-[hsl(var(--gold))]/90"
                >
                  Book a Call
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
          </div>
        </section>

        <section className="py-20 md:py-24" id="faq">
          <div className="mx-auto max-w-3xl px-6">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
                FAQ
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-inter-tight)] text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
                Common questions
              </h2>
            </ScrollReveal>
            <ScrollReveal delayMs={60} className="mt-10">
              <PhiladelphiaFAQ faqs={faqs} />
            </ScrollReveal>
          </div>
        </section>

        <section className="bg-primary py-24 text-primary-foreground md:py-28">
          <ScrollReveal className="mx-auto max-w-3xl px-6 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[hsl(var(--gold))]">
              Get started
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-inter-tight)] text-3xl font-semibold tracking-[-0.02em] text-primary-foreground sm:text-4xl md:text-5xl">
              Stop losing hours to work an AI assistant can handle
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-primary-foreground/72">
              30-minute call. No technical jargon. We&apos;ll show you exactly what an AI assistant
              can take off your plate.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                href="https://calendly.com/levineam/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[hsl(var(--gold))] px-8 text-base font-semibold text-primary shadow-lg transition-colors hover:bg-[hsl(var(--gold))]/90"
              >
                Book a Call
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </>
  )
}
