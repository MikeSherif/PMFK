export type Ability = 'canSendInterest' | 'canChat' | 'canBook';

export type ProfileStatus = 'draft' | 'pending' | 'approved' | 'rejected';
export type TicketStatus = 'none' | 'pending' | 'active';

export type Viewer = {
  id: string;
  email: string;
  abilities: Record<Ability, boolean>;
  ticket: {
    status: TicketStatus;
    label: string;
  };
  profile: {
    status: ProfileStatus;
    fullName: string;
    company: string;
    role: string;
    industry: string;
    city: string;
    website: string;
    lookingFor: string;
    offering: string;
    tags: string[];
    catalogConsent: boolean;
    publishConsent: boolean;
  };
};
