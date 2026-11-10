export type MatchPeerDto = {
  id: string;
  fullName: string;
  company: string;
  role: string;
};

export type MatchDto = {
  id: string;
  createdAt: string;
  peer: MatchPeerDto;
};

export type MessageDto = {
  id: string;
  matchId: string;
  text: string;
  createdAt: string;
  fromMe: boolean;
  clientId: string;
};

export type MessagesPageDto = {
  items: MessageDto[];
  nextCursor: string | null;
};

export type AccessDto = {
  abilities: {
    canSendInterest: boolean;
    canChat: boolean;
    canBook: boolean;
  };
  ticket: {
    status: 'none' | 'pending' | 'active';
    label: string;
  };
};
