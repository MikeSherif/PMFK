import { DEMO_OTP_CODE, OTP_MAX_ATTEMPTS, OTP_RESEND_SEC, OTP_TTL_SEC } from '@/shared/config';
import type { ViewerDto } from '../dto/viewer';

type OtpRecord = {
  email: string;
  code: string;
  expiresAt: number;
  attempts: number;
  lastRequestAt: number;
  consentVersion: string;
};

type SessionRecord = {
  token: string;
  userId: string;
};

type MockDb = {
  otps: Map<string, OtpRecord>;
  sessions: Map<string, SessionRecord>;
  users: Map<string, ViewerDto>;
};

const globalKey = '__pmfkMockDb' as const;

function createDb(): MockDb {
  return {
    otps: new Map(),
    sessions: new Map(),
    users: new Map(),
  };
}

function getDb(): MockDb {
  const g = globalThis as typeof globalThis & { [globalKey]?: MockDb };
  g[globalKey] ??= createDb();
  return g[globalKey];
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function createDemoViewer(id: string, email: string): ViewerDto {
  return {
    id,
    email,
    abilities: { canSendInterest: false, canChat: false, canBook: false },
    ticket: { status: 'none', label: 'Нет доступа' },
    profile: {
      status: 'approved',
      fullName: 'Анна (демо)',
      company: 'Маркетинговое агентство · тест',
      role: 'Руководитель партнёрств',
      industry: 'Маркетинг и PR',
      city: 'Москва',
      website: '',
      lookingFor: 'Партнёрства FMCG и HoReCa для совместных проектов.',
      offering: 'Контент, комьюнити и организацию промоакций.',
      tags: ['Кросс-промо', 'Совместный продукт', 'HoReCa'],
      catalogConsent: true,
      publishConsent: true,
    },
  };
}

export function requestOtp(emailRaw: string, consentVersion: string) {
  const email = normalizeEmail(emailRaw);
  const db = getDb();
  const now = Date.now();
  const existing = db.otps.get(email);
  if (existing && now - existing.lastRequestAt < OTP_RESEND_SEC * 1000) {
    const retryAfterSec = Math.ceil((OTP_RESEND_SEC * 1000 - (now - existing.lastRequestAt)) / 1000);
    return { ok: false as const, code: 'RATE_LIMITED', retryAfterSec };
  }

  db.otps.set(email, {
    email,
    code: DEMO_OTP_CODE,
    expiresAt: now + OTP_TTL_SEC * 1000,
    attempts: 0,
    lastRequestAt: now,
    consentVersion,
  });

  return { ok: true as const, expiresInSec: OTP_TTL_SEC };
}

export function verifyOtp(emailRaw: string, code: string) {
  const email = normalizeEmail(emailRaw);
  const db = getDb();
  const record = db.otps.get(email);
  const now = Date.now();

  if (!record || record.expiresAt < now) {
    return { ok: false as const, code: 'INVALID_CODE', message: 'Код истёк. Запросите новый.' };
  }
  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    return { ok: false as const, code: 'RATE_LIMITED', retryAfterSec: OTP_RESEND_SEC, message: 'Слишком много попыток.' };
  }
  if (record.code !== code.trim()) {
    record.attempts += 1;
    const left = OTP_MAX_ATTEMPTS - record.attempts;
    return {
      ok: false as const,
      code: 'INVALID_CODE',
      message: left > 0 ? `Неверный код. Осталось попыток: ${left}.` : 'Слишком много попыток.',
    };
  }

  db.otps.delete(email);
  let user = [...db.users.values()].find((item) => item.email === email);
  if (!user) {
    user = createDemoViewer(crypto.randomUUID(), email);
    db.users.set(user.id, user);
  }
  const token = crypto.randomUUID();
  db.sessions.set(token, { token, userId: user.id });
  return { ok: true as const, token, viewer: user };
}

export function getViewerByToken(token: string | undefined) {
  if (!token) {
    return null;
  }
  const db = getDb();
  const session = db.sessions.get(token);
  if (!session) {
    return null;
  }
  return db.users.get(session.userId) ?? null;
}

export function clearSession(token: string | undefined) {
  if (!token) {
    return;
  }
  getDb().sessions.delete(token);
}

export function resetMockDb() {
  const g = globalThis as typeof globalThis & { [globalKey]?: MockDb };
  g[globalKey] = createDb();
}

export function updateViewer(userId: string, patch: Partial<ViewerDto['profile']> & { abilities?: ViewerDto['abilities']; ticket?: ViewerDto['ticket'] }) {
  const db = getDb();
  const current = db.users.get(userId);
  if (!current) {
    return null;
  }
  const next: ViewerDto = {
    ...current,
    abilities: patch.abilities ?? current.abilities,
    ticket: patch.ticket ?? current.ticket,
    profile: { ...current.profile, ...patch },
  };
  db.users.set(userId, next);
  return next;
}
