import type { Metadata } from 'next'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ConsultationCTA } from '@/components/consultation-cta'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://superaicoach.com'

export const metadata: Metadata = {
  title: 'AI Productivity Resources | SuperAIcoach',
  description:
    'Free guides and tutorials on using ChatGPT, Claude, and AI tools for productivity. Learn practical AI workflows for writing, research, automation, and business tasks.',
  keywords: 'AI productivity guides, ChatGPT tutorials, Claude tutorials, AI automation guides, AI productivity tips, ChatGPT for business',
  alternates: {
    canonical: '/resources',
  },
  openGraph: {
    title: 'AI Productivity Resources | SuperAIcoach',
    description: 'Free guides and tutorials on using ChatGPT, Claude, and AI tools for productivity.',
    url: `${baseUrl}/resources`,
    type: 'website',
  },
}

const resources = [
  {
    title: 'Getting Started with ChatGPT for Professional Writing',
    description: 'Learn the fundamentals of using ChatGPT to draft emails, reports, and proposals that sound professional and save you time.',
    href: '/resources/chatgpt-professional-writing',
    category: 'ChatGPT',
    readTime: '8 min read',
  },
  {
    title: 'AI Workflow for Freelancers: What to Automate First',
    description: 'Start with proposals, client emails, and meeting prep to get fast AI ROI without overcomplicating your business.',
    href: '/resources/ai-workflow-for-freelancers',
    category: 'Freelancers',
    readTime: '7 min read',
  },
  {
    title: 'Personal AI Assistant Setup: How to Make AI Actually Work for You',
    description: 'Set up AI with a context brief, lightweight memory, and a few reusable workflows so it behaves more like an assistant than a blank tool.',
    href: '/resources/personal-ai-assistant-setup',
    category: 'Setup',
    readTime: '8 min read',
  },
]

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md">
            Free Resources
          </div>

          <h1 className="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            AI Productivity <span className="text-accent">Resources</span>
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Free guides and tutorials to help you get more value from ChatGPT, Claude, and other AI tools.
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
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                    {resource.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {resource.readTime}
                  </span>
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-accent">
                  {resource.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {resource.description}
                </p>
              </a>
            ))}
          </div>

          {resources.length === 1 && (
            <div className="mt-8 rounded-2xl border border-border/60 bg-card/20 p-8 text-center backdrop-blur-xl">
              <p className="text-muted-foreground">
                More resources coming soon! Get notified when we publish new guides.
              </p>
              <div className="mt-4">
                <ConsultationCTA
                  source="resources-page"
                  label="Book a Call"
                  buttonClassName="border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                  containerClassName="justify-center"
                />
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}