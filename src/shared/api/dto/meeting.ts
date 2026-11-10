import type { MatchPeerDto } from './match';

export type MeetingStatusDto = 'requested' | 'confirmed' | 'cancelled';

export type MeetingDto = {
  id: string;
  matchId: string;
  createdAt: string;
  status: MeetingStatusDto;
  slotLabel: string | null;
  peer: MatchPeerDto;
};
