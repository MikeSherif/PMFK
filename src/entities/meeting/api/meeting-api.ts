import { http, type MeetingDto } from '@/shared/api';

export function getMeetings() {
  return http.get<{ items: MeetingDto[] }>('/meetings');
}
