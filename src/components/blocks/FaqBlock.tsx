"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { BlockFaq } from "@/types/strapi"

export function FaqBlock({ faqs }: BlockFaq) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Accordion type="single" collapsible className="w-full" defaultValue={`item-${faqs[0]?.id}`}>
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={`item-${faq.id}`} data-aos="fade-up"
              data-aos-duration="1500">
            <AccordionTrigger className="text-lg hover:no-underline">{faq.heading}</AccordionTrigger>
            <AccordionContent className="text-base text-pretty leading-relaxed">
              {faq.text}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
