'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { createWsClient, http } from '@/shared/api';
import { env, flags } from '@/shared/config';
import { bindRealtime } from '../model/bridge';

async function wsUrl() {
  const { ticket } = await http.post<{ ticket: string }>('/ws-ticket');
  const api = new URL(env.NEXT_PUBLIC_API_URL);
  const protocol = api.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${api.host}/ws?ticket=${encodeURIComponent(ticket)}`;
}

export function ConnectRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!flags.connectChatEnabled) {
      return;
    }
    const client = createWsClient({ getUrl: wsUrl });
    const stop = bindRealtime(client, queryClient);
    client.connect();
    return () => {
      stop();
      client.disconnect();
    };
  }, [queryClient]);

  return null;
}
