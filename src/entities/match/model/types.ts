export type MatchPeer = {
  id: string;
  fullName: string;
  company: string;
  role: string;
};

export type Match = {
  id: string;
  createdAt: string;
  peer: MatchPeer;
};
