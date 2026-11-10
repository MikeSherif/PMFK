'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { EmptyState } from '@/shared/ui/empty-state';
import { Skeleton } from '@/shared/ui/skeleton';
import { matchesContent } from '../content';
import { ConnectChatPage } from './ConnectChatPage';

function ConversationGate() {
  const params = useSearchParams();
  const matchId = params?.get('matchId') ?? '';
  if (!matchId) {
    return <EmptyState title={matchesContent.chatEmpty} />;
  }
  return <ConnectChatPage matchId={matchId} />;
}

export function ConnectConversationPage() {
  return (
    <Suspense fallback={<Skeleton className="h-72 w-full" />}>
      <ConversationGate />
    </Suspense>
  );
}
