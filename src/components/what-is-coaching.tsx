import { ScrollReveal } from '@/components/scroll-reveal'

export function WhatIsCoaching() {
  return (
    <section className="py-24 md:py-32">
      <ScrollReveal className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          What is a curated AI stack?
        </h2>
        <div className="mt-6 space-y-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          <p>
            Most AI tools ship as blank canvases. You&apos;re supposed to figure out
            prompts, integrations, and workflows on your own. That&apos;s fine if you
            have time to tinker — but most people don&apos;t.
          </p>
          <p>
            Super AI Coach packages a working AI assistant setup — the same one we
            use every day for email, writing, research, scheduling, and automation —
            into installable skills and configs you can run yourself.
          </p>
          <p>
            You get the result of thousands of hours of building and testing. We get
            to keep building because members fund the work. Everyone wins.
          </p>
        </div>
      </ScrollReveal>
    </section>
  )
}
