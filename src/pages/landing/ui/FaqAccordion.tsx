'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { faqContent } from '../content/sections';

export function FaqAccordion() {
  const first = faqContent.items[0];
  return (
    <Accordion type="single" collapsible defaultValue={first?.q}>
      {faqContent.items.map((item) => (
        <AccordionItem key={item.q} value={item.q}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
