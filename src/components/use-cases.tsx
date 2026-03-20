import {
  Package,
  Mail,
  Settings,
  BookOpen,
  Users,
  RefreshCw,
} from 'lucide-react'

import { ScrollReveal } from '@/components/scroll-reveal'

const valueProps = [
  {
    icon: Package,
    title: 'Pre-Built AI Skills',
    description:
      '40+ tested skills for email, calendar, research, content creation, and automation. Install in one command.',
  },
  {
    icon: Mail,
    title: 'Daily AI Briefing',
    description:
      'A short newsletter every morning: what shipped, what we learned, tips you can use today. Written by the agent, approved by a human.',
  },
  {
    icon: Settings,
    title: 'Starter Configs',
    description:
      'Pick a profile — Productivity, Content Creator, Researcher, Builder — and get a working AI assistant config in minutes.',
  },
  {
    icon: BookOpen,
    title: 'No-Tinker Setup Guides',
    description:
      "Step-by-step instructions that assume you're busy, not a developer. Copy-paste and go.",
  },
  {
    icon: Users,
    title: 'Community Access',
    description:
      'Discord community of people using the same stack. Ask questions, share workflows, get help.',
  },
  {
    icon: RefreshCw,
    title: 'Always Improving',
    description:
      'New skills and configs ship weekly. Your membership stays current because the system that builds them runs 24/7.',
  },
]

export function UseCases() {
  return (
    <section id="use-cases" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            What you get
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to actually use AI — without the setup headache
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty leading-relaxed">
            We use this stack every day. You get the proven configs, skills, and
            workflows — ready to install.
          </p>
        </ScrollReveal>

        <ScrollReveal delayMs={80} className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {valueProps.map((v) => (
            <div
              key={v.title}
              className="group rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 motion-reduce:hover:translate-y-0"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {v.description}
              </p>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
