# ADR 0005 — Design tokens and UI kit

## Context

Figma нет. Есть PDF-скриншоты и палитра пикселей.

## Decision

Токены в `src/shared/styles/tokens.css` через Tailwind v4 `@theme`. Примитивы `shared/ui` — Radix + CVA, без MUI/shadcn-kit. Тексты не хардкодим в JSX. Логотип — временный SVG.

## Consequences

Смена палитры — правка одного файла. Pixel-perfect не цель, цель — узнаваемый кадр по RC3.
