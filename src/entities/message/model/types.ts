export type MessageStatus = 'sending' | 'sent' | 'failed';

export type ChatMessage = {
  id: string;
  matchId: string;
  text: string;
  createdAt: string;
  fromMe: boolean;
  clientId: string;
  status: MessageStatus;
};

export type MessagesPage = {
  items: ChatMessage[];
  nextCursor: string | null;
};
