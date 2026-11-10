export type ProfileStatusDto = 'draft' | 'pending' | 'approved' | 'rejected';
export type TicketStatusDto = 'none' | 'pending' | 'active';

export type ViewerDto = {
  id: string;
  email: string;
  abilities: {
    canSendInterest: boolean;
    canChat: boolean;
    canBook: boolean;
  };
  ticket: {
    status: TicketStatusDto;
    label: string;
  };
  profile: {
    status: ProfileStatusDto;
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
