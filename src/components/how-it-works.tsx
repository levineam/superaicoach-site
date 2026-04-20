import { MessageSquare, Video, Zap } from "lucide-react";

import { ScrollReveal } from "@/components/scroll-reveal";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Answer one question",
    description:
      "Tell us what you'd most like to use AI for. That's it — no forms, no quizzes, no commitment.",
  },
  {
    number: "02",
    icon: Video,
    title: "Free 15-minute consult",
    description:
      "We'll talk through your goals and show you exactly how coaching works. No sales pitch — just clarity on what's possible.",
  },
  {
    number: "03",
    icon: Zap,
    title: "Start getting results",
    description:
      "In a paid virtual session, we build you practical AI workflows you can use the same day. Real tools, real output.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-primary py-24 text-primary-foreground md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[hsl(var(--gold))]">
            How it works
          </p>
          <h2 className="mt-4 text-balance font-[family-name:var(--font-inter-tight)] text-3xl font-semibold tracking-[-0.02em] text-primary-foreground sm:text-4xl md:text-5xl">
            From curious to{" "}
            <span className="font-display italic font-normal text-[hsl(var(--gold))]">
              capable
            </span>{" "}
            in three steps
          </h2>
        </ScrollReveal>

        <ScrollReveal delayMs={80} className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-[1.75rem] border border-primary-foreground/10 bg-primary-foreground/[0.03] p-8"
            >
              <span className="font-display text-5xl italic text-[hsl(var(--gold))]/40">
                {step.number}
              </span>
              <div className="mt-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10 text-[hsl(var(--gold))]">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-inter-tight)] text-2xl font-semibold text-primary-foreground">
                {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-primary-foreground/72">
                {step.description}
              </p>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
