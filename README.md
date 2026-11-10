# ПМФК 2026 — фронтенд

Публичный сайт форума и платформа ПМФК CONNECT. Макеты: `PMFK_2026_WEB_approval_RC3.pdf` и `PMFK_2026_MOBILE_approval_RC3.pdf`.

## Стек

Next.js App Router, TypeScript strict, Tailwind v4, TanStack Query, RHF + Zod, FSD.

## Запуск

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Сайт: http://localhost:3000  
CONNECT (вход): http://localhost:3000/connect/login  
Storybook: `pnpm storybook`

Демо-вход (OTP `123456`):

- `anna@demo.ru` — просмотр ленты без билета (paywall на интерес, чат и встречи)
- `ticket@demo.ru` — полный доступ: интерес, мэтч с Марией, чат, статус «Доступ открыт»

`CONNECT_CHAT_ENABLED=false` по умолчанию: чат ходит polling каждые 8 с. WebSocket включается флагом.

## Скрипты

| Команда | Что делает |
|---|---|
| `pnpm dev` | dev-сервер |
| `pnpm build` | production-сборка |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint + Steiger |
| `pnpm test` | Vitest |
| `pnpm test:e2e` | Playwright |
| `pnpm storybook` | UI kit |

## Структура

- `app/` — тонкий App Router
- `src/pages` — страницы FSD (лендинг, legal, CONNECT)
- `src/widgets` — header/footer/shell
- `src/features` — сценарии CONNECT
- `src/entities` — домен
- `src/shared` — ui, api, config

Как добавить слайс: папка в нужном слое + `index.ts` с публичным API. Импорт только из `index.ts`.

Как добавить флаг: `src/shared/config/flags.ts` + переменная в `.env.example`.

CONNECT-экраны: `/connect/feed`, `/connect/saved`, `/connect/matches`, `/connect/meetings`, `/connect/profile`, `/connect/ticket`. Бронирование встреч — заглушка (`NEXT_PUBLIC_BOOKING_ENABLED`).

## Docker

```bash
docker compose up --build
```
