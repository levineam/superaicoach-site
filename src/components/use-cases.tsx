import {
  Brain,
  FileText,
  ListChecks,
  RotateCcw,
  Search,
  Users,
} from "lucide-react";

import { ScrollReveal } from "@/components/scroll-reveal";

const cases = [
  {
    icon: FileText,
    title: "Write Faster",
    description:
      "Emails, docs, proposals — produce better drafts in a fraction of the time with AI as your co-writer.",
  },
  {
    icon: Brain,
    title: "Think Clearer",
    description:
      "Make sharper decisions by using AI to map out tradeoffs, weigh options, and pressure-test your thinking.",
  },
  {
    icon: Users,
    title: "Run Better Meetings",
    description:
      "Prep agendas, capture action items, and turn notes into next steps — before and after every meeting.",
  },
  {
    icon: ListChecks,
    title: "Plan Effectively",
    description:
      "Break projects into clear priorities and milestones. Get AI to help you build actionable plans fast.",
  },
  {
    icon: Search,
    title: "Research Smarter",
    description:
      "Synthesize articles, reports, and data into concise takeaways you can actually use.",
  },
  {
    icon: RotateCcw,
    title: "Automate Admin",
    description:
      "Recurring tasks, repetitive formatting, tedious follow-ups — hand the busywork to an always-on AI assistant like OpenClaw/clawdbot that works even when you're offline.",
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
            What we help you do
          </p>
          <h2 className="mt-4 text-balance font-[family-name:var(--font-inter-tight)] text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl">
            Practical AI for{" "}
            <span className="font-display italic font-normal text-primary">
              everyday
            </span>{" "}
            work
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            We coach you on specific, real-world workflows — not abstract AI
            theory. Here are a few areas where our clients see results
            immediately.
          </p>
        </ScrollReveal>

        <ScrollReveal
          delayMs={80}
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cases.map((c) => (
            <div
              key={c.title}
              className="group rounded-[1.5rem] border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_12px_32px_-16px_rgba(20,40,80,0.18)] motion-reduce:hover:translate-y-0"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="font-[family-name:var(--font-inter-tight)] text-[1.25rem] font-semibold leading-tight tracking-[-0.01em] text-foreground">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {c.description}
              </p>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
