import { http, type MatchDto } from '@/shared/api';

export function getMatches() {
  return http.get<{ items: MatchDto[] }>('/matches');
}

export function getMatchById(id: string) {
  return http.get<MatchDto>(`/matches/${id}`);
}
