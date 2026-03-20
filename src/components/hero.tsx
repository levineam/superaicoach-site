import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { WaitlistCTA } from '@/components/waitlist-cta'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative flex items-start justify-center overflow-hidden pt-16 sm:pt-20">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(158_60%_40%/0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(30_20%_85%/0.5),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-10 pt-8 text-center sm:pt-10 md:pt-14">
        <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          Your AI Stack, Curated and Ready
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/75 md:text-xl">
          Pre-configured AI skills, daily briefings, and starter kits —{' '}
          <br className="hidden sm:inline" />
          built by someone who runs this stack every day, packaged so you
          don&apos;t have to set it up yourself.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <WaitlistCTA source="hero" />
        </div>

        <div className="mt-6 flex items-center justify-center">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Link href="/resources">
              Browse Free Resources
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
