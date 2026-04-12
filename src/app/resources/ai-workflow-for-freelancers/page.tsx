import type { Metadata } from 'next'
import Link from 'next/link'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ConsultationCTA } from '@/components/consultation-cta'
import { FAQStructuredData } from '@/components/structured-data'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://superaicoach.com'

const faqItems = [
  {
    question: 'What AI tools are best for freelancers?',
    answer:
      'Tools matter less than how you use them. Start with ChatGPT or Claude and apply them to proposals, client emails, and meeting prep before adding anything more complex.',
  },
  {
    question: 'How long does it take to set up an AI workflow?',
    answer:
      'One workflow usually takes 30 to 60 minutes to set up well. Most freelancers can see time savings on the same day if they start with a repeat task they already do every week.',
  },
  {
    question: 'Will AI replace freelancers?',
    answer:
      'AI will not replace strong freelancers overnight, but freelancers who use AI well will outcompete freelancers who do everything manually. The advantage comes from better speed, consistency, and prep.',
  },
]

export const metadata: Metadata = {
  title: 'AI Workflow for Freelancers: What to Automate First | SuperAIcoach',
  description:
    "Freelancers using AI wrong waste hours on setup. Here's the exact workflow to automate first, proposals, emails, and meeting prep, without the learning curve.",
  keywords:
    'AI workflow for freelancers, AI productivity tips for freelancers, ChatGPT for proposals, AI email prompts, AI meeting prep',
  alternates: {
    canonical: '/resources/ai-workflow-for-freelancers',
  },
  openGraph: {
    title: 'AI Workflow for Freelancers: What to Automate First',
    description:
      "Freelancers using AI wrong waste hours on setup. Here's the exact workflow to automate first, proposals, emails, and meeting prep, without the learning curve.",
    url: `${baseUrl}/resources/ai-workflow-for-freelancers`,
    type: 'article',
  },
  authors: [{ name: 'Andrew Levine' }],
}

export default function AIWorkflowForFreelancersPage() {
  return (
    <>
      <FAQStructuredData faqs={faqItems} />
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pb-20 pt-28">
        <article>
          <header className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md">
              Freelancer Guide • 7 min read
            </div>

            <h1 className="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              AI Workflow for Freelancers: What to Automate First
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Most freelancers start with the wrong AI tasks. These three workflows give you the fastest return without turning your business into a science project.
            </p>
          </header>

          <div className="prose prose-gray mx-auto mt-12 max-w-none dark:prose-invert">
            <p>
              Most freelancers trying AI go in the wrong order.
            </p>

            <p>
              They spend an afternoon testing tools. They try prompts they found on X. They get generic output that doesn&apos;t sound like them. They decide AI isn&apos;t worth the friction and go back to doing things manually.
            </p>

            <p>
              The problem isn&apos;t AI. It&apos;s starting with the wrong task.
            </p>

            <p>
              After working with dozens of professionals on this exact issue, I&apos;ve found that three workflow areas pay off immediately, and everything else can wait.
            </p>

            <h2>The 3 Workflows to Automate First</h2>

            <h3>1. Proposal and Scope Writing</h3>
            <p>
              Proposals kill freelancer hours. You know the work. You know the price. But translating that into professional, persuasive language takes time every single time.
            </p>

            <p>
              This is where AI gives you the fastest ROI.
            </p>

            <p><strong>The prompt structure that works:</strong></p>
            <blockquote>
              <p>
                &quot;I&apos;m a [your type of freelance work] writing a proposal for a client who needs [project description]. My rate is [rate]. The timeline is [timeline]. Draft a 3-paragraph scope-of-work section that explains what I&apos;ll deliver, what I won&apos;t include, and what success looks like.&quot;
              </p>
            </blockquote>

            <p>
              The key is specificity. Vague prompt in, vague output back. The more context you give, the more usable the first draft.
            </p>

            <p>
              <strong>What to expect:</strong> A first draft you can edit in 10 minutes rather than write from scratch in 45. Over 10 proposals a month, that&apos;s 5+ hours recovered.
            </p>

            <p>
              One consultant I worked with cut proposal writing from roughly four hours to under one hour once she stopped starting from a blank page and used a consistent AI-assisted scope template instead.
            </p>

            <h3>2. Client Email and Follow-Up</h3>
            <p>
              The emails that take longest aren&apos;t the ones that require hard thinking. They&apos;re the ones where you&apos;re trying to say something slightly uncomfortable in the right tone.
            </p>

            <p>
              Chasing late invoices. Pushing back on scope creep. Asking a client to make a decision they&apos;ve been sitting on. These emails involve real work: finding the right balance between firm and professional.
            </p>

            <p>
              AI handles the tone problem for you.
            </p>

            <p><strong>The prompt structure:</strong></p>
            <blockquote>
              <p>
                &quot;Write a professional email to a client who [situation, for example, missed a payment that was due 2 weeks ago]. I want to be firm but not aggressive. Keep it under 100 words. My name is [name], client&apos;s name is [name].&quot;
              </p>
            </blockquote>

            <p>
              <strong>What to expect:</strong> A draft that&apos;s 80 to 90 percent usable. You review it, adjust the tone if needed, and send. Three minutes instead of twenty.
            </p>

            <p>
              The more client email types you build prompts for, the faster each one gets. Over time, you&apos;re building a small personal playbook.
            </p>

            <h3>3. Meeting Preparation</h3>
            <p>
              Most freelancers walk into client calls with a rough mental agenda. That&apos;s fine for a casual check-in. But for scoping calls, project reviews, or new client discovery meetings, underpreparing signals lower confidence, even if you&apos;re highly skilled.
            </p>

            <p>
              AI turns 10 minutes of prep into something that feels like two hours.
            </p>

            <p><strong>The prompt structure:</strong></p>
            <blockquote>
              <p>
                &quot;I have a [type of meeting, for example, project kickoff call] with a client in [industry]. Their key goal is [goal]. The main thing I need to learn on this call is [X]. Give me 8 questions I should ask, ordered from most to least important.&quot;
              </p>
            </blockquote>

            <p>
              You can extend this. Ask for an agenda, likely objections to prepare for, or a one-paragraph briefing on the client&apos;s industry.
            </p>

            <p>
              <strong>What to expect:</strong> You show up with a clear agenda and questions the client didn&apos;t expect. You look more professional. You close on next steps faster.
            </p>

            <h2>What Not to Automate First</h2>

            <p>
              A few things freelancers try to automate early usually backfire.
            </p>

            <ul>
              <li>
                <strong>Your entire voice.</strong> AI can draft in your direction, but it does not know your exact relationship with a client or the tone shift between a friendly retainer and a formal proposal.
              </li>
              <li>
                <strong>Creative deliverables.</strong> If your work product is writing, design, or strategy, AI is a collaborator, not a replacement. Use it for research and first-draft structure. The insight is still yours.
              </li>
              <li>
                <strong>Anything that requires judgment.</strong> Pricing decisions, go or no-go on projects, and client qualification all depend on context the model does not have.
              </li>
            </ul>

            <h2>How to Start This Week</h2>

            <p>
              You do not need to overhaul your workflow. One prompt, one workflow type, this week.
            </p>

            <p>
              Pick the task that costs you the most time per week. For most freelancers, that&apos;s proposals. Run the prompt above on your next proposal. Adjust it until the output sounds like you. Save it.
            </p>

            <p>
              That&apos;s your first workflow template.
            </p>

            <p>
              The goal is not to automate everything. The goal is to build a small set of prompt templates for your highest-frequency, highest-friction tasks so you stop rebuilding from scratch every time.
            </p>

            <p>
              If you want more practical examples, browse the full <Link href="/resources">resources hub</Link>. If you&apos;re still deciding where AI fits in your business, the <Link href="/">homepage</Link> explains the coaching approach behind these workflows.
            </p>

            <h2>Want Help Building Your AI Workflow?</h2>

            <p>
              Generic prompts are easy to find. What most freelancers actually need is a workflow shaped around their real clients, real offers, and real communication style.
            </p>

            <p>
              If you want help building that, book a free 15-minute consult. We&apos;ll identify which workflow to tackle first and map out the exact prompts that fit your business.
            </p>
          </div>

          <div className="mt-16 rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-foreground">
              Build your first workflow with help
            </h3>
            <p className="mt-2 text-muted-foreground">
              Bring one real proposal, one real client email problem, or one upcoming meeting. We&apos;ll turn it into a repeatable AI workflow you can use immediately.
            </p>
            <div className="mt-4">
              <ConsultationCTA
                source="ai-workflow-for-freelancers"
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
              Andrew Levine helps busy professionals turn ChatGPT and Claude into practical working tools for writing, planning, research, and repetitive admin work. His coaching focuses on real workflows, not abstract AI theory, so clients leave with systems they can use the same day.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  )
}
