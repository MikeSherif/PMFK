import type { MessageDto, MessagesPageDto } from '@/shared/api';
import type { ChatMessage, MessagesPage } from '../model/types';

export function mapMessageDto(dto: MessageDto): ChatMessage {
  return {
    id: dto.id,
    matchId: dto.matchId,
    text: dto.text,
    createdAt: dto.createdAt,
    fromMe: dto.fromMe,
    clientId: dto.clientId,
    status: 'sent',
  };
}

export function mapMessagesPage(dto: MessagesPageDto): MessagesPage {
  return {
    items: dto.items.map(mapMessageDto),
    nextCursor: dto.nextCursor,
  };
}
