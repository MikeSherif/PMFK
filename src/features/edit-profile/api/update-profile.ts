import { http, type ProfileDto, type ProfileWriteDto } from '@/shared/api';

export function updateMyProfile(payload: ProfileWriteDto) {
  return http.put<ProfileDto>('/me/profile', payload);
}
