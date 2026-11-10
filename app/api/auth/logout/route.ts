import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/shared/config';
import { clearSession } from '@/shared/api/mock/db';
import { clearSessionCookie } from '../../_lib/session-cookie';

export async function POST() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  clearSession(token);
  return clearSessionCookie(NextResponse.json({ ok: true }));
}
