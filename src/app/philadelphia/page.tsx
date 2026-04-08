import Script from 'next/script'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ArrowRight, Sparkles, Mail, Workflow, Shield } from 'lucide-react'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ScrollReveal } from '@/components/scroll-reveal'
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
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-32 sm:pt-36">
        <div className="grid items-center gap-12 md:grid-cols-5">
          <div className="md:col-span-3">
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
              Introductory pricing: <span className="text-accent">$100/hour</span>,{' '}
              <span className="line-through text-muted-foreground">$200/hour</span>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4" id="book">
              <Link
                href="https://calendly.com/levineam/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-8 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-colors hover:bg-accent/90"
              >
                Book a Call
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

          <div className="relative md:col-span-2">
            <div className="rounded-[2rem] border border-border/60 bg-card/30 p-4 shadow-lg shadow-black/5 backdrop-blur-xl">
              <Image
                src="/philadelphia-hero.png"
                alt="OpenClaw and Hermes Agent logos — personal AI assistant platforms"
                width={949}
                height={414}
                priority
                className="w-full"
              />
            </div>
          </div>
        </div>

        <section className="mt-20" id="how-it-works">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              How It Works
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
              Three steps. Live within hours.
            </h2>
          </ScrollReveal>
          <ScrollReveal delayMs={60} className="mt-10 grid gap-8 md:grid-cols-3">
            {howItWorks.map((item) => (
              <div key={item.step} className="flex gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-0.5 text-xs font-medium text-accent">{item.subtitle}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </section>

        <section className="mt-20">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              What&apos;s Possible
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
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
                className="rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl"
              >
                <Sparkles className="h-5 w-5 text-accent" />
                <h3 className="mt-3 text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </ScrollReveal>
        </section>

        <section className="mt-20">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Included
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
              Every setup includes the full package
            </h2>
          </ScrollReveal>
          <ScrollReveal delayMs={60} className="mt-10 grid gap-6 sm:grid-cols-2">
            {included.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <item.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </section>

        <section className="mt-20">
          <ScrollReveal className="rounded-3xl border border-border/60 bg-primary p-10 text-primary-foreground">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Pricing</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Starting at $100/hour</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-primary-foreground/75">
              In-person, at your location in the Philadelphia area. Most sessions run 1–2 hours. No
              subscription required — pay for the time you need.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="https://calendly.com/levineam/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-8 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-colors hover:bg-accent/90"
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
        </section>

        <section className="mt-20" id="faq">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">FAQ</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
              Common questions
            </h2>
          </ScrollReveal>
          <ScrollReveal delayMs={60} className="mt-10 max-w-3xl">
            <PhiladelphiaFAQ faqs={faqs} />
          </ScrollReveal>
        </section>

        <section className="mt-20">
          <ScrollReveal className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Get Started
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
              Stop losing hours to work an AI assistant can handle
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              30-minute call. No technical jargon. We&apos;ll show you exactly what an AI assistant
              can take off your plate.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="https://calendly.com/levineam/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-8 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-colors hover:bg-accent/90"
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
