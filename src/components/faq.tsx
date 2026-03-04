import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { ScrollReveal } from "@/components/scroll-reveal"

const faqs = [
  {
    question: "Do I need any technical skills or AI experience?",
    answer:
      "Not at all. Our coaching is designed for people with zero AI experience. If you can use email and a web browser, you can benefit from coaching. We meet you exactly where you are.",
  },
  {
    question: "Which AI tools do you work with?",
    answer:
      "We primarily coach on ChatGPT, Claude, and OpenClaw/clawdbot — an open-source AI assistant that runs 24/7 on your behalf. We'll recommend whatever tool fits your specific needs and budget. If a free tool gets the job done, that's what we'll use.",
  },
  {
    question: "Do you need access to my accounts or private data?",
    answer:
      "No. We never ask for login credentials or access to your accounts. During sessions, you share your screen and we guide you through the process. Your data stays yours.",
  },
  {
    question: "What happens after the free 15-minute consult?",
    answer:
      "If coaching seems like a good fit, we'll schedule a paid virtual session focused on building you 2-3 practical AI workflows. No subscription, no recurring fees — just book sessions when you need them.",
  },
  {
    question: "Is this for individuals or teams?",
    answer:
      "This service is designed for individuals — professionals who want personalized coaching at their own pace. If you're looking for team training, reach out and we'll discuss options.",
  },
  {
    question: "How long does it take to see results?",
    answer:
      "Most clients walk away from their very first session with workflows they can use the same day. We focus on practical, immediate outcomes — not abstract theory.",
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
            Common questions
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
                <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline hover:text-accent transition-colors py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base">
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
