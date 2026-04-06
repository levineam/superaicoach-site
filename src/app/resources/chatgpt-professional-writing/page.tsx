import type { Metadata } from 'next'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ConsultationCTA } from '@/components/consultation-cta'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://superaicoach.com'

export const metadata: Metadata = {
  title: 'Getting Started with ChatGPT for Professional Writing | SuperAIcoach',
  description:
    'Learn practical techniques for using ChatGPT to write professional emails, reports, and proposals. Step-by-step guide with examples and best practices.',
  keywords: 'ChatGPT professional writing, ChatGPT for business writing, ChatGPT email templates, AI writing assistant, professional AI writing',
  alternates: {
    canonical: '/resources/chatgpt-professional-writing',
  },
  openGraph: {
    title: 'Getting Started with ChatGPT for Professional Writing',
    description: 'Learn practical techniques for using ChatGPT to write professional emails, reports, and proposals.',
    url: `${baseUrl}/resources/chatgpt-professional-writing`,
    type: 'article',
  },
  authors: [{ name: 'Andrew Levine' }],
}

export default function ChatGPTWritingGuide() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pb-20 pt-28">
        <article>
          <header className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md">
              ChatGPT Guide • 8 min read
            </div>

            <h1 className="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              Getting Started with ChatGPT for Professional Writing
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Learn practical techniques for using ChatGPT to draft emails, reports, and proposals that sound professional and save you time.
            </p>
          </header>

          <div className="prose prose-gray mx-auto mt-12 max-w-none dark:prose-invert">
            <p>
              Writing professional emails, reports, and proposals can be time-consuming and mentally draining. ChatGPT can help you draft these documents faster while maintaining a professional tone—but only if you know how to use it effectively.
            </p>

            <h2>The Three-Step Professional Writing Framework</h2>
            
            <p>
              Instead of asking ChatGPT to &quot;write an email,&quot; use this proven three-step approach:
            </p>

            <h3>1. Set the Context</h3>
            <p>
              Always start by giving ChatGPT the background it needs. For example:
            </p>
            <blockquote>
              <p>
                &quot;I&apos;m a marketing manager at a B2B software company. I need to follow up with a potential client who attended our webinar last week but hasn&apos;t responded to our initial outreach.&quot;
              </p>
            </blockquote>

            <h3>2. Specify the Tone and Length</h3>
            <p>
              Be explicit about how formal or casual you want the writing to sound:
            </p>
            <blockquote>
              <p>
                &quot;The tone should be professional but friendly, not pushy. Keep it to 3-4 sentences max.&quot;
              </p>
            </blockquote>

            <h3>3. Include Key Details</h3>
            <p>
              Provide the specific information ChatGPT needs to include:
            </p>
            <blockquote>
              <p>
                &quot;Reference that they downloaded our pricing guide during the webinar. Offer to schedule a brief call to answer any questions. Include my calendar link.&quot;
              </p>
            </blockquote>

            <h2>Common Mistakes to Avoid</h2>
            
            <ul>
              <li><strong>Being too vague:</strong> &quot;Write a professional email&quot; gives ChatGPT almost nothing to work with.</li>
              <li><strong>Not reviewing and editing:</strong> ChatGPT&apos;s first draft is rarely your final draft.</li>
              <li><strong>Ignoring your company&apos;s voice:</strong> Make sure the output matches how your organization typically communicates.</li>
            </ul>

            <h2>Quick Templates for Common Scenarios</h2>

            <h3>Follow-up Email</h3>
            <p>
              &quot;Draft a follow-up email to [recipient type] about [topic]. We previously [context]. The tone should be [tone]. Keep it [length]. Include [specific details].&quot;
            </p>

            <h3>Project Status Report</h3>
            <p>
              &quot;Write a project status update for [project name]. We&apos;re [current status]. Key accomplishments this week: [list]. Upcoming milestones: [list]. Format as a brief report for [audience].&quot;
            </p>

            <h2>Next Steps</h2>
            
            <p>
              The key to success with ChatGPT for professional writing is practice and refinement. Start with lower-stakes communications like internal updates, then gradually work up to client-facing emails and proposals.
            </p>

            <p>
              Remember: ChatGPT is a drafting tool, not a replacement for your judgment. Always review, edit, and ensure the final message reflects your authentic voice and meets your specific situation&apos;s needs.
            </p>
          </div>

          <div className="mt-16 rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-foreground">
              Want personalized guidance?
            </h3>
            <p className="mt-2 text-muted-foreground">
              This guide covers the basics, but every professional has unique writing needs. In a 1:1 coaching session, we can set up custom templates and workflows that match your specific role and communication style.
            </p>
            <div className="mt-4">
              <ConsultationCTA
                source="chatgpt-writing-guide"
                label="Free 15-minute call"
                buttonClassName="border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
              />
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}