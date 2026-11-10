# ADR 0002 — State management

## Context

CONNECT тянет серверные данные, формы и точечный UI (модалки, сокет).

## Decision

- Серверное состояние — только TanStack Query v5, ключи и `queryOptions` на фабриках.
- URL — nuqs.
- Формы — RHF.
- Глобальное клиентское пока не тянем, если хватает React context (сессия, paywall). Zustand — только если context станет тесным, отдельным ADR.

## Consequences

Нет Redux. Сценарии живут в `features/*` и подписываются через `entities/*`.
