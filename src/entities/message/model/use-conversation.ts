'use client';

import { type InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flags } from '@/shared/config';
import { isApiError } from '@/shared/api';
import { mapMessageDto } from '../api/mappers';
import { sendMessage } from '../api/message-api';
import type { ChatMessage, MessagesPage } from './types';
import { messageKeys, messagesQuery } from './queries';

function flattenMessages(pages: { items: ChatMessage[] }[]) {
  return [...pages].reverse().flatMap((page) => page.items);
}

export function useConversation(matchId: string) {
  const queryClient = useQueryClient();
  const polling = !flags.connectChatEnabled;
  const query = useInfiniteQuery(messagesQuery(matchId, polling));
  const messages = flattenMessages(query.data?.pages ?? []);

  const send = useMutation({
    mutationFn: (input: { text: string; clientId: string }) => sendMessage(matchId, input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: messageKeys.list(matchId) });
      const previous = queryClient.getQueryData<InfiniteData<MessagesPage>>(messageKeys.list(matchId));
      const optimistic: ChatMessage = {
        id: input.clientId,
        matchId,
        text: input.text,
        createdAt: new Date().toISOString(),
        fromMe: true,
        clientId: input.clientId,
        status: 'sending',
      };
      queryClient.setQueryData<InfiniteData<MessagesPage>>(messageKeys.list(matchId), (current) => {
        if (!current) {
          return { pages: [{ items: [optimistic], nextCursor: null }], pageParams: [null] };
        }
        const pages = current.pages.map((page, index) =>
          index === 0 ? { ...page, items: [...page.items, optimistic] } : page,
        );
        return { ...current, pages };
      });
      return { previous };
    },
    onError: (_error, input, context) => {
      queryClient.setQueryData<InfiniteData<MessagesPage>>(messageKeys.list(matchId), (current) => {
        if (!current) {
          return context?.previous;
        }
        return {
          ...current,
          pages: current.pages.map((page) => ({
            ...page,
            items: page.items.map((item) =>
              item.clientId === input.clientId ? { ...item, status: 'failed' as const } : item,
            ),
          })),
        };
      });
    },
    onSuccess: (dto, input) => {
      const mapped = mapMessageDto(dto);
      queryClient.setQueryData<InfiniteData<MessagesPage>>(messageKeys.list(matchId), (current) => {
        if (!current) {
          return current;
        }
        return {
          ...current,
          pages: current.pages.map((page) => ({
            ...page,
            items: page.items.map((item) => (item.clientId === input.clientId ? mapped : item)),
          })),
        };
      });
    },
  });

  return {
    messages,
    isPending: query.isPending,
    isFetching: query.isFetching,
    errorMessage: query.error
      ? isApiError(query.error)
        ? query.error.message
        : 'Не удалось загрузить переписку'
      : undefined,
    hasOlder: Boolean(query.hasNextPage),
    loadOlder: () => query.fetchNextPage(),
    refresh: () => query.refetch(),
    send: (text: string, clientId = crypto.randomUUID()) => send.mutate({ text, clientId }),
    sending: send.isPending,
  };
}
