import { NextResponse } from 'next/server';
import { jsonError } from '../../../_lib/json-error';
import { requestOtp } from '@/shared/api/mock/db';

type RequestBody = {
  email?: unknown;
  consentPdn?: unknown;
  consentVersion?: unknown;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RequestBody | null;
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const consentPdn = body?.consentPdn === true;
  const consentVersion = typeof body?.consentVersion === 'string' ? body.consentVersion : '';

  if (!email || !email.includes('@')) {
    return jsonError(422, 'VALIDATION', 'Проверьте поля формы', {
      fieldErrors: { email: ['Укажите рабочий email'] },
    });
  }
  if (!consentPdn) {
    return jsonError(422, 'VALIDATION', 'Проверьте поля формы', {
      fieldErrors: { consentPdn: ['Нужно согласие на обработку персональных данных'] },
    });
  }

  const result = requestOtp(email, consentVersion);
  if (!result.ok) {
    return jsonError(429, 'RATE_LIMITED', 'Слишком много запросов кода. Подождите.', {
      retryAfterSec: result.retryAfterSec,
    });
  }

  return NextResponse.json({ expiresInSec: result.expiresInSec });
}
