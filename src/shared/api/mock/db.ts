import { DEMO_OTP_CODE, OTP_MAX_ATTEMPTS, OTP_RESEND_SEC, OTP_TTL_SEC } from '@/shared/config';
import type { CatalogProfileDto, FeedPageDto } from '../dto/catalog';
import type { MatchDto, MatchPeerDto, MessageDto, MessagesPageDto } from '../dto/match';
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

type CatalogRecord = Omit<CatalogProfileDto, 'saved'>;

type MatchRecord = {
  id: string;
  userId: string;
  peer: MatchPeerDto;
  createdAt: number;
};

type MessageRecord = {
  id: string;
  matchId: string;
  authorId: string;
  text: string;
  createdAt: number;
  clientId: string;
};

type MockDb = {
  otps: Map<string, OtpRecord>;
  sessions: Map<string, SessionRecord>;
  users: Map<string, ViewerDto>;
  catalog: CatalogRecord[];
  saved: Map<string, Set<string>>;
  skipped: Map<string, Set<string>>;
  interests: Map<string, Set<string>>;
  matches: MatchRecord[];
  messages: MessageRecord[];
};

const globalKey = '__pmfkMockDb' as const;

function seedCatalog(): CatalogRecord[] {
  return [
    {
      id: 'catalog-igor',
      fullName: 'Игорь Соколов',
      company: 'FMCG-бренд',
      role: 'Бренд-директор',
      industry: 'FMCG',
      city: 'Москва',
      lookingFor: 'Коллаборации с HoReCa и ритейлом для запуска лимитированных линейек.',
      offering: 'Дистрибуцию, продакшн упаковки и совместные промомеханики.',
      tags: ['FMCG', 'Кросс-промо', 'Ритейл'],
      about: 'Ищу партнёров с сильной витриной и понятной аудиторией 25–45.',
    },
    {
      id: 'catalog-maria',
      fullName: 'Мария Левина',
      company: 'Сеть кофеен',
      role: 'Руководитель маркетинга',
      industry: 'HoReCa',
      city: 'Санкт-Петербург',
      lookingFor: 'Бренды для сезонных коллабораций и pop-up в кофейнях.',
      offering: 'Точки контакта с гостями, контент с площадок и дегустации.',
      tags: ['HoReCa', 'Совместный продукт', 'Креатив'],
      about: 'Готова тестировать форматы на 3–5 точках до масштабирования.',
    },
    {
      id: 'catalog-dmitry',
      fullName: 'Дмитрий Орлов',
      company: 'Ритейл-сеть',
      role: 'Директор по партнёрствам',
      industry: 'Ритейл',
      city: 'Москва',
      lookingFor: 'Локальные бренды и медиа для совместных полок и контента.',
      offering: 'Выкладку, CRM-рассылки и доступ к программе лояльности.',
      tags: ['Ритейл', 'CRM', 'Медиа'],
      about: 'Интересны пилоты на 4–6 недель с измеримым результатом.',
    },
  ];
}

function createDb(): MockDb {
  return {
    otps: new Map(),
    sessions: new Map(),
    users: new Map(),
    catalog: seedCatalog(),
    saved: new Map(),
    skipped: new Map(),
    interests: new Map(),
    matches: [],
    messages: [],
  };
}

function getDb(): MockDb {
  const g = globalThis as typeof globalThis & { [globalKey]?: MockDb };
  g[globalKey] ??= createDb();
  const db = g[globalKey];
  db.catalog ??= seedCatalog();
  db.saved ??= new Map();
  db.skipped ??= new Map();
  db.interests ??= new Map();
  db.matches ??= [];
  db.messages ??= [];
  return db;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function createDemoViewer(id: string, email: string): ViewerDto {
  const withTicket = email === 'ticket@demo.ru';
  return {
    id,
    email,
    abilities: {
      canSendInterest: withTicket,
      canChat: withTicket,
      canBook: withTicket,
    },
    ticket: withTicket
      ? { status: 'active', label: 'Доступ открыт' }
      : { status: 'none', label: 'Нет доступа' },
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
      publishConsent: false,
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
  if (user.abilities.canChat) {
    ensureDemoMatch(user.id);
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

const SUBSTANTIAL_KEYS = ['fullName', 'company', 'role', 'industry', 'lookingFor', 'offering'] as const;

function tagsChanged(current: string[], next: string[]) {
  if (current.length !== next.length) {
    return true;
  }
  return current.some((tag, index) => tag !== next[index]);
}

export function updateProfile(userId: string, input: Omit<ViewerDto['profile'], 'status'>) {
  const db = getDb();
  const current = db.users.get(userId);
  if (!current) {
    return null;
  }
  const substantialChanged =
    SUBSTANTIAL_KEYS.some((key) => current.profile[key] !== input[key]) ||
    tagsChanged(current.profile.tags, input.tags);
  const status =
    current.profile.status === 'draft' || substantialChanged ? 'pending' : current.profile.status;
  const next: ViewerDto = {
    ...current,
    profile: { ...input, status },
  };
  db.users.set(userId, next);
  return next;
}

export function deleteAccount(token: string | undefined) {
  if (!token) {
    return false;
  }
  const db = getDb();
  const session = db.sessions.get(token);
  if (!session) {
    return false;
  }
  db.users.delete(session.userId);
  for (const [sessionToken, record] of db.sessions) {
    if (record.userId === session.userId) {
      db.sessions.delete(sessionToken);
    }
  }
  return true;
}

function userSet(store: Map<string, Set<string>>, userId: string) {
  const current = store.get(userId) ?? new Set<string>();
  store.set(userId, current);
  return current;
}

function toCatalogDto(card: CatalogRecord, saved: boolean): CatalogProfileDto {
  return { ...card, saved };
}

function visibleCatalog(userId: string) {
  const db = getDb();
  const skipped = db.skipped.get(userId) ?? new Set<string>();
  return db.catalog.filter((card) => !skipped.has(card.id));
}

export function getFeed(userId: string, cursor?: string): FeedPageDto {
  const db = getDb();
  const saved = db.saved.get(userId) ?? new Set<string>();
  const all = visibleCatalog(userId);
  const pageSize = 20;
  const offset = cursor ? Number.parseInt(cursor, 10) || 0 : 0;
  const slice = all.slice(offset, offset + pageSize);
  const nextOffset = offset + pageSize;
  return {
    items: slice.map((card) => toCatalogDto(card, saved.has(card.id))),
    nextCursor: nextOffset < all.length ? String(nextOffset) : null,
    total: all.length,
  };
}

export function getSaved(userId: string): CatalogProfileDto[] {
  const db = getDb();
  const saved = db.saved.get(userId) ?? new Set<string>();
  return db.catalog.filter((card) => saved.has(card.id)).map((card) => toCatalogDto(card, true));
}

export function skipProfile(userId: string, profileId: string) {
  const card = getDb().catalog.find((item) => item.id === profileId);
  if (!card) {
    return { ok: false as const, code: 'NOT_FOUND' };
  }
  userSet(getDb().skipped, userId).add(profileId);
  return { ok: true as const };
}

export function saveProfile(userId: string, profileId: string) {
  const card = getDb().catalog.find((item) => item.id === profileId);
  if (!card) {
    return { ok: false as const, code: 'NOT_FOUND' };
  }
  userSet(getDb().saved, userId).add(profileId);
  return { ok: true as const, profile: toCatalogDto(card, true) };
}

export function unsaveProfile(userId: string, profileId: string) {
  const card = getDb().catalog.find((item) => item.id === profileId);
  if (!card) {
    return { ok: false as const, code: 'NOT_FOUND' };
  }
  userSet(getDb().saved, userId).delete(profileId);
  return { ok: true as const, profile: toCatalogDto(card, false) };
}

export function sendInterest(userId: string, profileId: string, canSendInterest: boolean) {
  if (!canSendInterest) {
    return { ok: false as const, code: 'TICKET_REQUIRED' };
  }
  const card = getDb().catalog.find((item) => item.id === profileId);
  if (!card) {
    return { ok: false as const, code: 'NOT_FOUND' };
  }
  userSet(getDb().interests, userId).add(profileId);
  userSet(getDb().skipped, userId).add(profileId);
  const match = upsertMatch(userId, toPeer(card));
  return { ok: true as const, match };
}

function toPeer(card: CatalogRecord): MatchPeerDto {
  return {
    id: card.id,
    fullName: card.fullName,
    company: card.company,
    role: card.role,
  };
}

function toMatchDto(record: MatchRecord): MatchDto {
  return {
    id: record.id,
    createdAt: new Date(record.createdAt).toISOString(),
    peer: record.peer,
  };
}

function toMessageDto(record: MessageRecord, userId: string): MessageDto {
  return {
    id: record.id,
    matchId: record.matchId,
    text: record.text,
    createdAt: new Date(record.createdAt).toISOString(),
    fromMe: record.authorId === userId,
    clientId: record.clientId,
  };
}

function upsertMatch(userId: string, peer: MatchPeerDto) {
  const db = getDb();
  const existing = db.matches.find((item) => item.userId === userId && item.peer.id === peer.id);
  if (existing) {
    return toMatchDto(existing);
  }
  const record: MatchRecord = {
    id: `match-${userId}-${peer.id}`,
    userId,
    peer,
    createdAt: Date.now(),
  };
  db.matches.push(record);
  return toMatchDto(record);
}

function ensureDemoMatch(userId: string) {
  const db = getDb();
  if (db.matches.some((item) => item.userId === userId)) {
    return;
  }
  const peer = db.catalog[1];
  if (!peer) {
    return;
  }
  const match = upsertMatch(userId, toPeer(peer));
  db.messages.push({
    id: crypto.randomUUID(),
    matchId: match.id,
    authorId: peer.id,
    text: 'Здравствуйте! Готовы обсудить коллаборацию на форуме.',
    createdAt: Date.now() - 60_000,
    clientId: crypto.randomUUID(),
  });
}

export function listMatches(userId: string): MatchDto[] {
  return getDb()
    .matches.filter((item) => item.userId === userId)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map(toMatchDto);
}

export function getMatch(userId: string, matchId: string) {
  const record = getDb().matches.find((item) => item.userId === userId && item.id === matchId);
  return record ? toMatchDto(record) : null;
}

export function listMessages(userId: string, matchId: string, cursor?: string): MessagesPageDto | null {
  if (!getMatch(userId, matchId)) {
    return null;
  }
  const all = getDb()
    .messages.filter((item) => item.matchId === matchId)
    .sort((a, b) => a.createdAt - b.createdAt);
  const pageSize = 30;
  if (!cursor) {
    const slice = all.slice(-pageSize);
    const hasOlder = all.length > slice.length;
    return {
      items: slice.map((item) => toMessageDto(item, userId)),
      nextCursor: hasOlder && slice[0] ? slice[0].id : null,
    };
  }
  const index = all.findIndex((item) => item.id === cursor);
  const older = index === -1 ? all : all.slice(0, index);
  const slice = older.slice(-pageSize);
  const hasOlder = older.length > slice.length;
  return {
    items: slice.map((item) => toMessageDto(item, userId)),
    nextCursor: hasOlder && slice[0] ? slice[0].id : null,
  };
}

export function postMessage(
  userId: string,
  matchId: string,
  input: { text: string; clientId: string },
  canChat: boolean,
) {
  if (!canChat) {
    return { ok: false as const, code: 'TICKET_REQUIRED' };
  }
  if (!getMatch(userId, matchId)) {
    return { ok: false as const, code: 'NOT_FOUND' };
  }
  const text = input.text.trim();
  if (text.length < 1 || text.length > 2000) {
    return { ok: false as const, code: 'VALIDATION' };
  }
  const db = getDb();
  const duplicate = db.messages.find((item) => item.matchId === matchId && item.clientId === input.clientId);
  if (duplicate) {
    return { ok: true as const, message: toMessageDto(duplicate, userId) };
  }
  const record: MessageRecord = {
    id: crypto.randomUUID(),
    matchId,
    authorId: userId,
    text,
    createdAt: Date.now(),
    clientId: input.clientId,
  };
  db.messages.push(record);
  return { ok: true as const, message: toMessageDto(record, userId) };
}

export function issueWsTicket(userId: string) {
  return `ws-${userId}-${crypto.randomUUID()}`;
}
