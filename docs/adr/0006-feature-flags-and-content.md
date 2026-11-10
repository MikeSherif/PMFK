# ADR 0006 — Feature flags and content

## Context

Макет полный empty states: спикеры, партнёры, билеты, адрес, слоты встреч.

## Decision

Флаги в `shared/config/flags.ts` из env. Тексты лендинга — типизированные объекты `pages/landing/content/*`, не строки в JSX. Включение сетки/расписания не требует правки вёрстки.

## Consequences

Сохраняем состояния RC3 (не «придумываем»). Переключение через `.env`.
