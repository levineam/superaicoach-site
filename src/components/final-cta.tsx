import { ConsultationCTA } from "@/components/consultation-cta"
import { ScrollReveal } from "@/components/scroll-reveal"

export function FinalCTA() {
  return (
    <section id="cta" className="py-24 md:py-32">
      <ScrollReveal className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Ready to save hours every week with AI?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Book a free 15-minute consult and bring one real use case. You&apos;ll leave
          with a clear next step and a live booking on the calendar.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <ConsultationCTA source="final-cta" />
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Prefer email? <a className="underline underline-offset-4 hover:text-foreground" href="mailto:hello@superaicoach.com?subject=Free%2015-min%20consult">hello@superaicoach.com</a>
        </p>
      </ScrollReveal>
    </section>
  )
}
