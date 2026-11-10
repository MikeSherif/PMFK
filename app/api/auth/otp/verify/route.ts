import { NextResponse } from 'next/server';
import { jsonError } from '../../../_lib/json-error';
import { verifyOtp } from '@/shared/api/mock/db';
import { withSessionCookie } from '../../../_lib/session-cookie';

type RequestBody = {
  email?: unknown;
  code?: unknown;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RequestBody | null;
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const code = typeof body?.code === 'string' ? body.code : '';

  if (!email || !code) {
    return jsonError(422, 'VALIDATION', 'Проверьте поля формы', {
      fieldErrors: {
        email: email ? [] : ['Укажите email'],
        code: code ? [] : ['Введите код'],
      },
    });
  }

  const result = verifyOtp(email, code);
  if (!result.ok) {
    if (result.code === 'RATE_LIMITED') {
      const extra = { retryAfterSec: result.retryAfterSec ?? 60 };
      return jsonError(429, 'RATE_LIMITED', result.message ?? 'Слишком много попыток.', extra);
    }
    return jsonError(400, 'INVALID_CODE', result.message ?? 'Неверный код');
  }

  return withSessionCookie(NextResponse.json({ viewer: result.viewer }), result.token);
}
