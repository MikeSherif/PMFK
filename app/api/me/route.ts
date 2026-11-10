import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/shared/config';
import { getViewerByToken } from '@/shared/api/mock/db';
import { jsonError } from '../_lib/json-error';

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const viewer = getViewerByToken(token);
  if (!viewer) {
    return jsonError(401, 'UNAUTHENTICATED', 'Сессия недействительна');
  }
  return NextResponse.json(viewer);
}
