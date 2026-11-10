import type { MeetingStatus } from '@/entities/meeting';

export const meetingsCopy = {
  status: {
    requested: 'Запрос',
    confirmed: 'Подтверждена',
    cancelled: 'Отменена',
  } satisfies Record<MeetingStatus, string>,
} as const;
