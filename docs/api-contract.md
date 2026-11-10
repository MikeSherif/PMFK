# API contract (expected)

Ожидаемый контракт для бэкенда CONNECT. Это REST + WS, согласуем с командой CONNECT. Базовый URL: `NEXT_PUBLIC_API_URL`. Cookie-сессия, `credentials: include`.

Ошибка: `{ "error": { "code": "TICKET_REQUIRED", "message": "...", "fieldErrors": { "email": ["..."] }, "requestId": "..." } }`.

## Auth

| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/auth/otp/request` | `{ email, consentPdn: true, consentVersion }` | 200 `{ expiresInSec }`; 429 retry-after |
| POST | `/auth/otp/verify` | `{ email, code }` | Set-Cookie; 400 INVALID_CODE; 429 |
| POST | `/auth/logout` | — | Clear cookie |
| DELETE | `/auth/account` | `{ confirm: true }` | Удаляет аккаунт |

## Viewer

| Method | Path | Notes |
|---|---|---|
| GET | `/me` | `{ id, email, profile, ticket, abilities }` |

`abilities`: `{ canSendInterest, canChat, canBook }`.

## Profile

| Method | Path | Notes |
|---|---|---|
| GET | `/me/profile` | Текущий профиль |
| PUT | `/me/profile` | upsert; существенные поля переводят в `pending` |
| GET | `/profiles/feed?cursor=` | Лента без себя |
| POST | `/profiles/:id/skip` | |
| POST | `/profiles/:id/save` | |
| DELETE | `/profiles/:id/save` | |
| POST | `/profiles/:id/interest` | 403 `TICKET_REQUIRED` без билета; 200 `{ ok, match }` |
| GET | `/me/saved` | Шорт-лист |

Статус профиля: `draft | pending | approved | rejected`.

## Matches & chat

| Method | Path | Notes |
|---|---|---|
| GET | `/matches` | Взаимные интересы |
| GET | `/matches/:id` | |
| GET | `/matches/:id/messages?cursor=` | infinite, newest last |
| POST | `/matches/:id/messages` | `{ text, clientId }` |

## Meetings

| Method | Path | Notes |
|---|---|---|
| GET | `/meetings` | v1: всегда empty, флаг `BOOKING_ENABLED=false` |

## Ticket

Статус билета в `GET /me` (`ticket.status`, `ticket.label`). Отдельный `GET /me/ticket` не обязателен.

## Realtime (этап 6)

`POST /ws-ticket` (BFF) → `{ ticket }`.  
`wss://…/ws?ticket=` события:

```ts
{ type: 'message.created', payload: MessageDto }
{ type: 'match.created', payload: MatchDto }
{ type: 'access.updated', payload: AccessDto }
```
