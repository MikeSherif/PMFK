import { type InfiniteData, type QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { parseWsEvent, type WsClient } from '@/shared/api';
import { matchKeys } from '@/entities/match';
import { mapMessageDto, messageKeys, type MessagesPage } from '@/entities/message';
import { viewerKeys } from '@/entities/viewer';

export function bindRealtime(client: WsClient, queryClient: QueryClient) {
  const stopMessage = client.subscribe('message.created', (payload) => {
    const event = parseWsEvent({ type: 'message.created', payload });
    if (!event || event.type !== 'message.created') {
      return;
    }
    const mapped = mapMessageDto(event.payload);
    queryClient.setQueryData<InfiniteData<MessagesPage>>(messageKeys.list(mapped.matchId), (current) => {
      if (!current) {
        return current;
      }
      const exists = current.pages.some((page) =>
        page.items.some((item) => item.id === mapped.id || item.clientId === mapped.clientId),
      );
      if (exists) {
        return current;
      }
      const pages = current.pages.map((page, index) =>
        index === 0 ? { ...page, items: [...page.items, mapped] } : page,
      );
      return { ...current, pages };
    });
  });

  const stopMatch = client.subscribe('match.created', (payload) => {
    const event = parseWsEvent({ type: 'match.created', payload });
    if (!event || event.type !== 'match.created') {
      return;
    }
    void queryClient.invalidateQueries({ queryKey: matchKeys.all });
    toast.success('Появился взаимный интерес.');
  });

  const stopAccess = client.subscribe('access.updated', (payload) => {
    const event = parseWsEvent({ type: 'access.updated', payload });
    if (!event || event.type !== 'access.updated') {
      return;
    }
    queryClient.setQueryData(viewerKeys.me(), (current) =>
      current ? { ...current, abilities: event.payload.abilities, ticket: event.payload.ticket } : current,
    );
  });

  return () => {
    stopMessage();
    stopMatch();
    stopAccess();
  };
}
