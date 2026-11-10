import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/shared/config';
import { getViewerByToken } from '@/shared/api/mock/db';

export async function requireViewer() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return getViewerByToken(token);
}
