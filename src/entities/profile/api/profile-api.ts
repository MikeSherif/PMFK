import { http, type ProfileDto } from '@/shared/api';

export function getMyProfile() {
  return http.get<ProfileDto>('/me/profile');
}
