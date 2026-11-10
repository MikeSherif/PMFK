import type { ProfileDto } from './profile';

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
  profile: ProfileDto;
};
