import { http, HttpResponse } from 'msw';
import { clearSession, getViewerByToken, requestOtp, verifyOtp } from '../mock/db';

function errorJson(
  status: number,
  code: string,
  message: string,
  extra?: { fieldErrors?: Record<string, string[]>; retryAfterSec?: number },
) {
  const init: ResponseInit = { status };
  if (extra?.retryAfterSec !== undefined) {
    init.headers = { 'Retry-After': String(extra.retryAfterSec) };
  }
  return HttpResponse.json(
    {
      error: {
        code,
        message,
        fieldErrors: extra?.fieldErrors,
        requestId: 'msw-request',
      },
    },
    init,
  );
}

export const handlers = [
  http.post(/\/api\/auth\/otp\/request$/, async ({ request }) => {
    const body = (await request.json().catch(() => null)) as {
      email?: unknown;
      consentPdn?: unknown;
      consentVersion?: unknown;
    } | null;
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const consentPdn = body?.consentPdn === true;
    const consentVersion = typeof body?.consentVersion === 'string' ? body.consentVersion : '';
    if (!email || !email.includes('@')) {
      return errorJson(422, 'VALIDATION', 'Проверьте поля формы', {
        fieldErrors: { email: ['Укажите рабочий email'] },
      });
    }
    if (!consentPdn) {
      return errorJson(422, 'VALIDATION', 'Проверьте поля формы', {
        fieldErrors: { consentPdn: ['Нужно согласие на обработку персональных данных'] },
      });
    }
    const result = requestOtp(email, consentVersion);
    if (!result.ok) {
      return errorJson(429, 'RATE_LIMITED', 'Слишком много запросов кода. Подождите.', {
        retryAfterSec: result.retryAfterSec,
      });
    }
    return HttpResponse.json({ expiresInSec: result.expiresInSec });
  }),

  http.post(/\/api\/auth\/otp\/verify$/, async ({ request }) => {
    const body = (await request.json().catch(() => null)) as { email?: unknown; code?: unknown } | null;
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const code = typeof body?.code === 'string' ? body.code : '';
    if (!email || !code) {
      return errorJson(422, 'VALIDATION', 'Проверьте поля формы');
    }
    const result = verifyOtp(email, code);
    if (!result.ok) {
      if (result.code === 'RATE_LIMITED') {
        return errorJson(429, 'RATE_LIMITED', result.message ?? 'Слишком много попыток.', {
          retryAfterSec: result.retryAfterSec ?? 60,
        });
      }
      return errorJson(400, 'INVALID_CODE', result.message ?? 'Неверный код');
    }
    return HttpResponse.json({ viewer: result.viewer });
  }),

  http.post(/\/api\/auth\/logout$/, ({ cookies }) => {
    clearSession(cookies.pmfk_session);
    return HttpResponse.json({ ok: true });
  }),

  http.get(/\/api\/me$/, ({ cookies }) => {
    const viewer = getViewerByToken(cookies.pmfk_session);
    if (!viewer) {
      return errorJson(401, 'UNAUTHENTICATED', 'Сессия недействительна');
    }
    return HttpResponse.json(viewer);
  }),
];
