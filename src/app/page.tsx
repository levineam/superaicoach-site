import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { UseCases } from "@/components/use-cases"
import { HowItWorks } from "@/components/how-it-works"
import { WhatIsCoaching } from "@/components/what-is-coaching"
import { FAQ } from "@/components/faq"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import {
  StructuredData,
  DEFAULT_ORGANIZATION_DATA,
  ServiceStructuredData,
  FAQStructuredData,
  HowToStructuredData,
  DEFAULT_FAQ_ITEMS,
  DEFAULT_HOW_TO_STEPS,
} from "@/components/structured-data"

export default function Page() {
  return (
    <>
      <StructuredData organization={DEFAULT_ORGANIZATION_DATA} />
      <ServiceStructuredData
        name="Curated AI productivity membership"
        description="Pre-configured AI skills, daily briefings, and starter kits for busy professionals. Built on OpenClaw. No tinkering required."
        url="https://superaicoach.com"
        providerName="SuperAIcoach"
        providerUrl="https://superaicoach.com"
        serviceType="AI productivity membership"
      />
      <FAQStructuredData faqs={DEFAULT_FAQ_ITEMS} />
      <HowToStructuredData
        name="How to get started with SuperAIcoach"
        description="Pick your profile, install your config, and stay current with daily briefings."
        url="https://superaicoach.com"
        totalTime="PT30M"
        steps={DEFAULT_HOW_TO_STEPS}
      />
      <Navbar />
      <main>
        <Hero />
        <UseCases />
        <HowItWorks />
        <WhatIsCoaching />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
