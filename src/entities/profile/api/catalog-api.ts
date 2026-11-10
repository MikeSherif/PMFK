import { http, type CatalogProfileDto, type FeedPageDto, type MatchDto } from '@/shared/api';

export function getFeedPage(cursor: string | null) {
  const path = cursor ? `/profiles/feed?cursor=${encodeURIComponent(cursor)}` : '/profiles/feed';
  return http.get<FeedPageDto>(path);
}

export function getSavedProfiles() {
  return http.get<{ items: CatalogProfileDto[] }>('/me/saved');
}

export function skipCatalogProfile(id: string) {
  return http.post<{ ok: true }>(`/profiles/${id}/skip`);
}

export function saveCatalogProfile(id: string) {
  return http.post<CatalogProfileDto>(`/profiles/${id}/save`);
}

export function unsaveCatalogProfile(id: string) {
  return http.delete<CatalogProfileDto>(`/profiles/${id}/save`);
}

export function sendCatalogInterest(id: string) {
  return http.post<{ ok: true; match: MatchDto }>(`/profiles/${id}/interest`);
}
