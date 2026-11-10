'use client';

import { useQuery } from '@tanstack/react-query';
import { connectMessages } from '@/shared/config';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { QueryError } from '@/shared/ui/query-error';
import { Skeleton } from '@/shared/ui/skeleton';
import { meetingsQuery } from '@/entities/meeting';
import { meetingsCopy } from '../model/content';

type MeetingListProps = {
  emptyTitle: string;
};

export function MeetingList({ emptyTitle }: MeetingListProps) {
  const query = useQuery(meetingsQuery());
  const items = query.data ?? [];

  if (query.isPending) {
    return <Skeleton className="h-32 w-full" />;
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
    return <EmptyState title={emptyTitle} />;
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((meeting) => (
        <Card key={meeting.id}>
          <Badge>{meetingsCopy.status[meeting.status]}</Badge>
          <p className="font-display mt-4 text-2xl leading-tight font-bold tracking-tight uppercase">
            {meeting.peer.fullName}
          </p>
          <p className="mt-2 text-sm text-text-muted">
            {meeting.peer.role} · {meeting.peer.company}
          </p>
          {meeting.slotLabel ? <p className="mt-3 text-sm text-text">{meeting.slotLabel}</p> : null}
        </Card>
      ))}
    </div>
  );
}
