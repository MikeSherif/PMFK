import { env } from './env';

const mail = (address: string | undefined, fallback: string) =>
  `mailto:${address ?? fallback}`;

export const links = {
  tickets: env.NEXT_PUBLIC_TICKETS_URL || '/#tickets',
  partners: mail(env.NEXT_PUBLIC_PARTNER_MAIL, 'hello@pmfk.example'),
  press: mail(env.NEXT_PUBLIC_PRESS_MAIL, 'press@pmfk.example'),
  speakers: mail(env.NEXT_PUBLIC_SPEAKER_MAIL, 'speakers@pmfk.example'),
  organizers: mail(env.NEXT_PUBLIC_ORG_MAIL, 'hello@pmfk.example'),
} as const;
