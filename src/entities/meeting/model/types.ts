export type MeetingStatus = 'requested' | 'confirmed' | 'cancelled';

export type MeetingPeer = {
  id: string;
  fullName: string;
  company: string;
  role: string;
};

export type Meeting = {
  id: string;
  matchId: string;
  createdAt: string;
  status: MeetingStatus;
  slotLabel: string | null;
  peer: MeetingPeer;
};
