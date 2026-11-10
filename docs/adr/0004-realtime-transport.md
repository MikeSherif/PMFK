# ADR 0004 — Realtime transport

## Context

В диалоге после мэтча нужны «живые сообщения», бэкенд сокета ещё нет.

## Decision

Единый вход в `useConversation(matchId)`. Базовый транспорт: polling 8 с по умолчанию, WebSocket — улучшение этапа 6 с reconnect, heartbeat и ticket-auth. Протокол WS-событий фиксированный.

## Consequences

UI чата не знает про канал доставки. Флаг `CONNECT_CHAT_ENABLED` включает сокет; иначе refetch.
