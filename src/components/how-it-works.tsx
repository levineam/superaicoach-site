import { MessageSquare, Video, Zap } from "lucide-react";

import { ScrollReveal } from "@/components/scroll-reveal";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    label: "No forms",
    title: "Answer one question",
    description:
      "Tell us what you'd most like to use AI for. No quizzes, no long intake, no commitment.",
  },
  {
    number: "02",
    icon: Video,
    label: "Virtual",
    title: "Free 15-minute consult",
    description:
      "We talk through your goals and show you exactly how coaching works. No sales pitch, just a clear path.",
  },
  {
    number: "03",
    icon: Zap,
    label: "Same day",
    title: "Start getting results",
    description:
      "In a paid session, we build practical AI workflows you can use right away, with real tools and real output.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-[hsl(var(--secondary))]/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal className="mx-auto max-w-3xl text-center md:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/75">
            How it works
          </p>
          <h2 className="mt-4 text-balance font-[family-name:var(--font-inter-tight)] text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl">
            From curious to{" "}
            <span className="font-display italic font-normal text-primary">
              capable
            </span>{" "}
            in three steps.
          </h2>
        </ScrollReveal>

        <ScrollReveal delayMs={80} className="mt-14 md:mt-16">
          <div className="grid gap-10 md:grid-cols-3 md:gap-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary shadow-sm">
                    {step.number}
                  </div>
                  <div
                    className={[
                      "h-px flex-1 bg-primary/25",
                      index === steps.length - 1 ? "hidden" : "hidden md:block",
                    ].join(" ")}
                  />
                </div>

                <div className="mt-6 space-y-4 pr-4 md:pr-8">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/75">
                    {step.label}
                  </p>
                  <h3 className="text-2xl font-[family-name:var(--font-inter-tight)] font-semibold leading-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="max-w-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
