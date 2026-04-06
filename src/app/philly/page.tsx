import type { Metadata } from 'next'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ScrollReveal } from '@/components/scroll-reveal'
import { ConsultationCTA } from '@/components/consultation-cta'
import { StructuredData, PHILADELPHIA_ORGANIZATION_DATA } from '@/components/structured-data'
import { MapPin } from 'lucide-react'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://superaicoach.com'

export const metadata: Metadata = {
  title: 'Personal AI Coaching in Philadelphia | SuperAIcoach',
  description:
    'In-person personal AI coaching in Philadelphia. Expert training on ChatGPT, Claude, and AI automation for professionals. Practical workflows for writing, meetings, planning, and research.',
  keywords: 'AI coaching Philadelphia, ChatGPT training Philadelphia, Claude training, personal AI coach Philadelphia, AI productivity coaching, Philadelphia AI consultant',
  alternates: {
    canonical: '/philly',
  },
  openGraph: {
    title: 'Personal AI Coaching in Philadelphia | SuperAIcoach',
    description: 'In-person personal AI coaching in Philadelphia. Expert training on ChatGPT, Claude, and AI automation for professionals.',
    url: `${baseUrl}/philly`,
    type: 'website',
    locale: 'en_US',
    siteName: 'SuperAIcoach',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal AI Coaching in Philadelphia | SuperAIcoach',
    description: 'In-person personal AI coaching in Philadelphia. Expert training on ChatGPT, Claude, and AI automation for professionals.',
  },
}

export default function PhillyPage() {
  return (
    <>
      <StructuredData organization={PHILADELPHIA_ORGANIZATION_DATA} />
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur-md">
            <MapPin className="h-4 w-4" />
            Philadelphia • In-person or virtual
          </div>

          <h1 className="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            Personal AI Coaching in <span className="text-accent">Philadelphia</span>
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Same proven outcomes as virtual coaching—just higher-touch for hands-on setup and live practice sessions.
          </p>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <ConsultationCTA
              source="philly-hero"
              label="Book a Call"
              containerClassName="items-start"
            />
            <a
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              href="mailto:hello@superaicoach.com?subject=In-person%20AI%20coaching%20in%20Philadelphia"
            >
              Prefer email? hello@superaicoach.com
            </a>
          </div>
        </div>

        <section className="mt-16">
          <ScrollReveal delayMs={60} className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-xl">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Where we meet
              </h2>
              <p className="mt-2 text-muted-foreground">
                At your Center City office, co-working space, or a convenient public location throughout Philadelphia. In-person sessions are limited and by appointment.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-xl">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                What we do
              </h2>
              <p className="mt-2 text-muted-foreground">
                Practical workflows for writing, planning, meetings, and research—tailored to how you work.
              </p>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </>
  )
}
