import type { Metadata } from 'next'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://superaicoach.com'

export const metadata: Metadata = {
  title: 'Curated AI Resources | SuperAIcoach',
  description:
    'A curated library of practical AI guides, workflow breakdowns, and weekly roundups for busy professionals who want useful signal instead of hype.',
  keywords: 'curated AI resources, AI workflow guides, weekly AI roundup, ChatGPT productivity, Claude workflow guides, AI membership resources',
  alternates: {
    canonical: '/resources',
  },
  openGraph: {
    title: 'Curated AI Resources | SuperAIcoach',
    description: 'A curated library of practical AI guides, workflow breakdowns, and weekly roundups.',
    url: `${baseUrl}/resources`,
    type: 'website',
  },
}

const resources = [
  {
    title: 'Getting Started with ChatGPT for Professional Writing',
    description:
      'Learn the fundamentals of using ChatGPT to draft emails, reports, and proposals that sound professional and save you time.',
    href: '/resources/chatgpt-professional-writing',
    category: 'Guide',
    readTime: '8 min read',
  },
  {
    title: 'A Claude Research Workflow That Prevents Rabbit Holes',
    description:
      'A simple workflow for using Claude to scope a topic, extract what matters, and leave with notes you can actually use.',
    href: '/resources/claude-research-workflow',
    category: 'Guide',
    readTime: '7 min read',
  },
  {
    title: 'Weekly AI Resources Roundup #1',
    description:
      'Five practical ideas from the week, distilled into what matters, why it matters, and what to try next.',
    href: '/resources/weekly-ai-resources-roundup-1',
    category: 'Weekly roundup',
    readTime: '6 min read',
  },
]

const cadence = [
  {
    title: 'Daily newsletter',
    description:
      'Short daily notes that capture the most useful AI links, experiments, and patterns worth paying attention to.',
  },
  {
    title: 'One new resource article each week',
    description:
      'Every week we publish one evergreen guide that turns a useful AI workflow into something concrete and repeatable.',
  },
  {
    title: 'Published weekly roundup',
    description:
      'At the end of the week, the best ideas from the daily newsletter are turned into a clean roundup for readers who want the signal without the scroll.',
  },
]

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md">
            Curated Resources
          </div>

          <h1 className="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            The <span className="text-accent">resource library</span> for practical AI work
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            This is the public reading room for SuperAIcoach&apos;s curated AI resources membership: practical guides,
            workflow breakdowns, and weekly roundups for people who want useful signal instead of endless noise.
          </p>
        </div>

        <section className="mt-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <a
                key={resource.href}
                href={resource.href}
                className="group rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl transition-colors hover:border-accent/50 hover:bg-card/60"
              >
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                    {resource.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{resource.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-accent">
                  {resource.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{resource.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-border/60 bg-card/30 p-8 backdrop-blur-xl md:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">Publishing cadence</p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              A simple weekly rhythm
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              The point of the membership is consistent, high-signal curation. Here is the publishing rhythm readers can expect.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {cadence.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/60 bg-background/70 p-5">
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
