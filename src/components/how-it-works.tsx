import { UserCheck, Download, TrendingUp } from 'lucide-react'

import { ScrollReveal } from '@/components/scroll-reveal'

const steps = [
  {
    number: '01',
    icon: UserCheck,
    title: 'Pick your profile',
    description:
      "Tell us what you use AI for — writing, research, content, building. We'll match you to a starter config.",
  },
  {
    number: '02',
    icon: Download,
    title: 'Install & go',
    description:
      'Download your config, install the skills, follow the quickstart. Most people are up in under 30 minutes.',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Stay current',
    description:
      'New skills, updated configs, and a daily briefing land in your inbox. Your AI stack keeps getting better without effort.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-primary py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            How it works
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            From signup to running AI assistant in three steps
          </h2>
        </ScrollReveal>

        <ScrollReveal delayMs={80} className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <span className="text-5xl font-bold text-primary-foreground/10">
                {step.number}
              </span>
              <div className="mt-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-primary-foreground">
                {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-primary-foreground/70">
                {step.description}
              </p>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
