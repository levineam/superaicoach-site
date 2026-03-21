import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { ScrollReveal } from "@/components/scroll-reveal"

const faqs = [
  {
    question: "Do I need to pay to read the resources?",
    answer:
      "No. The public library is designed to be useful on its own. The broader offer is a curated resources membership, which means some pieces can stay free while deeper collections, roundups, and implementation notes can live behind the membership over time.",
  },
  {
    question: "What kind of resources are included?",
    answer:
      "We publish practical AI guides, workflow breakdowns, prompt patterns, and curated roundups of the best tools and ideas we find each week. The goal is not more noise. It is to save you from digging through endless AI content on your own.",
  },
  {
    question: "How often do you publish new material?",
    answer:
      "The cadence is simple: a daily newsletter captures what is worth paying attention to, one new evergreen resource article is published each week, and the best ideas from the week are distilled into a weekly roundup.",
  },
  {
    question: "Is this coaching, a course, or a membership?",
    answer:
      "The main offer here is the curated resources membership. Think of it as a practical research desk for busy people who want high-signal AI help without turning this into a full-time hobby. Coaching can still exist around the edges, but the core product is the library and weekly curation.",
  },
  {
    question: "Who is this for?",
    answer:
      "Busy professionals, founders, operators, and curious people who want to use AI well without becoming AI obsessives. If you want useful workflows, sharp explanations, and fewer rabbit holes, you are in the right place.",
  },
  {
    question: "How do you decide what makes the cut?",
    answer:
      "We look for resources that are practical, trustworthy, and immediately usable. If something is flashy but not helpful in real work, it does not make the library. The bar is simple: it should save time, improve judgment, or unlock a workflow you can actually use.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="bg-muted/50 py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <ScrollReveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            FAQ
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Questions about the resource library
          </h2>
        </ScrollReveal>

        <ScrollReveal delayMs={80}>
          <Accordion type="single" collapsible className="mt-12">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-border/60"
              >
                <AccordionTrigger className="py-5 text-left text-base font-medium text-foreground transition-colors hover:text-accent hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  )
}
