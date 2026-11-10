# ADR 0001 — FSD + Next.js App Router

## Context

Нужен публичный SSG-лендинг и закрытая платформа CONNECT в одном репозитории. Next App Router держит `app/` в корне (не `src/app`), FSD — слои в `src/`.

## Decision

- Роуты Next лежат в корневом `app/`. Файлы там тонкие: `page.tsx` реэкспортирует страницу из `@/pages/*` и задаёт `metadata`.
- Код — в `src/{app,pages,widgets,features,entities,shared}`.
- Пустой `pages/README.md` блокирует Pages Router.
- Лендинг — один слайс `pages/landing`, секции не выносятся в widgets.
- Слой `processes` не нужен.
- Границы проверяют Steiger и `eslint-plugin-import`.

## Consequences

Два «app»: Next `app/` и FSD `src/app` (процессы). Это осознанно. Не класть бизнес-логику в корневой `app/`.

`fsd/insignificant-slice` ослаблен: часть CONNECT слайсов живёт по одному файлу и не должна раздуваться в pages.
