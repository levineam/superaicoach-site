import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { MembershipWaitlistForm } from '@/components/membership-waitlist-form'

export function Hero() {
  return (
    <section className="relative flex items-start justify-center overflow-hidden pt-16 sm:pt-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(158_60%_40%/0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(30_20%_85%/0.5),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-14 pt-8 text-center sm:pt-10 md:pt-14">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Pre-configured AI stack + curated resources membership
        </div>

        <h1 className="mx-auto mt-6 max-w-5xl text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          Your AI Stack, Curated and Ready
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-foreground/75 md:text-xl">
          Pre-configured AI skills, daily briefings, and starter kits —
          built by someone who runs this stack every day, packaged so you
          don&apos;t have to set it up yourself.
        </p>

        <div className="mt-10 flex justify-center">
          <MembershipWaitlistForm source="hero" />
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground sm:flex-row">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Browse Free Resources
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
