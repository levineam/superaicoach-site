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
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-foreground/55">
            How it works
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
            From curious to{" "}
            <span className="italic text-primary-foreground/80">capable</span>{" "}
            in three steps
          </h2>
        </ScrollReveal>

        <ScrollReveal delayMs={80} className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-[1.75rem] border border-primary-foreground/10 bg-primary-foreground/[0.03] p-8"
            >
              <span className="font-display text-5xl italic text-primary-foreground/15">
                {step.number}
              </span>
              <div className="mt-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10 text-primary-foreground">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-2xl text-primary-foreground">
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
