import type { Metadata } from 'next'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProfessionSelector } from '@/components/profession-selector'

export const metadata: Metadata = {
  title: 'Cowork Starter Packs — SuperAIcoach',
  description:
    'Pre-configured Claude Cowork projects for Financial Advisors, Attorneys, and Executives. Pick your profession, get a ready-to-import setup with custom instructions, workflows, and connectors.',
  alternates: {
    canonical: '/cowork',
  },
}

export default function CoworkPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-20">
        {/* Hero */}
        <section className="mb-16 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Claude Cowork, set up for your profession
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Skip the blank canvas. Get a pre-configured Cowork project with workflows,
            instructions, and connectors that matter for your role.
          </p>
        </section>

        {/* Profession selector + skill cards + email capture */}
        <section className="mb-20">
          <ProfessionSelector />
        </section>

        {/* How it works */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-foreground">
            How it works
          </h2>
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Pick your profession',
                description: 'Choose from Financial Advisor, Attorney, or Executive.',
              },
              {
                step: '2',
                title: 'Enter your email',
                description: 'We send you a complete Cowork project setup.',
              },
              {
                step: '3',
                title: 'Import and go',
                description:
                  'Paste the custom instructions, create the folders, and start working with AI.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center rounded-xl border border-border/60 bg-card/60 p-6 text-center backdrop-blur-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-lg font-bold text-accent">
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
