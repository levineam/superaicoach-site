import Link from "next/link";
import { MapPin } from "lucide-react";

import { ConsultationCTA } from "@/components/consultation-cta";
import { HeroChat } from "@/components/hero-chat";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28 md:pt-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 md:grid-cols-5 md:pb-28">
        <div className="md:col-span-3">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            1:1 virtual coaching · Ships anywhere
          </p>

          <h1 className="mt-6 text-balance font-[family-name:var(--font-inter-tight)] text-5xl font-semibold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-6xl md:text-[5.25rem]">
            Personal AI{" "}
            <span className="font-display italic font-normal text-primary">
              coaching,
            </span>{" "}
            built around your work.
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Automate the tedious. Amplify the meaningful. Practical AI coaching
            that gives you back time for what actually matters.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <ConsultationCTA source="hero" label="Book a Call" />
            <Link
              href="/#use-cases"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-background px-6 text-base font-medium text-foreground transition-colors hover:bg-secondary"
            >
              See what&apos;s possible
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <a
              href="/philadelphia"
              className="underline underline-offset-4 transition-colors hover:text-foreground"
            >
              In Philadelphia? See in-person options
            </a>
          </div>
        </div>

        <div className="md:col-span-2">
          <HeroChat />
        </div>
      </div>
    </section>
  );
}
