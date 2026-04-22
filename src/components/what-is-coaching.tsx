import { ScrollReveal } from "@/components/scroll-reveal"

export function WhatIsCoaching() {
  return (
    <section className="py-24 md:py-32">
      <ScrollReveal className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display text-balance text-3xl font-semibold text-foreground sm:text-4xl">
          What is personal AI coaching?
        </h2>
        <div className="mt-6 space-y-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          <p>
            Personal AI coaching is a 1:1 service where a real person helps you
            learn how to use AI tools — like ChatGPT, Claude, and OpenClaw/clawdbot — for your
            specific work and life admin tasks. It&apos;s not a course, a community,
            or a piece of software.
          </p>
          <p>
            Instead of generic tutorials, you get personalized workflows built
            around the things you actually do every day: writing emails,
            preparing for meetings, planning projects, or setting up an always-on
            AI assistant with tools like OpenClaw to handle tasks while you sleep.
          </p>
          <p>
            The goal is simple: save you real time, right away, without asking
            you to become an AI expert or change the way you work.
          </p>
        </div>
      </ScrollReveal>
    </section>
  )
}
