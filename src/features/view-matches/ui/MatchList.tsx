'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { connectMessages, routes } from '@/shared/config';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { QueryError } from '@/shared/ui/query-error';
import { Skeleton } from '@/shared/ui/skeleton';
import { matchesQuery } from '@/entities/match';
import { Can } from '@/entities/viewer';
import { matchesCopy } from '../model/content';

type MatchListProps = {
  emptyTitle: string;
  emptyDescription: string;
};

export function MatchList({ emptyTitle, emptyDescription }: MatchListProps) {
  const router = useRouter();
  const query = useQuery(matchesQuery());
  const items = query.data ?? [];

  if (query.isPending) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (query.isError && !query.data) {
    return (
      <QueryError
        title={connectMessages.loadError}
        retryLabel={connectMessages.retry}
        onRetry={() => void query.refetch()}
      />
    );
  }

  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((match) => (
        <Card key={match.id}>
          <p className="text-xs tracking-[0.2em] text-peach uppercase">{matchesCopy.cardEyebrow}</p>
          <Badge tone="accent" className="mt-3">
            {matchesCopy.badge}
          </Badge>
          <p className="font-display mt-4 text-2xl leading-none font-bold tracking-tight uppercase">
            {match.peer.fullName}
          </p>
          <p className="mt-2 text-sm text-text-muted">
            {match.peer.role} · {match.peer.company}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Can ability="canChat" paywall>
              <Button onClick={() => router.push(routes.connect.match(match.id) as Route)}>
                {matchesCopy.openChat}
              </Button>
            </Can>
            <Can ability="canBook" paywall>
              <Button variant="secondary" onClick={() => router.push(routes.connect.meetings)}>
                {matchesCopy.propose}
              </Button>
            </Can>
          </div>
        </Card>
      ))}
    </div>
  );
}
