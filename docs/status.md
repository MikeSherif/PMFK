# Статус фронтенда ПМФК 2026

Краткий отчёт: что сделано, какой стек и контракт, что осталось.

## Что сделано

Фронтенд форума: публичный лендинг (17 секций, SSG) и платформа **ПМФК CONNECT** (вход, профиль, лента, сохранённое, мэтчи, чат, встречи-заглушка, билет и права доступа). Этапы 0–8 по коду закрыты.

Демо: OTP `123456`.

- `anna@demo.ru` — без билета, paywall на интерес / чат / встречи
- `ticket@demo.ru` — полный доступ, мэтч с Марией, чат
- любой `ticket+…@demo.ru` — тот же полный доступ (для чистых e2e)

Витрина GitHub Pages: https://mikesherif.github.io/PMFK/ (статика + браузерный MSW, не боевой сервер). Production-хостинг — Docker `standalone`.

## Стек

- Next.js 15 App Router, React 19, TypeScript `strict`
- Feature-Sliced Design (Steiger)
- Tailwind CSS v4, Radix UI, CVA
- TanStack Query v5, React Hook Form + Zod, nuqs
- Vitest, Playwright, Storybook, axe, Lighthouse CI
- Docker `output: 'standalone'`

## API и бэкенд

Живого бэкенда нет. Работает mock BFF `app/api/*` (in-memory store). Ожидаемый контракт: `docs/api-contract.md`. Адрес API: `NEXT_PUBLIC_API_URL`. Сессия — `httpOnly` cookie, `credentials: include`.

Формат ошибки:

```json
{ "error": { "code": "TICKET_REQUIRED", "message": "...", "fieldErrors": { "email": ["..."] }, "requestId": "..." } }
```

### REST

| Область | Эндпоинты |
|---|---|
| Auth | `POST /auth/otp/request`, `POST /auth/otp/verify`, `POST /auth/logout`, `DELETE /auth/account` |
| Viewer | `GET /me` → профиль, билет, `abilities`: `canSendInterest`, `canChat`, `canBook` |
| Профиль | `GET/PUT /me/profile` |
| Лента | `GET /profiles/feed`, skip / save / unsave, `POST /profiles/:id/interest` (403 `TICKET_REQUIRED` без билета) |
| Шорт-лист | `GET /me/saved` |
| Мэтчи и чат | `GET /matches`, `GET /matches/:id`, `GET/POST /matches/:id/messages` (`{ text, clientId }`) |
| Встречи | `GET /meetings` — в v1 всегда empty, флаг `BOOKING_ENABLED=false` |
| Билет | статус в `GET /me` (`ticket.status`, `ticket.label`) |

Статус профиля: `draft | pending | approved | rejected`.

### WebSocket

Клиент **есть** (reconnect, heartbeat, ticket-auth), по умолчанию **выключен**.

- `NEXT_PUBLIC_CONNECT_CHAT_ENABLED=false` (дефолт) — чат ходит **polling каждые 8 с**
- `true` — `POST /ws-ticket` → `{ ticket }`, затем `wss://…/ws?ticket=`

События сокета:

```ts
{ type: 'message.created', payload: MessageDto }
{ type: 'match.created', payload: MatchDto }
{ type: 'access.updated', payload: AccessDto }
```

UI чата один: хук `useConversation` (оптимистичная отправка с `clientId` и дедупликацией). Канал доставки для экрана прозрачен.

## Качество

- Unit / component (Vitest) и e2e (Playwright: лендинг, OTP, профиль, skip/save, paywall, чат)
- Axe на лендинге, логине и ленте — без critical/serious
- Lighthouse CI по лендингу: a11y / best practices / SEO ≥ 90 (error), performance ≥ 90 (warn)
- CI: Chromium, Firefox, WebKit
- CSP и security-заголовки; CONNECT с `noindex`

## Что осталось

### С заказчика / бэкенда

- живой API по контракту (или OpenAPI)
- финальный логотип и оригиналы фото Linda de La
- юридические тексты
- URL билетного оператора
- ключи Sentry и Яндекс Метрики

### Намеренно не в v1

- бронирование встреч
- формы лендинга (сейчас `mailto:` / `#`)
- i18n

### Доводка

- визуальная сверка с PDF на 390 и 1440 px, адаптив 768–1024
- Sentry со scrub персональных данных
- GitHub Pages — только витрина; боевой запуск — Docker
