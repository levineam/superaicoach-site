import { ConsultationCTA } from "@/components/consultation-cta";
import { ScrollReveal } from "@/components/scroll-reveal";

export function FinalCTA() {
  return (
    <section id="cta" className="bg-[hsl(var(--secondary))]/55 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal className="overflow-hidden rounded-[2rem] border border-primary bg-primary px-8 py-12 text-center text-primary-foreground shadow-[0_28px_80px_-36px_rgba(20,40,80,0.55)] md:px-16 md:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[hsl(var(--gold))]">
            Start here
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-balance font-[family-name:var(--font-inter-tight)] text-3xl font-semibold tracking-[-0.02em] text-primary-foreground sm:text-4xl md:text-5xl">
            Ready to save{" "}
            <span className="font-display italic font-normal text-[hsl(var(--gold))]">
              hours
            </span>{" "}
            every week with AI?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-primary-foreground/72">
            Book a free 15-minute consult, bring one real use case, and leave with a clear next step plus a live booking on the calendar.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <ConsultationCTA
              source="final-cta"
              buttonClassName="bg-[hsl(var(--gold))] text-primary shadow-none hover:bg-[hsl(var(--gold))]/90"
            />
          </div>

          <p className="mt-6 text-sm text-primary-foreground/60">
            Prefer email?{" "}
            <a
              className="underline underline-offset-4 hover:text-primary-foreground"
              href="mailto:hello@superaicoach.com?subject=Free%2015-min%20consult"
            >
              hello@superaicoach.com
            </a>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
