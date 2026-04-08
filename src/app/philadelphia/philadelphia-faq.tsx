'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export interface PhiladelphiaFAQItem {
  question: string
  answer: string
}

export function PhiladelphiaFAQ({ faqs }: { faqs: PhiladelphiaFAQItem[] }) {
  return (
    <Accordion type="single" collapsible>
      {faqs.map((faq, index) => (
        <AccordionItem key={faq.question} value={`item-${index}`} className="border-border/40">
          <AccordionTrigger className="py-5 text-left text-base font-semibold text-foreground hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
