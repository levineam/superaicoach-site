import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { ScrollReveal } from "@/components/scroll-reveal";

const faqs = [
  {
    question: "Do I need to be technical?",
    answer:
      "No. If you can install an app and follow a setup guide, you can use this. The whole point is that someone else did the hard part.",
  },
  {
    question: "What AI tools does this work with?",
    answer:
      "The stack is built on OpenClaw — an open-source AI agent runtime. Skills work with ChatGPT, Claude, Gmail, Calendar, Apple Notes, Discord, GitHub, and many more.",
  },
  {
    question: "What do I actually get as a member?",
    answer:
      "Access to the full skill catalog with install guides, pre-built starter configs, the daily AI briefing newsletter, Discord community, and new releases as they ship.",
  },
  {
    question: "Is there a free tier?",
    answer:
      "Yes. The /resources page has free guides and articles. The daily newsletter preview is also free. Full skill catalog, configs, and community require membership.",
  },
  {
    question: "How is this different from ChatGPT Plus or Claude Pro?",
    answer:
      "Those are the AI models. This is the layer on top — pre-built workflows, integrations, and configs that make the models actually useful for daily work. Think of it as the difference between buying a car and having a mechanic tune it for your commute.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. No contracts, no commitment. Cancel from your account page.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="bg-primary py-24 text-primary-foreground md:py-32"
    >
      <div className="mx-auto max-w-3xl px-6">
        <ScrollReveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-foreground/55">
            FAQ
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
            Common{" "}
            <span className="italic text-primary-foreground/80">questions</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delayMs={80}>
          <Accordion type="single" collapsible className="mt-12">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-primary-foreground/15"
              >
                <AccordionTrigger className="py-5 text-left text-base font-medium text-primary-foreground transition-colors hover:text-primary-foreground/80 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-primary-foreground/68">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}
