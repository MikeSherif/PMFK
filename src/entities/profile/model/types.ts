export type ProfileStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export type Profile = {
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

export const INTEREST_TAGS = [
  'Кросс-промо',
  'Совместный продукт',
  'HoReCa',
  'FMCG',
  'Ритейл',
  'Beauty',
  'Fashion',
  'Образование',
  'Спорт',
  'Медиа',
  'Influence',
  'ИТ',
  'Девелопмент',
  'Спонсорство',
  'Креатив',
  'CRM',
] as const;

export const INDUSTRIES = [
  'Маркетинг и PR',
  'FMCG',
  'HoReCa',
  'Ритейл',
  'Beauty',
  'Fashion',
  'Медиа',
  'ИТ',
  'Образование',
  'Девелопмент',
  'Креатив',
  'Другое',
] as const;
