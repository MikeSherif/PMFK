import { http } from '@/shared/api';

export function deleteMyAccount() {
  return http.delete<{ ok: true }>('/auth/account', { confirm: true });
}
