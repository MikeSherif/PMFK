export type ProfileStatusDto = 'draft' | 'pending' | 'approved' | 'rejected';

export type ProfileDto = {
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

export type ProfileWriteDto = Omit<ProfileDto, 'status'>;
