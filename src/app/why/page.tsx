import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import {
  Shield,
  Users,
  HeartPulse,
  Code2,
  BarChart3,
} from "lucide-react"
import { Tweet } from "react-tweet"

import { Navbar } from "@/components/navbar"
import { ConsultationCTA } from "@/components/consultation-cta"
import { ScrollReveal } from "@/components/scroll-reveal"

export const metadata: Metadata = {
  title: "Why AI Coaching — Super AI Coach",
  description:
    "The case for moving now on AI. Evidence, data, and a straight conversation about what's possible.",
  openGraph: {
    title: "Why AI Coaching — Super AI Coach",
    description:
      "The case for moving now on AI. Evidence, data, and a straight conversation about what's possible.",
  },
}

export default function WhyPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen bg-background">

        {/* ── 1. THE OPPORTUNITY (opener) ── */}
        <section className="px-6 pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <ScrollReveal>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-foreground text-balance">
                    This is an incredible opportunity.
                  </h1>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    The biggest labs on earth just handed you a set of tools that would have
                    been unimaginable five years ago. The only question is whether you pick them up.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delayMs={120}>
                <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8">
                  <p className="text-foreground text-xl font-semibold leading-relaxed mb-4">
                    This technology is powerful, cheap, and maximally accessible.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    You don&apos;t need an engineering team or a Silicon Valley budget. You need
                    to know where to start — and someone to build the habits with you.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── 2. SIGNAL IN THE NOISE ── */}
        <section className="px-6 py-24 md:py-32 bg-card">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-balance text-foreground">
                Most people will use AI to produce more of the same. You don&apos;t have to.
              </h2>
            </ScrollReveal>
            <ScrollReveal delayMs={80}>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto mb-10">
                AI makes it trivially easy to produce average — same emails, same reports, same
                strategies at scale. That creates a wide-open lane for the people who use it
                thoughtfully. When everything sounds alike, the signal that cuts through is trust.
                That&apos;s yours to build.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ── 3. TRUST PREMIUM ── */}
        <section className="px-6 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance text-foreground">
                Your expertise becomes your superpower.
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScrollReveal delayMs={80}>
                <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-8 h-full">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-600 mb-4">
                    <Shield className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">Your moat</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Your expertise, your judgment, your relationships. AI amplifies the human at
                    the center. It doesn&apos;t replace the person who earns the trust — it
                    gives them more leverage than ever before.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delayMs={160}>
                <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-8 h-full">
                  <h3 className="text-xl font-bold mb-3 text-foreground">The opportunity</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The people who figure out how to pair deep domain knowledge with AI capability
                    will do more in a day than entire teams used to. That edge compounds fast —
                    and it&apos;s available right now.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── 4. COMPETITION ── */}
        <section className="px-6 py-24 md:py-32 bg-card">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-balance text-foreground">
                The world&apos;s best AI labs are building for you.
              </h2>
            </ScrollReveal>
            <ScrollReveal delayMs={60}>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto text-lg">
                The biggest companies on earth are in a full-sprint arms race to build you
                superhuman tools. Costs are falling. Capabilities are exploding. And you can
                take advantage of it right now.
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  name: "Google AI",
                  desc: "Gemini, DeepMind. A trillion-dollar company treating AI as its most important bet.",
                  delay: 80,
                },
                {
                  name: "Anthropic",
                  desc: "Claude. Safety-focused and frontier-pushing. Backed by billions.",
                  delay: 140,
                },
                {
                  name: "OpenAI",
                  desc: "The company that started the race — still running hard.",
                  delay: 200,
                },
                {
                  name: "Open Source",
                  desc: "DeepSeek, Qwen. Matching frontier quality at near-zero cost.",
                  delay: 260,
                },
              ].map(({ name, desc, delay }) => (
                <ScrollReveal key={name} delayMs={delay}>
                  <div className="rounded-2xl border border-border/60 bg-background p-6 h-full transition-all duration-500 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
                    <h3 className="text-base font-bold mb-2 text-foreground">{name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. EVIDENCE — Cardiologist ── */}
        <section className="px-6 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-balance text-foreground">
                Domain experts are already winning — without writing a single line of code.
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <ScrollReveal delayMs={80}>
                <div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-6">
                    <HeartPulse className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Dr. Michał Nedoszytko
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    A cardiologist in Poland. Not in Silicon Valley, not at a tech company, no
                    engineering team. He built an AI clinical workflow that analyzes patient data
                    and drafts referral letters.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    He placed 3rd out of 13,000 applicants at Anthropic&apos;s Build hackathon.
                    His edge wasn&apos;t technical skill. It was knowing what patients actually need.
                    That&apos;s a skill you already have in your field.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delayMs={160}>
                {/* Native X/Twitter embed — @trajektoriePL Feb 20, 2026 */}
                <div data-theme="dark" className="flex justify-center">
                  <Suspense fallback={
                    <div className="rounded-2xl border border-border/60 bg-card/60 p-8 w-full animate-pulse">
                      <div className="h-4 bg-accent/10 rounded mb-4 w-3/4" />
                      <div className="h-4 bg-accent/10 rounded mb-2 w-full" />
                      <div className="h-4 bg-accent/10 rounded w-2/3" />
                    </div>
                  }>
                    <Tweet id="2024774752116658539" />
                  </Suspense>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── 6. EVIDENCE — Bespoke Software ── */}
        <section className="px-6 py-24 md:py-32 bg-card">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-balance text-foreground">
                Software is becoming as fluid as a conversation.
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <ScrollReveal delayMs={80}>
                {/* X Post embed placeholder — @karpathy Feb 19, 2026 */}
                <div className="rounded-2xl border border-border/60 bg-background p-8 transition-all duration-700 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-0.5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">AK</div>
                    <div>
                      <p className="text-foreground font-semibold text-sm">Andrej Karpathy</p>
                      <p className="text-muted-foreground text-xs">@karpathy · Feb 19, 2026</p>
                    </div>
                  </div>
                  <p className="text-foreground leading-relaxed mb-3">
                    &ldquo;The hottest new programming language is English.&rdquo;
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Former Director of AI at Tesla, co-founder of OpenAI · 1.65M impressions
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delayMs={160}>
                <div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-6">
                    <Code2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Custom tools for your workflow
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Tools that would have cost $50,000 and six months are now built in an afternoon
                    by someone who can describe what they need.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    You digitized your business with the internet. With AI, you automate it. Those
                    aren&apos;t the same thing — and the second wave is just getting started.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── 7. EVIDENCE — Early Window ── */}
        <section className="px-6 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-balance text-foreground">
                The window is open right now.
              </h2>
            </ScrollReveal>
            <ScrollReveal delayMs={60}>
              <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto text-lg">
                The industries where judgment and relationships matter most are barely touched.
                The people moving now are building advantages that compound.
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  stat: "4%",
                  label: "Finance",
                  desc: "Current AI agent deployment. The other 96% is still opportunity.",
                  delay: 80,
                },
                {
                  stat: "0.9%",
                  label: "Legal",
                  desc: "Less than one percent. The entire profession is still at the door.",
                  delay: 160,
                },
                {
                  stat: "Now",
                  label: "Your window",
                  desc: "First movers are building advantages that compound. The time to start is before it&apos;s obvious.",
                  delay: 240,
                },
              ].map(({ stat, label, desc, delay }) => (
                <ScrollReveal key={label} delayMs={delay}>
                  <div className="rounded-2xl border border-border/60 bg-card/60 p-8 text-center h-full backdrop-blur-sm">
                    <p className="text-5xl font-bold text-accent mb-3">{stat}</p>
                    <p className="text-foreground font-semibold mb-2">{label}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* David Blundin tweet — the narrow window of frontier access */}
            <ScrollReveal delayMs={200}>
              <div className="mb-10">
                <div data-theme="dark" className="flex justify-center">
                  <Suspense fallback={
                    <div className="rounded-2xl border border-border/60 bg-card/60 p-8 w-full max-w-xl animate-pulse">
                      <div className="h-4 bg-accent/10 rounded mb-4 w-3/4" />
                      <div className="h-4 bg-accent/10 rounded mb-2 w-full" />
                      <div className="h-4 bg-accent/10 rounded w-2/3" />
                    </div>
                  }>
                    <Tweet id="2026432044901789908" />
                  </Suspense>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={320}>
              <div className="rounded-2xl border border-border bg-card p-8">
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent shrink-0 mt-1">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Adoption is low because guidance is scarce, not because the tools are
                    expensive. They&apos;re free or nearly free. The gap is knowing where to
                    start and how to build AI into actual work. That&apos;s what we do.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── 8. MEANING INVERSION ── */}
        <section className="relative flex flex-col items-center justify-center min-h-[70vh] bg-[hsl(220_20%_7%)] text-center px-6 py-24 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,hsl(158_60%_30%/0.12),transparent_70%)]" />
          </div>
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-4xl md:text-6xl font-bold leading-tight text-white text-balance mb-4">
                We don&apos;t automate your best work.
              </h2>
            </ScrollReveal>
            <ScrollReveal delayMs={120}>
              <h2 className="text-4xl md:text-6xl font-bold leading-tight text-[hsl(158_60%_55%)] text-balance mb-10">
                We eliminate everything in its way.
              </h2>
            </ScrollReveal>
            <ScrollReveal delayMs={240}>
              <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
                The admin, the repetition, the hours lost to work that doesn&apos;t need you.
                Your judgment, your relationships, your reputation — those stay yours.
                Everything else becomes optional.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ── 9. OFFER ── */}
        <section className="px-6 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance text-foreground">
                What we offer
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScrollReveal delayMs={80}>
                <div className="rounded-2xl border border-border/60 bg-card/60 p-8 h-full backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Shield className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">For leadership</h3>
                  <ul className="space-y-3 text-muted-foreground text-sm leading-relaxed">
                    {[
                      "AI adoption assessment across your team",
                      "Custom strategy for your industry and workflows",
                      "Team coaching and accountability",
                      "Visibility into who's progressing and who's not",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
              <ScrollReveal delayMs={160}>
                <div className="rounded-2xl border border-border/60 bg-card/60 p-8 h-full backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">For individuals</h3>
                  <ul className="space-y-3 text-muted-foreground text-sm leading-relaxed">
                    {[
                      "1:1 coaching tailored to your role",
                      "Tool selection that fits your actual work",
                      "Practical workflows you use immediately",
                      "Ongoing check-ins so it sticks",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── 10. CTA ── */}
        <section className="px-6 py-24 md:py-40 bg-card">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance text-foreground">
              The window is open.{" "}
              <span className="text-accent">Let&apos;s build something with it.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              The best technology in history is available to you right now, at near-zero cost.
              We&apos;ll help you figure out exactly how to use it — and make it stick.
            </p>
          </ScrollReveal>
          <ScrollReveal delayMs={80} className="flex flex-col items-center gap-4">
            <ConsultationCTA source="why-page" label="Free 15-minute call" />
            <p className="text-sm text-muted-foreground">
              Or reach out at{" "}
              <a
                href="mailto:andrew@superaicoach.com"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                andrew@superaicoach.com
              </a>
            </p>
          </ScrollReveal>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-border bg-card text-muted-foreground px-6 py-8 text-center text-sm">
          <p>
            &copy; 2026 Super AI Coach &mdash;{" "}
            <Link
              href="/"
              className="hover:text-foreground transition-colors underline underline-offset-2"
            >
              Back to home
            </Link>
          </p>
        </footer>
      </main>
    </>
  )
}
