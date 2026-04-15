import { ConsultationCTA } from "@/components/consultation-cta";
import { ScrollReveal } from "@/components/scroll-reveal";

export function FinalCTA() {
  return (
    <section
      id="cta"
      className="bg-primary py-24 text-primary-foreground md:py-32"
    >
      <ScrollReveal className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-foreground/55">
          Start here
        </p>
        <h2 className="mt-4 text-balance font-display text-3xl tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
          Ready to save{" "}
          <span className="italic text-primary-foreground/80">hours</span> every
          week with AI?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-primary-foreground/72">
          Free 15-minute consults are opening soon. Click below to see how to
          get early access.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <ConsultationCTA
            source="final-cta"
            buttonClassName="bg-background text-foreground hover:bg-background/90"
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
    </section>
  );
}
