import type { Metadata } from "next"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Privacy information for SuperAIcoach personal AI coaching (what we collect, what you share, and how to stay anonymous).",
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md">
            Privacy
          </div>

          <h1 className="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            Privacy-first coaching
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            You&apos;re always in control of what you share. We can work with anonymized examples and high-level descriptions.
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            Questions before booking? Email{" "}
            <a
              className="underline underline-offset-4 hover:text-foreground"
              href="mailto:hello@superaicoach.com"
            >
              hello@superaicoach.com
            </a>
            .
          </p>
        </div>

        <section className="mt-16">
          <ScrollReveal delayMs={60} className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-xl">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              What we collect
            </h2>
            <p className="mt-2 text-muted-foreground">
              If you book a consult through our scheduling provider, you&apos;ll provide basic contact details needed to schedule the call.
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Contact info you submit for scheduling</li>
              <li>Optional notes you choose to share when booking</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-xl">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              What you should (and shouldn&apos;t) share
            </h2>
            <p className="mt-2 text-muted-foreground">
              When in doubt: remove names, client identifiers, and sensitive data. The coaching works even with redacted examples.
            </p>
            <div className="mt-4 grid gap-4">
              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <p className="font-medium text-foreground">Good to share</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  General goals, constraints, anonymized samples, and the parts of your workflow you want to improve.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <p className="font-medium text-foreground">Avoid sharing</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Passwords, secret keys, regulated data, or anything you&apos;re not comfortable discussing.
                </p>
              </div>
            </div>
          </div>
          </ScrollReveal>
        </section>

        <section className="mt-10">
          <ScrollReveal delayMs={80}>
            <div className="rounded-2xl border border-border/60 bg-card/40 p-6 text-sm text-muted-foreground backdrop-blur-xl">
              This page is informational and may be updated as the service evolves.
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </>
  )
}
