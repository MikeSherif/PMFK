import { flags } from '@/shared/config';
import {
  clearSession,
  deleteAccount,
  getFeed,
  getMatch,
  getSaved,
  getViewerByToken,
  issueWsTicket,
  listMatches,
  listMeetings,
  listMessages,
  postMessage,
  requestOtp,
  saveProfile,
  sendInterest,
  skipProfile,
  unsaveProfile,
  updateProfile,
  verifyOtp,
} from './db';

export type MockHttpResult = {
  status: number;
  body: unknown;
  headers: Headers;
};

export function isStaticDemoApi() {
  if (flags.githubPages) {
    return true;
  }
  if (typeof window !== 'undefined' && /\.github\.io$/i.test(window.location.hostname)) {
    return true;
  }
  return false;
}

export function mockResultToResponse(result: MockHttpResult): Response {
  return new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: result.headers,
  });
}

export function handleMockRequest(input: {
  method: string;
  path: string;
  body: unknown;
  token: string | undefined;
}): MockHttpResult {
  const method = input.method.toUpperCase();
  const { pathname, searchParams } = splitPath(input.path);

  if (method === 'POST' && pathname === '/auth/otp/request') {
    return requestOtpRoute(input.body);
  }
  if (method === 'POST' && pathname === '/auth/otp/verify') {
    return verifyOtpRoute(input.body);
  }
  if (method === 'POST' && pathname === '/auth/logout') {
    clearSession(input.token);
    return ok({ ok: true });
  }
  if (method === 'DELETE' && pathname === '/auth/account') {
    return deleteAccountRoute(input.token, input.body);
  }
  if (method === 'GET' && pathname === '/me') {
    return withViewer(input.token, (viewer) => ok(viewer));
  }
  if (method === 'GET' && pathname === '/me/profile') {
    return withViewer(input.token, (viewer) => ok(viewer.profile));
  }
  if (method === 'PUT' && pathname === '/me/profile') {
    return updateProfileRoute(input.token, input.body);
  }
  if (method === 'GET' && pathname === '/me/saved') {
    return withViewer(input.token, (viewer) => ok({ items: getSaved(viewer.id) }));
  }
  if (method === 'GET' && pathname === '/profiles/feed') {
    return withViewer(input.token, (viewer) => {
      const cursor = searchParams.get('cursor');
      return ok(cursor ? getFeed(viewer.id, cursor) : getFeed(viewer.id));
    });
  }

  const profileAction = pathname.match(/^\/profiles\/([^/]+)\/(skip|save|interest)$/);
  if (profileAction) {
    const id = profileAction[1] ?? '';
    const action = profileAction[2];
    if (method === 'POST' && action === 'skip') {
      return withViewer(input.token, (viewer) => {
        const result = skipProfile(viewer.id, id);
        return result.ok ? ok({ ok: true }) : fail(404, 'NOT_FOUND', 'Профиль не найден');
      });
    }
    if (method === 'POST' && action === 'save') {
      return withViewer(input.token, (viewer) => {
        const result = saveProfile(viewer.id, id);
        return result.ok ? ok(result.profile) : fail(404, 'NOT_FOUND', 'Профиль не найден');
      });
    }
    if (method === 'DELETE' && action === 'save') {
      return withViewer(input.token, (viewer) => {
        const result = unsaveProfile(viewer.id, id);
        return result.ok ? ok(result.profile) : fail(404, 'NOT_FOUND', 'Профиль не найден');
      });
    }
    if (method === 'POST' && action === 'interest') {
      return withViewer(input.token, (viewer) => {
        const result = sendInterest(viewer.id, id, viewer.abilities.canSendInterest);
        if (!result.ok && result.code === 'TICKET_REQUIRED') {
          return fail(403, 'TICKET_REQUIRED', 'Эта возможность доступна по билету с бренд-дейтингом.');
        }
        if (!result.ok) {
          return fail(404, 'NOT_FOUND', 'Профиль не найден');
        }
        return ok({ ok: true, match: result.match });
      });
    }
  }

  const matchMessages = pathname.match(/^\/matches\/([^/]+)\/messages$/);
  if (matchMessages) {
    const id = matchMessages[1] ?? '';
    if (method === 'GET') {
      return withViewer(input.token, (viewer) => {
        const cursor = searchParams.get('cursor');
        const page = cursor ? listMessages(viewer.id, id, cursor) : listMessages(viewer.id, id);
        return page ? ok(page) : fail(404, 'NOT_FOUND', 'Мэтч не найден');
      });
    }
    if (method === 'POST') {
      return postMessageRoute(input.token, id, input.body);
    }
  }

  const matchItem = pathname.match(/^\/matches\/([^/]+)$/);
  if (method === 'GET' && matchItem) {
    return withViewer(input.token, (viewer) => {
      const match = getMatch(viewer.id, matchItem[1] ?? '');
      return match ? ok(match) : fail(404, 'NOT_FOUND', 'Мэтч не найден');
    });
  }
  if (method === 'GET' && pathname === '/matches') {
    return withViewer(input.token, (viewer) => ok({ items: listMatches(viewer.id) }));
  }
  if (method === 'POST' && pathname === '/ws-ticket') {
    return withViewer(input.token, (viewer) => ok({ ticket: issueWsTicket(viewer.id) }));
  }
  if (method === 'GET' && pathname === '/meetings') {
    return withViewer(input.token, (viewer) => ok({ items: listMeetings(viewer.id) }));
  }

  return fail(404, 'NOT_FOUND', 'Маршрут не найден');
}

function splitPath(raw: string) {
  const url = new URL(raw, 'https://pmfk.local');
  let pathname = url.pathname;
  const apiIndex = pathname.indexOf('/api/');
  if (apiIndex >= 0) {
    pathname = pathname.slice(apiIndex + 4);
  }
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }
  return { pathname, searchParams: url.searchParams };
}

function ok(body: unknown, extraHeaders?: Record<string, string>): MockHttpResult {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (extraHeaders) {
    for (const [key, value] of Object.entries(extraHeaders)) {
      headers.set(key, value);
    }
  }
  return { status: 200, body, headers };
}

function fail(
  status: number,
  code: string,
  message: string,
  extra?: { fieldErrors?: Record<string, string[]>; retryAfterSec?: number },
): MockHttpResult {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (extra?.retryAfterSec !== undefined) {
    headers.set('Retry-After', String(extra.retryAfterSec));
  }
  const error: {
    code: string;
    message: string;
    requestId: string;
    fieldErrors?: Record<string, string[]>;
  } = {
    code,
    message,
    requestId: 'mock-request',
  };
  if (extra?.fieldErrors) {
    error.fieldErrors = extra.fieldErrors;
  }
  return { status, body: { error }, headers };
}

function withViewer(
  token: string | undefined,
  run: (viewer: NonNullable<ReturnType<typeof getViewerByToken>>) => MockHttpResult,
) {
  const viewer = getViewerByToken(token);
  if (!viewer) {
    return fail(401, 'UNAUTHENTICATED', 'Сессия недействительна');
  }
  return run(viewer);
}

function requestOtpRoute(body: unknown) {
  const payload = asRecord(body);
  const email = typeof payload?.email === 'string' ? payload.email.trim() : '';
  const consentPdn = payload?.consentPdn === true;
  const consentVersion = typeof payload?.consentVersion === 'string' ? payload.consentVersion : '';
  if (!email || !email.includes('@')) {
    return fail(422, 'VALIDATION', 'Проверьте поля формы', {
      fieldErrors: { email: ['Укажите рабочий email'] },
    });
  }
  if (!consentPdn) {
    return fail(422, 'VALIDATION', 'Проверьте поля формы', {
      fieldErrors: { consentPdn: ['Нужно согласие на обработку персональных данных'] },
    });
  }
  const result = requestOtp(email, consentVersion);
  if (!result.ok) {
    return fail(429, 'RATE_LIMITED', 'Слишком много запросов кода. Подождите.', {
      retryAfterSec: result.retryAfterSec,
    });
  }
  return ok({ expiresInSec: result.expiresInSec });
}

function verifyOtpRoute(body: unknown) {
  const payload = asRecord(body);
  const email = typeof payload?.email === 'string' ? payload.email.trim() : '';
  const code = typeof payload?.code === 'string' ? payload.code : '';
  if (!email || !code) {
    return fail(422, 'VALIDATION', 'Проверьте поля формы');
  }
  const result = verifyOtp(email, code);
  if (!result.ok) {
    if (result.code === 'RATE_LIMITED') {
      return fail(429, 'RATE_LIMITED', result.message ?? 'Слишком много попыток.', {
        retryAfterSec: result.retryAfterSec ?? 60,
      });
    }
    return fail(400, 'INVALID_CODE', result.message ?? 'Неверный код');
  }
  return ok({ viewer: result.viewer }, { 'x-pmfk-session': result.token });
}

function deleteAccountRoute(token: string | undefined, body: unknown) {
  const payload = asRecord(body);
  if (payload?.confirm !== true) {
    return fail(422, 'VALIDATION', 'Подтвердите удаление аккаунта');
  }
  if (!deleteAccount(token)) {
    return fail(401, 'UNAUTHENTICATED', 'Сессия недействительна');
  }
  return ok({ ok: true });
}

function updateProfileRoute(token: string | undefined, body: unknown) {
  return withViewer(token, (viewer) => {
    const payload = asRecord(body);
    if (
      typeof payload?.fullName !== 'string' ||
      typeof payload.company !== 'string' ||
      typeof payload.role !== 'string' ||
      typeof payload.industry !== 'string'
    ) {
      return fail(422, 'VALIDATION', 'Проверьте поля формы');
    }
    const next = updateProfile(viewer.id, {
      fullName: payload.fullName,
      company: payload.company,
      role: payload.role,
      industry: payload.industry,
      city: typeof payload.city === 'string' ? payload.city : '',
      website: typeof payload.website === 'string' ? payload.website : '',
      lookingFor: typeof payload.lookingFor === 'string' ? payload.lookingFor : '',
      offering: typeof payload.offering === 'string' ? payload.offering : '',
      tags: Array.isArray(payload.tags) ? payload.tags.filter((tag): tag is string => typeof tag === 'string') : [],
      catalogConsent: payload.catalogConsent === true,
      publishConsent: payload.publishConsent === true,
    });
    return ok(next?.profile ?? null);
  });
}

function postMessageRoute(token: string | undefined, matchId: string, body: unknown) {
  return withViewer(token, (viewer) => {
    const payload = asRecord(body);
    const text = typeof payload?.text === 'string' ? payload.text : '';
    const clientId = typeof payload?.clientId === 'string' ? payload.clientId : '';
    const result = postMessage(viewer.id, matchId, { text, clientId }, viewer.abilities.canChat);
    if (!result.ok && result.code === 'TICKET_REQUIRED') {
      return fail(403, 'TICKET_REQUIRED', 'Эта возможность доступна по билету с бренд-дейтингом.');
    }
    if (!result.ok) {
      return fail(result.code === 'VALIDATION' ? 422 : 404, result.code, 'Не удалось отправить сообщение');
    }
    return ok(result.message);
  });
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  return value as Record<string, unknown>;
}
