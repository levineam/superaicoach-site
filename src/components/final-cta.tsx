import { WaitlistCTA } from '@/components/waitlist-cta'
import { ScrollReveal } from '@/components/scroll-reveal'

export function FinalCTA() {
  return (
    <section id="cta" className="py-24 md:py-32">
      <ScrollReveal className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Stop configuring. Start using.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Join the waitlist and be first to get a curated AI stack that actually works.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <WaitlistCTA source="final-cta" />
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Questions?{' '}
          <a
            className="underline underline-offset-4 hover:text-foreground"
            href="mailto:hello@superaicoach.com"
          >
            hello@superaicoach.com
          </a>
        </p>
      </ScrollReveal>
    </section>
  )
}
