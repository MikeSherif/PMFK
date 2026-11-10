import { http, type MessageDto, type MessagesPageDto } from '@/shared/api';

export function getMessages(matchId: string, cursor: string | null) {
  const path = cursor
    ? `/matches/${matchId}/messages?cursor=${encodeURIComponent(cursor)}`
    : `/matches/${matchId}/messages`;
  return http.get<MessagesPageDto>(path);
}

export function sendMessage(matchId: string, payload: { text: string; clientId: string }) {
  return http.post<MessageDto>(`/matches/${matchId}/messages`, payload);
}
