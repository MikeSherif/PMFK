'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn } from '@/shared/lib';

export function Accordion(props: ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root {...props} />;
}

export function AccordionItem({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item className={cn('border-b border-border py-4', className)} {...props} />
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header asChild>
      <h3>
        <AccordionPrimitive.Trigger
          className={cn(
            'flex w-full items-center justify-between gap-4 py-2 text-left font-display text-lg font-semibold text-text',
            className,
          )}
          {...props}
        >
          {children}
          <span aria-hidden className="text-accent">
            −
          </span>
        </AccordionPrimitive.Trigger>
      </h3>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <AccordionPrimitive.Content
      className={cn('overflow-hidden text-text-muted data-[state=closed]:animate-none', className)}
    >
      <div className="pb-2">{children}</div>
    </AccordionPrimitive.Content>
  );
}
