import Link from 'next/link'

import { MembershipWaitlistForm } from '@/components/membership-waitlist-form'
import { ScrollReveal } from '@/components/scroll-reveal'

export function FinalCTA() {
  return (
    <section id="cta" className="py-24 md:py-32">
      <ScrollReveal className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Stop configuring. Start using.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Join the waitlist and be first to get a curated AI stack that actually works.
        </p>

        <div className="mt-10 flex justify-center">
          <MembershipWaitlistForm source="final-cta" buttonLabel="Join the Waitlist" />
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Questions?{' '}
          <Link className="underline underline-offset-4 hover:text-foreground" href="mailto:hello@superaicoach.com">
            hello@superaicoach.com
          </Link>
        </p>
      </ScrollReveal>
    </section>
  )
}
