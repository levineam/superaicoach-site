import type { Metadata } from "next"
import Link from "next/link"
import {
  Shield,
  Users,
  BarChart3,
  Target,
  Eye,
  Zap,
  CheckCircle,
} from "lucide-react"

import { ConsultationCTA } from "@/components/consultation-cta"
import { ScrollReveal } from "@/components/scroll-reveal"
import { isMissionControlArchived } from "@/lib/mission-control/archive"

export const metadata: Metadata = {
  title: "For Businesses — Super AI Coach",
  description:
    "Help your employees become superhuman with AI. Assessment, coaching, and visibility for leadership. Start with a free 30-day pilot.",
  openGraph: {
    title: "For Businesses — Super AI Coach",
    description:
      "Help your employees become superhuman with AI. Assessment, coaching, and visibility for leadership.",
  },
}

export default function BusinessPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background">

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-32 md:py-48 overflow-hidden">
        {/* Background pattern — same as main site hero */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(158_60%_40%/0.06),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(30_20%_85%/0.5),transparent_60%)]" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent mb-8">
              For Businesses
            </div>
          </ScrollReveal>
          <ScrollReveal delayMs={80}>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-balance text-foreground">
              Your Employees Are About to Become{" "}
              <span className="text-accent">Superhuman</span> — or Obsolete
            </h1>
          </ScrollReveal>
          <ScrollReveal delayMs={160}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
              The companies that figure out AI adoption first will own the next decade.{" "}
              <span className="text-foreground font-medium">Super AI Coach</span> helps you figure it out.
            </p>
          </ScrollReveal>
          <ScrollReveal delayMs={240}>
            <a
              href="#pilot"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold transition-colors bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20"
            >
              Start a Free 30-Day Pilot
            </a>
          </ScrollReveal>

          {/* Glass stats panel — same as main hero */}
          <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border/50 bg-card/40 p-8 backdrop-blur-xl md:p-12">
            <div className="grid gap-6 text-left sm:grid-cols-3">
              {[
                { metric: "30 days", label: "free pilot — zero commitment" },
                { metric: "100%", label: "personalized per employee" },
                { metric: "Free", label: "early-partner consultation" },
              ].map((item) => (
                <div key={item.metric} className="text-center">
                  <p className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {item.metric}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="px-6 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent text-center mb-3">
              The Problem
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-balance text-foreground">
              You Have Two Types of Employee Right Now
            </h2>
          </ScrollReveal>
          <ScrollReveal delayMs={80}>
            <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
              And neither group is where you need them.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <ScrollReveal delayMs={120}>
              <div className="rounded-2xl border border-red-200 bg-red-50 p-8 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-sm">A</span>
                  <span className="font-semibold text-red-800">Group A</span>
                </div>
                <p className="text-red-900 text-lg leading-relaxed">
                  Not using AI. Falling behind fast. Probably doesn&apos;t know it.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delayMs={200}>
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-8 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-700 font-bold text-sm">B</span>
                  <span className="font-semibold text-yellow-800">Group B</span>
                </div>
                <p className="text-yellow-900 text-lg leading-relaxed">
                  Using AI — but to do the same work with a tenth of the effort. Coasting instead of growing.
                </p>
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal delayMs={280}>
            <p className="text-center text-lg font-medium max-w-3xl mx-auto leading-relaxed text-foreground">
              Neither group is where you need them. But Group B is{" "}
              <span className="text-accent font-semibold">one conversation away</span>{" "}
              from becoming your biggest competitive weapon.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── THE BLIND SPOT ── */}
      <section className="px-6 py-24 md:py-32 bg-card">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent mx-auto mb-6">
              <Eye className="h-7 w-7" />
            </div>
          </ScrollReveal>
          <ScrollReveal delayMs={80}>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-balance text-foreground">
              Do You Know Which Is Which?
            </h2>
          </ScrollReveal>
          <ScrollReveal delayMs={160}>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Pretending to use AI. Reluctantly using AI. Using AI to coast. Genuinely leaning in.{" "}
              <span className="text-foreground font-medium">From the outside, they all look the same.</span>
            </p>
          </ScrollReveal>
          <ScrollReveal delayMs={240}>
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8">
              <p className="text-foreground text-xl font-semibold leading-relaxed">
                You&apos;re making investment decisions about your people without this information.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── WHAT WE DO ── */}
      <section className="px-6 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent text-center mb-3">
              What We Do
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-balance text-foreground">
              We Give You Visibility — Then We Close the Gap
            </h2>
          </ScrollReveal>
          <ScrollReveal delayMs={80}>
            <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto">
              Real answers for leadership. Real change for each employee.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal delayMs={120}>
              <div className="group rounded-2xl border border-border/60 bg-card/60 p-8 h-full backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 motion-reduce:hover:translate-y-0">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">For Leadership</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Real insight into who&apos;s adopting, who&apos;s not, and what to do about it.{" "}
                  <span className="font-medium text-foreground">Not surveys. Not guesswork.</span>
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delayMs={200}>
              <div className="group rounded-2xl border border-border/60 bg-card/60 p-8 h-full backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 motion-reduce:hover:translate-y-0">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">For Each Employee</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Personalized coaching, tool selection, and accountability — customized because{" "}
                  <span className="font-medium text-foreground">
                    every person and every role is different.
                  </span>
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── MISSION CONTROL ── */}
      <section className="px-6 py-24 md:py-32 bg-card">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent mx-auto mb-6">
              <Target className="h-7 w-7" />
            </div>
          </ScrollReveal>
          <ScrollReveal delayMs={80}>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-balance text-foreground">
              We&apos;re Building Mission Control
            </h2>
          </ScrollReveal>
          <ScrollReveal delayMs={160}>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Mission Control is the system we&apos;re developing to make AI adoption{" "}
              <span className="text-foreground font-medium">trackable, measurable, and persistent</span>{" "}
              across your organization. It&apos;s where leadership sees the dashboard. Where each
              employee&apos;s roadmap lives. Where intelligence accumulates instead of disappearing
              after a meeting.
            </p>
          </ScrollReveal>
          <ScrollReveal delayMs={240}>
            <div className="rounded-2xl border border-border bg-background p-8 text-left">
              <p className="text-muted-foreground leading-relaxed">
                It&apos;s still being built — and that&apos;s by design. Early partners shape what
                it becomes. Your feedback doesn&apos;t just improve the product —{" "}
                <span className="text-accent font-semibold">it defines it.</span>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent text-center mb-3">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-balance text-foreground">
              Both Sides of the House. Monthly. Measurable.
            </h2>
          </ScrollReveal>
          <ScrollReveal delayMs={80}>
            <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto">
              A consistent rhythm that builds real momentum.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: CheckCircle,
                title: "Assessment",
                body: "Hands-on evaluation of each employee's AI readiness and adoption",
                delay: 80,
              },
              {
                icon: Zap,
                title: "Coaching",
                body: "Personalized roadmaps, tool selection, and ongoing accountability",
                delay: 160,
              },
              {
                icon: BarChart3,
                title: "Reporting",
                body: "Clear metrics for leadership. No guessing who's progressing.",
                delay: 240,
              },
            ].map(({ icon: Icon, title, body, delay }) => (
              <ScrollReveal key={title} delayMs={delay}>
                <div className="group rounded-2xl border border-border/60 bg-card/60 p-8 text-center h-full backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 motion-reduce:hover:translate-y-0">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent mx-auto">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-foreground">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY SUPER AI COACH ── */}
      <section className="px-6 py-24 md:py-32 bg-card">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent mx-auto mb-6">
              <Zap className="h-7 w-7" />
            </div>
          </ScrollReveal>
          <ScrollReveal delayMs={80}>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-balance text-foreground">
              We Don&apos;t Teach AI Theory. We Use It.
            </h2>
          </ScrollReveal>
          <ScrollReveal delayMs={160}>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Super AI Coach runs AI systems that manage real business operations every day —
              email triage, client prep, research, scheduling, content creation. We teach what we
              use, what works, and what&apos;s changing right now.{" "}
              <span className="font-medium text-foreground">
                The tools move weekly. Keeping up is a full-time job. It&apos;s ours.
              </span>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA / PILOT ── */}
      <section id="pilot" className="px-6 py-24 md:py-32">
        {/* Background pattern — matches main site final CTA */}
        <div className="relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(158_60%_40%/0.05),transparent_70%)]" />
          </div>
        </div>
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance text-foreground">
            Start with One Team. Find Out What You&apos;ve Got.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-4 max-w-xl mx-auto">
            One team. 30 days. Free. You&apos;ll know who&apos;s genuinely adopting, who&apos;s
            coasting, and who needs a different conversation.{" "}
            <span className="text-foreground font-medium">
              That intelligence alone is worth more than the cost.
            </span>
          </p>
        </ScrollReveal>
        <ScrollReveal delayMs={80} className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-border bg-card p-6 mb-10 mx-auto mt-8">
            <p className="text-muted-foreground leading-relaxed text-sm text-center">
              We&apos;re in the early stages of building this — which means early partners work
              with us for free and help shape what this becomes.{" "}
              <span className="text-accent font-semibold">
                Everything we create for you is yours to keep.
              </span>
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delayMs={160} className="flex flex-col items-center gap-4">
          <ConsultationCTA
            source="business-page"
            label="Book a Free Consultation"
          />
          {!isMissionControlArchived() ? (
            <Link
              href="/mission-control"
              className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-8 py-4 text-base font-semibold text-accent transition-all hover:bg-accent/10 hover:border-accent/60"
            >
              Meet Jarvis →
            </Link>
          ) : null}
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
          <Link href="/" className="hover:text-foreground transition-colors underline underline-offset-2">
            Back to Home
          </Link>
        </p>
      </footer>
    </main>
  )
}
