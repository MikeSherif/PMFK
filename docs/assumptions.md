# Assumptions

Фиксируем по умолчанию (раздел 16 промпта). Живые решения — в ADR.

1. **Бэкенд нет.** Работаем через BFF `app/api/*` и in-memory mock DB. Ожидаемый контракт — `docs/api-contract.md`, адрес API — `NEXT_PUBLIC_API_URL`.
2. **Сессия** — `httpOnly` cookie, доступная только через BFF `app/api/*`.
3. **Чат** — сначала polling 8 с; WebSocket подключается на этапе 6 по флагу `CONNECT_CHAT_ENABLED`. Единый хук — `useConversation`.
4. **Билетный оператор** — ссылка «Билеты» из `links.ts`. Права доступа в `viewer.abilities`.
5. **Формы лендинга** (партнёр, пресса, спикер) — `mailto:` / `#`, без форм.
6. **Бронирование встреч** не реализуется в v1, только empty-экран и флаг `BOOKING_ENABLED`.
7. **Фото площадки и логотип** — временные кропы из PDF / SVG-аппроксимация.
8. **Юридические тексты** — заглушки.
9. **Хостинг** — Docker `standalone`, без Vercel-специфики.
10. **i18n не нужен**, строки не хардкодятся в JSX.
11. **Шрифты** — Arimo (display) + Noto Sans (body) с кириллическим subset `next/font/google`. Если заказчик даст файлы — заменим подключением.
12. **Tablet** — по брейкпоинтам сетки: 2 колонки с `md`, CONNECT sidebar с `lg`.
13. **Sentry и метрика** — подключаются только при наличии env; без ключей приложение стартует.
14. **exactOptionalPropertyTypes** включён; если конфликтует с типами Next — точечные правки и запись в ADR.
15. **Auth mocks:** браузерный MSW не выставляет httpOnly cookie, поэтому OTP/session живут в BFF `app/api/*` и in-memory store. MSW остаётся для Vitest. Демо-код `123456`.
