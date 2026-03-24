import type { Metadata } from 'next'
import { Inbox, Sparkles, Download } from 'lucide-react'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProfessionSelector } from '@/components/profession-selector'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://superaicoach.com'

export const metadata: Metadata = {
  title: 'Claude Cowork Starter Packs | SuperAIcoach',
  description:
    'Pre-configured Claude Cowork projects for Financial Advisors, Attorneys, and Executives. Get workflows, custom instructions, and connectors built for your profession.',
  keywords:
    'Claude Cowork, AI starter pack, financial advisor AI, attorney AI tools, executive AI assistant, Claude projects, AI workflow templates',
  alternates: {
    canonical: '/cowork',
  },
  openGraph: {
    title: 'Claude Cowork Starter Packs | SuperAIcoach',
    description:
      'Skip the blank canvas. Get a pre-configured Cowork project with workflows, instructions, and connectors built for your profession.',
    url: `${baseUrl}/cowork`,
    type: 'website',
  },
}

const HOW_IT_WORKS = [
  {
    step: '1',
    icon: Inbox,
    title: 'Pick your profession',
    description: 'Choose from Financial Advisor, Attorney, or Executive to see skill cards tailored to your work.',
  },
  {
    step: '2',
    icon: Sparkles,
    title: 'Enter your email',
    description: 'Drop your email and we\'ll send you a ready-to-use pack with custom instructions and workflows.',
  },
  {
    step: '3',
    icon: Download,
    title: 'Get your ready-to-import Cowork project',
    description: 'Import the project into Claude Cowork and start working with a pre-built assistant in minutes.',
  },
]

export default function CoworkPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-28">
        {/* Hero */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md">
            Cowork Starter Packs
          </div>

          <h1 className="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            Claude Cowork, set up for{' '}
            <span className="text-accent">your profession</span>
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Skip the blank canvas. Get a pre-configured Cowork project with workflows, instructions,
            and connectors that matter for your role.
          </p>
        </div>

        {/* Profession Selector */}
        <section className="mt-14" aria-label="Profession selector">
          <ProfessionSelector />
        </section>

        {/* How It Works */}
        <section className="mt-20" aria-labelledby="how-it-works-heading">
          <div className="rounded-3xl border border-border/60 bg-card/30 p-8 backdrop-blur-xl md:p-10">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">
                How it works
              </p>
              <h2
                id="how-it-works-heading"
                className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                Three steps to a ready-to-use AI workspace
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Your profession-specific Claude Cowork project, assembled and ready to import in
                minutes.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {HOW_IT_WORKS.map(({ step, icon: Icon, title, description }) => (
                <div
                  key={step}
                  className="rounded-2xl border border-border/60 bg-background/70 p-5"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                      <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Step {step}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
