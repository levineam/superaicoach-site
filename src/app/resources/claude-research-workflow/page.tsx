import type { Metadata } from 'next'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://superaicoach.com'

export const metadata: Metadata = {
  title: 'A Claude Research Workflow That Prevents Rabbit Holes | SuperAIcoach',
  description:
    'Use this simple Claude workflow to scope a topic, extract what matters, and leave with notes you can actually use.',
  keywords: 'Claude research workflow, Claude notes workflow, AI research process, Claude productivity guide',
  alternates: {
    canonical: '/resources/claude-research-workflow',
  },
  openGraph: {
    title: 'A Claude Research Workflow That Prevents Rabbit Holes',
    description: 'Use this simple Claude workflow to scope a topic, extract what matters, and leave with notes you can actually use.',
    url: `${baseUrl}/resources/claude-research-workflow`,
    type: 'article',
  },
  authors: [{ name: 'Andrew Levine' }],
}

export default function ClaudeResearchWorkflowPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pb-20 pt-28">
        <article>
          <header className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md">
              Guide • 7 min read
            </div>

            <h1 className="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              A Claude Research Workflow That Prevents Rabbit Holes
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Use Claude to understand a topic faster without getting trapped in endless tabs, notes, and half-finished summaries.
            </p>
          </header>

          <div className="prose prose-gray mx-auto mt-12 max-w-none dark:prose-invert">
            <p>
              The biggest research problem is not access to information. It is volume. Most people can find ten articles in thirty seconds and still walk away with no usable conclusion. Claude is helpful here, but only if you use it as a thinking partner instead of a slot machine for summaries.
            </p>

            <h2>Start with a bounded question</h2>
            <p>
              Before you paste anything into Claude, define the question you actually need answered. “Tell me about AI agents” is too broad. “Help me understand whether AI agents are mature enough for customer support triage in a small business” is much better.
            </p>
            <p>
              The goal is not perfect scope. The goal is a research target small enough to finish.
            </p>

            <h2>Use a three-pass workflow</h2>

            <h3>1. Orientation</h3>
            <p>
              Ask Claude to explain the landscape in plain language. Have it define the major approaches, tradeoffs, and terms you need to know before you go deeper.
            </p>
            <blockquote>
              <p>
                “Give me a plain-English map of this topic. What are the main approaches, what matters most, and what should I ignore for now?”
              </p>
            </blockquote>

            <h3>2. Extraction</h3>
            <p>
              Feed Claude the sources you trust and ask it to pull out claims, evidence, disagreements, and open questions. This is where it becomes useful as a filter instead of a substitute for judgment.
            </p>
            <blockquote>
              <p>
                “Read these sources and extract the strongest claims, supporting evidence, and any places where experts disagree. Keep the output short and decision-relevant.”
              </p>
            </blockquote>

            <h3>3. Synthesis</h3>
            <p>
              Once Claude has the raw material, ask for a decision memo. Make it recommend a next step, not just a recap.
            </p>
            <blockquote>
              <p>
                “Based on this research, what would you recommend I do next, what are the main risks, and what would change your recommendation?”
              </p>
            </blockquote>

            <h2>What to save when you are done</h2>
            <p>
              The output you want is not a giant transcript. Save three things: a short summary, the best evidence, and one next action. If you cannot point to a concrete next action, the research session was probably too wide.
            </p>

            <h2>A simple rule for staying out of the weeds</h2>
            <p>
              If Claude keeps generating more branches than decisions, stop and restate the question. Research should narrow the field, not keep expanding it. Treat every new thread as guilty until it proves it matters.
            </p>

            <h2>Why this works</h2>
            <p>
              Claude is good at structure, comparison, and compression. It is less useful when you let it wander. A bounded question, a small source set, and a decision-focused final pass turns it into a strong research assistant instead of a very articulate distraction.
            </p>
          </div>

          <div className="mt-16 rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-foreground">Browse the full library</h3>
            <p className="mt-2 text-muted-foreground">
              This guide is part of a growing collection of practical AI resources and weekly roundups designed for busy people who want signal, not sprawl.
            </p>
            <div className="mt-4">
              <a
                href="/resources"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Explore the resource library
              </a>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
