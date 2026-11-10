import { boolEnv } from '@/shared/lib';
import { env } from './env';

export const flags = {
  demoMode: boolEnv(env.NEXT_PUBLIC_DEMO_MODE, true),
  ticketSalesOpen: boolEnv(env.NEXT_PUBLIC_TICKET_SALES_OPEN),
  speakersPublished: boolEnv(env.NEXT_PUBLIC_SPEAKERS_PUBLISHED),
  programPublished: boolEnv(env.NEXT_PUBLIC_PROGRAM_PUBLISHED),
  partnersPublished: boolEnv(env.NEXT_PUBLIC_PARTNERS_PUBLISHED),
  mediaPartnersPublished: boolEnv(env.NEXT_PUBLIC_MEDIA_PARTNERS_PUBLISHED),
  addressConfirmed: boolEnv(env.NEXT_PUBLIC_ADDRESS_CONFIRMED),
  bookingEnabled: boolEnv(env.NEXT_PUBLIC_BOOKING_ENABLED),
  connectChatEnabled: boolEnv(env.NEXT_PUBLIC_CONNECT_CHAT_ENABLED),
  githubPages: boolEnv(env.NEXT_PUBLIC_GITHUB_PAGES),
} as const;

export type FeatureFlags = typeof flags;
