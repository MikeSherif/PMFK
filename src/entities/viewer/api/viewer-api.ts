import { http, type ViewerDto } from '@/shared/api';

export function getMe(options?: { skipAuthReaction?: boolean }) {
  if (options) {
    return http.get<ViewerDto>('/me', options);
  }
  return http.get<ViewerDto>('/me');
}
