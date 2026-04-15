import { MapPin } from "lucide-react";

import { ConsultationCTA } from "@/components/consultation-cta";

export function Hero() {
  return (
    <section className="relative flex items-start justify-center overflow-hidden pt-16 sm:pt-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(18_12%_8%/0.12),transparent_48%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(24_10%_32%/0.10),transparent_42%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-14 pt-10 text-center sm:pt-12 md:pt-16">
        <p className="mx-auto inline-flex rounded-full border border-border/80 bg-background/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground shadow-sm backdrop-blur">
          Practical AI, designed for real work
        </p>

        <h1 className="mx-auto mt-8 max-w-5xl text-balance font-display text-5xl leading-[0.95] tracking-[-0.04em] text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          Personal AI{' '}
          <span className="block italic text-accent sm:inline">coaching</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/72 md:text-xl">
          Automate the tedious. Amplify the meaningful.
          <br className="hidden sm:inline" /> Practical AI coaching that gives
          you back time for what actually matters.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <ConsultationCTA source="hero" />
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-foreground/60">
          <MapPin className="h-4 w-4" />
          <a
            href="/philly"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            In Philadelphia? See in-person options
          </a>
        </div>
      </div>
    </section>
  );
}
