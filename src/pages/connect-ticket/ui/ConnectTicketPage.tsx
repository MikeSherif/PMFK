'use client';

import { useQuery } from '@tanstack/react-query';
import { links } from '@/shared/config';
import { AppLink } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Heading } from '@/shared/ui/heading';
import { viewerQuery } from '@/entities/viewer';
import { ticketContent } from '../content';

export function ConnectTicketPage() {
  const { data } = useQuery(viewerQuery());
  const ticket = data?.ticket;

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-peach uppercase">{ticketContent.eyebrow}</p>
      <Heading as="h1" className="mt-3">
        {ticketContent.title}
      </Heading>
      <p className="mt-4 max-w-2xl text-pretty text-text-muted">{ticketContent.description}</p>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-xs tracking-[0.2em] text-peach uppercase">{ticketContent.statusLabel}</p>
          <p className="font-display mt-3 text-[clamp(1.75rem,4vw,3rem)] leading-none font-bold uppercase">
            {ticket?.label ?? 'Нет доступа'}
          </p>
        </Card>
        <Card>
          <p className="text-xs tracking-[0.2em] text-peach uppercase">{ticketContent.howLabel}</p>
          <p className="mt-3 text-pretty text-text-muted">{ticketContent.howBody}</p>
          <div className="mt-6">
            <Button asChild>
              <AppLink href={links.tickets}>{ticketContent.choose}</AppLink>
            </Button>
          </div>
        </Card>
      </div>
      <Card className="mt-4">
        <p className="font-display text-lg font-bold uppercase">{ticketContent.missingTitle}</p>
        <p className="mt-2 text-pretty text-text-muted">{ticketContent.missingBody}</p>
      </Card>
    </div>
  );
}
