import type { Metadata } from 'next'
import Link from 'next/link'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ConsultationCTA } from '@/components/consultation-cta'
import { FAQStructuredData } from '@/components/structured-data'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://superaicoach.com'

const faqItems = [
  {
    question: 'How often do I need to update my context brief?',
    answer:
      'Weekly is enough for most people. If your focus shifts significantly, update it. If you start a new project, add it. The brief should reflect your current reality, not two weeks ago.',
  },
  {
    question: 'How long does it take to set up a personal AI assistant?',
    answer:
      'A useful first setup usually takes about 30 minutes. You do not need a complex system. You need a short context brief, a place to keep active projects, and a repeatable way to reuse both.',
  },
  {
    question: 'What makes AI feel like an assistant instead of a search engine?',
    answer:
      'Context. When the AI knows your role, priorities, communication style, active projects, and constraints, it can respond like a working assistant instead of a blank tool that starts over every session.',
  },
]

export const metadata: Metadata = {
  title: 'Personal AI Assistant Setup: How to Make AI Actually Work for You | SuperAIcoach',
  description:
    "Most people use AI like a search engine. Here's how to set it up like a real assistant, one that knows your context, your work, and how you think.",
  keywords:
    'personal AI assistant setup, how to set up an AI assistant, personal AI for work, personal AI system, AI context brief',
  alternates: {
    canonical: '/resources/personal-ai-assistant-setup',
  },
  openGraph: {
    title: 'Personal AI Assistant Setup: How to Make AI Actually Work for You',
    description:
      "Most people use AI like a search engine. Here's how to set it up like a real assistant, one that knows your context, your work, and how you think.",
    url: `${baseUrl}/resources/personal-ai-assistant-setup`,
    type: 'article',
  },
  authors: [{ name: 'Andrew Levine' }],
}

export default function PersonalAIAssistantSetupPage() {
  return (
    <>
      <FAQStructuredData faqs={faqItems} />
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pb-20 pt-28">
        <article>
          <header className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md">
              Setup Guide • 8 min read
            </div>

            <h1 className="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              Personal AI Assistant Setup: How to Make AI Actually Work for You
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Most people use AI like a smarter search box. A real assistant works differently. It knows your context, your priorities, and how you like to work.
            </p>
          </header>

          <div className="prose prose-gray mx-auto mt-12 max-w-none dark:prose-invert">
            <p>
              Most people use ChatGPT or Claude like a smarter Google. They type a question, get an answer, and close the tab.
            </p>

            <p>
              That&apos;s not how an assistant works.
            </p>

            <p>
              An assistant knows who you are. It remembers your preferences. It knows what you&apos;re working on. It handles things in your style without you explaining yourself from scratch every time.
            </p>

            <p>
              This guide is about making the jump from AI as search engine to AI as actual assistant. The setup takes about 30 minutes. The payoff is months of working faster.
            </p>

            <h2>The Problem With How Most People Use AI</h2>

            <ol>
              <li>Open ChatGPT or Claude</li>
              <li>Describe the problem from scratch</li>
              <li>Get a generic response</li>
              <li>Tweak the prompt five times to get something useful</li>
              <li>Close the tab and start over next session</li>
            </ol>

            <p>
              The AI has no memory of what you talked about, what you tried, or what actually worked.
            </p>

            <p>
              This is not a limitation of the model. It&apos;s a setup problem. The AI is blank by default. You have to give it context. Most people never do.
            </p>

            <h2>What a Personal AI Assistant Actually Needs</h2>

            <p>To act like a real assistant, an AI needs four things.</p>

            <h3>1. Your role and focus</h3>
            <p>
              Who are you? What do you do? What matters right now?
            </p>
            <p>
              Example: <em>I&apos;m a freelance consultant. I work with mid-size companies on operations. My current focus is building recurring revenue.</em>
            </p>
            <p>
              Without this, every response is generic. With it, every response is relevant.
            </p>

            <h3>2. How you like to communicate</h3>
            <p>
              Do you want long explanations or bullet points? Pushback or just execution? Options or a recommendation?
            </p>
            <p>
              Example: <em>Give me direct answers. Don&apos;t soften things. I want the recommendation, not a list of equal options.</em>
            </p>
            <p>
              This is the difference between a useful AI and an annoying one.
            </p>

            <h3>3. Your current projects and priorities</h3>
            <p>
              What are you working on this week? What is blocked? What decisions are live?
            </p>
            <p>
              Example: <em>I&apos;m working on three active client projects. The top priority is the proposal for Client A, and that&apos;s due Friday.</em>
            </p>

            <h3>4. What you&apos;ve already tried</h3>
            <p>
              Nothing wastes more time than an AI suggesting the thing you already tested and rejected.
            </p>
            <p>
              Example: <em>I tried templates and they felt too stiff. I tried delegating this and it created more cleanup. I need something I can actually use myself.</em>
            </p>

            <h2>The Setup: Three Layers</h2>

            <h3>Layer 1: The Context Brief</h3>
            <p>
              Every conversation should start with a short context block you can paste in. It takes less than a minute. It changes everything.
            </p>

            <p>Create a plain text file with this structure:</p>
            <pre>
              <code>{`WHO I AM:
[Your name, role, what you do]

MY CURRENT FOCUS:
[Top 1-2 priorities this week or month]

HOW I LIKE TO WORK:
[Your communication preferences, formatting, whether you want pushback]

CURRENT PROJECTS:
[Active projects, status, deadlines, blockers]

WHAT I HAVE ALREADY TRIED:
[Relevant constraints, failed attempts, preferences]`}</code>
            </pre>

            <p>
              This is the core move. Most people skip it. Then they wonder why AI feels shallow.
            </p>

            <h3>Layer 2: A Simple Memory System</h3>
            <p>
              Your assistant gets better when it can refer back to decisions, projects, and recurring preferences. That does not require a giant knowledge base.
            </p>

            <p>
              Start with one note or document where you keep active projects, recent decisions, and reusable instructions. Think of it as working memory, not a life archive.
            </p>

            <h3>Layer 3: Reusable Workflows</h3>
            <p>
              Once the AI has context, build small repeatable workflows around your highest-friction tasks. Writing, planning, meeting prep, follow-ups, and research are good starting points.
            </p>

            <p>
              One client I worked with was rebuilding the same prompt every time she needed planning help. Once we turned that into a short context brief plus a reusable workflow, the quality improved immediately and the startup time disappeared.
            </p>

            <h2>How Often Do You Update the Brief?</h2>

            <p>
              Weekly is enough for most people. If your focus shifts significantly, update it. If you start a new project, add it. The brief should reflect your current reality, not two weeks ago.
            </p>

            <p>
              You are not trying to document your whole life. You are trying to keep the assistant pointed at what matters now.
            </p>

            <h2>Where Most Setups Go Wrong</h2>

            <ul>
              <li><strong>Too much detail.</strong> A useful brief is concise. If it becomes a manifesto, you will stop maintaining it.</li>
              <li><strong>No update habit.</strong> A stale brief is almost as bad as no brief.</li>
              <li><strong>Trying to automate everything at once.</strong> Start with one context file and one or two repeatable workflows.</li>
            </ul>

            <h2>Start Here</h2>

            <p>
              Open a note. Write your role, current focus, communication preferences, active projects, and constraints. Save it somewhere easy to reuse.
            </p>

            <p>
              Then test it on one real task this week.
            </p>

            <p>
              If you want examples of practical AI workflows after that, start with the <Link href="/resources">resources hub</Link>, then read <Link href="/resources/ai-workflow-for-freelancers">AI Workflow for Freelancers</Link> or <Link href="/resources/chatgpt-professional-writing">Getting Started with ChatGPT for Professional Writing</Link>.
            </p>
          </div>

          <div className="mt-16 rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-foreground">
              Want help setting up your own AI assistant?
            </h3>
            <p className="mt-2 text-muted-foreground">
              Bring one real workflow, one active project, or one recurring bottleneck. We&apos;ll turn it into a practical setup you can keep using after the call.
            </p>
            <div className="mt-4">
              <ConsultationCTA
                source="personal-ai-assistant-setup"
                label="Book a free 15-minute consult"
                buttonClassName="border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
              />
            </div>
          </div>

          <section className="mt-12 rounded-2xl border border-border/60 bg-card/20 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">FAQ</h2>
            <div className="mt-6 space-y-6">
              {faqItems.map((faq) => (
                <div key={faq.question}>
                  <h3 className="text-lg font-medium text-foreground">{faq.question}</h3>
                  <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 rounded-2xl border border-border/60 bg-card/20 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">About Andrew Levine</h2>
            <p className="mt-4 text-muted-foreground">
              Andrew Levine helps busy professionals set up AI tools that actually fit the way they work. His approach focuses on context, repeatable workflows, and practical implementation so clients stop starting from scratch and start getting real leverage from AI.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  )
}
