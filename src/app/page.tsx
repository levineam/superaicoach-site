import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { UseCases } from "@/components/use-cases"
import { HowItWorks } from "@/components/how-it-works"
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
        name="Personal AI assistant coaching"
        description="1:1 coaching that helps busy professionals use ChatGPT and Claude as practical virtual AI assistants for writing, planning, and repetitive admin work."
        url="https://superaicoach.com"
        providerName="SuperAIcoach"
        providerUrl="https://superaicoach.com"
        serviceType="AI productivity coaching"
      />
      <FAQStructuredData faqs={DEFAULT_FAQ_ITEMS} />
      <HowToStructuredData
        name="How to start with SuperAIcoach"
        description="Book a free 15-minute call, bring one real use case, build your workflow, and run it right away."
        url="https://superaicoach.com"
        totalTime="PT15M"
        steps={DEFAULT_HOW_TO_STEPS}
      />
      <Navbar />
      <main>
        <Hero />
        <UseCases />
        <HowItWorks />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
