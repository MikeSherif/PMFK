# ADR 0007 — GitHub Pages static demo

## Context

Репозиторий деплоится из GitHub Actions на GitHub Pages. Pages отдаёт только статику: нет Node, BFF `app/api/*` и `httpOnly` cookie.

## Decision

- Docker и локальный `pnpm build` остаются `output: 'standalone'`.
- Сборка Pages (`GITHUB_PAGES=true`) — `output: 'export'`, `basePath` = имя репозитория, без `app/api` и middleware.
- CONNECT на Pages поднимает браузерный MSW и кладёт демо-сессию в обычный cookie по заголовку `x-pmfk-session`. Это только витрина, не production-модель из ADR 0003.
- Чат открывается как `/connect/conversation?matchId=`, чтобы маршрут был статическим.

## Consequences

Полноценный хостинг с cookie и API — Docker. URL витрины: `https://mikesherif.github.io/PMFK/`.
