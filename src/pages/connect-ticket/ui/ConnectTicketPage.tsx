'use client';

import { useQuery } from '@tanstack/react-query';
import { connectMessages, links } from '@/shared/config';
import { AppLink } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Heading } from '@/shared/ui/heading';
import { QueryError } from '@/shared/ui/query-error';
import { Skeleton } from '@/shared/ui/skeleton';
import { viewerQuery } from '@/entities/viewer';
import { ticketContent } from '../content';

export function ConnectTicketPage() {
  const viewer = useQuery(viewerQuery());
  const ticket = viewer.data?.ticket;
  const status = ticket?.status ?? 'none';
  const label = ticket?.label ?? ticketContent.fallbackLabel;

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-peach uppercase">{ticketContent.eyebrow}</p>
      <Heading as="h1" className="mt-3">
        {ticketContent.title}
      </Heading>
      <p className="mt-4 max-w-2xl text-pretty text-text-muted">{ticketContent.description}</p>
      {viewer.isPending ? (
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : viewer.isError ? (
        <div className="mt-8">
          <QueryError
            title={connectMessages.loadError}
            retryLabel={connectMessages.retry}
            onRetry={() => void viewer.refetch()}
          />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <Card>
              <p className="text-xs tracking-[0.2em] text-peach uppercase">{ticketContent.statusLabel}</p>
              <p className="font-display mt-3 text-[clamp(1.75rem,4vw,2.75rem)] leading-tight font-bold uppercase">
                {label}
              </p>
              <p className="mt-4 text-pretty text-sm leading-relaxed text-text-muted">{ticketContent.hints[status]}</p>
            </Card>
            <Card>
              <p className="text-xs tracking-[0.2em] text-peach uppercase">{ticketContent.howLabel}</p>
              <p className="mt-3 text-pretty leading-relaxed text-text-muted">{ticketContent.howBody}</p>
              <div className="mt-6">
                <Button asChild>
                  <AppLink href={links.tickets}>{ticketContent.choose}</AppLink>
                </Button>
              </div>
            </Card>
          </div>
          <Card className="mt-4">
            <p className="font-display text-lg leading-tight font-bold uppercase">{ticketContent.missingTitle}</p>
            <p className="mt-2 text-pretty leading-relaxed text-text-muted">{ticketContent.missingBody}</p>
          </Card>
        </>
      )}
    </div>
  );
}
