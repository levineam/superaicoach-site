import { ScrollReveal } from "@/components/scroll-reveal";

export function WhatIsCoaching() {
  return (
    <section className="bg-[hsl(var(--secondary))]/55 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal className="grid gap-10 rounded-[2rem] border border-border/80 bg-background p-8 shadow-[0_18px_50px_-32px_rgba(20,40,80,0.28)] md:grid-cols-[1.05fr_0.95fr] md:p-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/75">
              The offer
            </p>
            <h2 className="mt-4 text-balance font-[family-name:var(--font-inter-tight)] text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl">
              What is personal AI{" "}
              <span className="font-display italic font-normal text-primary">
                coaching
              </span>
              ?
            </h2>
            <div className="mt-6 space-y-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              <p>
                Personal AI coaching is a 1:1 service where a real person helps you
                use tools like ChatGPT, Claude, and OpenClaw for your specific
                work and life admin tasks. It is not a course, a community, or a
                piece of software.
              </p>
              <p>
                Instead of generic tutorials, you get workflows built around the
                things you actually do every day, like writing emails, preparing
                for meetings, planning projects, or setting up an always-on AI
                assistant that keeps working while you sleep.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 rounded-[1.75rem] border border-border bg-[hsl(var(--secondary))]/65 p-7">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/75">
                Why it lands
              </p>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
                <li className="rounded-2xl bg-background/80 p-4">
                  <span className="block font-semibold text-foreground">Built around your actual work</span>
                  No abstract demos, just live workflows tied to your inbox, meetings, writing, and planning.
                </li>
                <li className="rounded-2xl bg-background/80 p-4">
                  <span className="block font-semibold text-foreground">Personalized, not generic</span>
                  You leave with systems fitted to how you already work, not a template you have to force.
                </li>
              </ul>
            </div>

            <div className="rounded-[1.5rem] bg-primary px-6 py-5 text-primary-foreground">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--gold))]">
                The goal
              </p>
              <p className="mt-3 text-base leading-relaxed text-primary-foreground/80">
                Save you real time, right away, without asking you to become an AI expert or change how you work.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
