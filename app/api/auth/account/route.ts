import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/shared/config';
import { deleteAccount } from '@/shared/api/mock/db';
import { jsonError, jsonUnauthenticated } from '../../_lib/json-error';
import { clearSessionCookie } from '../../_lib/session-cookie';

export async function DELETE(request: Request) {
  const body = (await request.json().catch(() => null)) as { confirm?: unknown } | null;
  if (body?.confirm !== true) {
    return jsonError(422, 'VALIDATION', 'Подтвердите удаление аккаунта', {
      fieldErrors: { confirm: ['Нужно явное подтверждение'] },
    });
  }
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!deleteAccount(token)) {
    return jsonUnauthenticated();
  }
  return clearSessionCookie(NextResponse.json({ ok: true }));
}
