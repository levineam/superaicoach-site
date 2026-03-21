import type { Metadata } from 'next'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://superaicoach.com'

export const metadata: Metadata = {
  title: 'Weekly AI Resources Roundup #1 | SuperAIcoach',
  description:
    'A weekly roundup of practical AI ideas, tools, and patterns worth paying attention to without spending your whole week scrolling.',
  keywords: 'weekly AI roundup, curated AI links, AI resources newsletter, practical AI ideas',
  alternates: {
    canonical: '/resources/weekly-ai-resources-roundup-1',
  },
  openGraph: {
    title: 'Weekly AI Resources Roundup #1',
    description: 'Five practical AI ideas, tools, and patterns worth paying attention to this week.',
    url: `${baseUrl}/resources/weekly-ai-resources-roundup-1`,
    type: 'article',
  },
  authors: [{ name: 'Andrew Levine' }],
}

const picks = [
  {
    title: 'Prompt libraries are finally growing up',
    takeaway:
      'The best prompt libraries are shifting away from giant dump files and toward compact, situational playbooks you can actually reuse.',
    whyItMatters:
      'People do not need more prompts. They need better defaults. Anything that turns prompting into a repeatable system is worth watching.',
  },
  {
    title: 'Small automations keep beating ambitious ones',
    takeaway:
      'The most durable wins still come from narrow automations that remove one annoying step from a real workflow.',
    whyItMatters:
      'This is a good weekly reminder that useful AI does not have to look futuristic. It just has to save time without creating cleanup work.',
  },
  {
    title: 'Research assistants are becoming judgment amplifiers',
    takeaway:
      'The strongest research workflows now combine source gathering, synthesis, and recommendation in one pass.',
    whyItMatters:
      'This is where AI starts to feel genuinely helpful: not replacing your judgment, but making it easier to reach one faster.',
  },
  {
    title: 'Voice interfaces are getting more practical',
    takeaway:
      'Hands-free capture and spoken drafting are becoming good enough for quick notes, planning, and daily admin.',
    whyItMatters:
      'When voice works, it lowers the friction to using AI throughout the day instead of only when you sit down for a dedicated session.',
  },
  {
    title: 'Curation is starting to matter more than discovery',
    takeaway:
      'The problem is no longer finding AI news. It is separating useful signal from the daily flood of demos, launches, and recycled takes.',
    whyItMatters:
      'This is the whole case for a strong weekly roundup. Busy people need someone to do the sorting, not just point at the firehose.',
  },
]

export default function WeeklyRoundupPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pb-20 pt-28">
        <article>
          <header className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md">
              Weekly roundup • 6 min read
            </div>

            <h1 className="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              Weekly AI Resources Roundup #1
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Five practical ideas from the week, distilled into what matters, why it matters, and what to test next.
            </p>
          </header>

          <div className="prose prose-gray mx-auto mt-12 max-w-none dark:prose-invert">
            <p>
              AI moves fast enough that “keeping up” becomes its own part-time job. The point of this roundup is to remove that burden. Each week, we pull out the few ideas that seem genuinely useful for real work and ignore the rest.
            </p>

            {picks.map((pick) => (
              <section key={pick.title}>
                <h2>{pick.title}</h2>
                <p>{pick.takeaway}</p>
                <p>
                  <strong>Why it matters:</strong> {pick.whyItMatters}
                </p>
              </section>
            ))}

            <h2>What to try this week</h2>
            <p>
              Pick one repeated task you did this week and ask: could AI help me do the first draft, first pass, or first sort? That is still the cleanest way to find a real win without getting lost in experimentation for its own sake.
            </p>
          </div>

          <div className="mt-16 rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-foreground">More curated resources</h3>
            <p className="mt-2 text-muted-foreground">
              The weekly roundup sits alongside evergreen guides in the SuperAIcoach resource library, so readers can get both timely signal and durable how-to material.
            </p>
            <div className="mt-4">
              <a
                href="/resources"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                See all resources
              </a>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
