import { infiniteQueryOptions } from '@tanstack/react-query';
import { getMessages } from '../api/message-api';
import { mapMessagesPage } from '../api/mappers';

export const messageKeys = {
  all: ['messages'] as const,
  list: (matchId: string) => [...messageKeys.all, matchId] as const,
};

export const POLL_INTERVAL_MS = 8_000;

export const messagesQuery = (matchId: string, polling: boolean) =>
  infiniteQueryOptions({
    queryKey: messageKeys.list(matchId),
    queryFn: ({ pageParam }) => getMessages(matchId, pageParam).then(mapMessagesPage),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchInterval: polling ? POLL_INTERVAL_MS : false,
  });
