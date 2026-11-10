import { http, HttpResponse } from 'msw';
import {
  clearSession,
  deleteAccount,
  getFeed,
  getSaved,
  getViewerByToken,
  requestOtp,
  saveProfile,
  sendInterest,
  skipProfile,
  unsaveProfile,
  updateProfile,
  verifyOtp,
} from '../mock/db';

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

  http.get(/\/api\/me\/profile$/, ({ cookies }) => {
    const viewer = getViewerByToken(cookies.pmfk_session);
    if (!viewer) {
      return errorJson(401, 'UNAUTHENTICATED', 'Сессия недействительна');
    }
    return HttpResponse.json(viewer.profile);
  }),

  http.put(/\/api\/me\/profile$/, async ({ cookies, request }) => {
    const viewer = getViewerByToken(cookies.pmfk_session);
    if (!viewer) {
      return errorJson(401, 'UNAUTHENTICATED', 'Сессия недействительна');
    }
    const body = (await request.json().catch(() => null)) as {
      fullName?: string;
      company?: string;
      role?: string;
      industry?: string;
      city?: string;
      website?: string;
      lookingFor?: string;
      offering?: string;
      tags?: string[];
      catalogConsent?: boolean;
      publishConsent?: boolean;
    } | null;
    if (!body?.fullName || !body.company || !body.role || !body.industry) {
      return errorJson(422, 'VALIDATION', 'Проверьте поля формы');
    }
    const next = updateProfile(viewer.id, {
      fullName: body.fullName,
      company: body.company,
      role: body.role,
      industry: body.industry,
      city: body.city ?? '',
      website: body.website ?? '',
      lookingFor: body.lookingFor ?? '',
      offering: body.offering ?? '',
      tags: body.tags ?? [],
      catalogConsent: body.catalogConsent === true,
      publishConsent: body.publishConsent === true,
    });
    return HttpResponse.json(next?.profile);
  }),

  http.delete(/\/api\/auth\/account$/, async ({ cookies, request }) => {
    const body = (await request.json().catch(() => null)) as { confirm?: unknown } | null;
    if (body?.confirm !== true) {
      return errorJson(422, 'VALIDATION', 'Подтвердите удаление аккаунта');
    }
    if (!deleteAccount(cookies.pmfk_session)) {
      return errorJson(401, 'UNAUTHENTICATED', 'Сессия недействительна');
    }
    return HttpResponse.json({ ok: true });
  }),

  http.get(/\/api\/profiles\/feed$/, ({ cookies, request }) => {
    const viewer = getViewerByToken(cookies.pmfk_session);
    if (!viewer) {
      return errorJson(401, 'UNAUTHENTICATED', 'Сессия недействительна');
    }
    const cursor = new URL(request.url).searchParams.get('cursor');
    return HttpResponse.json(cursor ? getFeed(viewer.id, cursor) : getFeed(viewer.id));
  }),

  http.get(/\/api\/me\/saved$/, ({ cookies }) => {
    const viewer = getViewerByToken(cookies.pmfk_session);
    if (!viewer) {
      return errorJson(401, 'UNAUTHENTICATED', 'Сессия недействительна');
    }
    return HttpResponse.json({ items: getSaved(viewer.id) });
  }),

  http.post(/\/api\/profiles\/(?<id>[^/]+)\/skip$/, ({ cookies, params }) => {
    const viewer = getViewerByToken(cookies.pmfk_session);
    if (!viewer) {
      return errorJson(401, 'UNAUTHENTICATED', 'Сессия недействительна');
    }
    const id = String(params.id ?? '');
    const result = skipProfile(viewer.id, id);
    if (!result.ok) {
      return errorJson(404, 'NOT_FOUND', 'Профиль не найден');
    }
    return HttpResponse.json({ ok: true });
  }),

  http.post(/\/api\/profiles\/(?<id>[^/]+)\/save$/, ({ cookies, params }) => {
    const viewer = getViewerByToken(cookies.pmfk_session);
    if (!viewer) {
      return errorJson(401, 'UNAUTHENTICATED', 'Сессия недействительна');
    }
    const id = String(params.id ?? '');
    const result = saveProfile(viewer.id, id);
    if (!result.ok) {
      return errorJson(404, 'NOT_FOUND', 'Профиль не найден');
    }
    return HttpResponse.json(result.profile);
  }),

  http.delete(/\/api\/profiles\/(?<id>[^/]+)\/save$/, ({ cookies, params }) => {
    const viewer = getViewerByToken(cookies.pmfk_session);
    if (!viewer) {
      return errorJson(401, 'UNAUTHENTICATED', 'Сессия недействительна');
    }
    const id = String(params.id ?? '');
    const result = unsaveProfile(viewer.id, id);
    if (!result.ok) {
      return errorJson(404, 'NOT_FOUND', 'Профиль не найден');
    }
    return HttpResponse.json(result.profile);
  }),

  http.post(/\/api\/profiles\/(?<id>[^/]+)\/interest$/, ({ cookies, params }) => {
    const viewer = getViewerByToken(cookies.pmfk_session);
    if (!viewer) {
      return errorJson(401, 'UNAUTHENTICATED', 'Сессия недействительна');
    }
    const id = String(params.id ?? '');
    const result = sendInterest(viewer.id, id, viewer.abilities.canSendInterest);
    if (!result.ok && result.code === 'TICKET_REQUIRED') {
      return errorJson(403, 'TICKET_REQUIRED', 'Эта возможность доступна по билету с бренд-дейтингом.');
    }
    if (!result.ok) {
      return errorJson(404, 'NOT_FOUND', 'Профиль не найден');
    }
    return HttpResponse.json({ ok: true });
  }),
];
