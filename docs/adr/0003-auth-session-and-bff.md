# ADR 0003 — Auth session and BFF

## Context

Passwordless OTP. Токен сессии не должен жить в JavaScript.

## Decision

Сессия в `httpOnly` cookie. Если API не тот же origin — проксируем на тонкий BFF `app/api/*`, чтобы браузер не отдавал токен в JS. Middleware закрывает `/connect/*` кроме `/connect/login` и ставит `X-Robots-Tag: noindex`. Abilities приходят с `/me`, UI проверяет `<Can>` и ловит paywall.

## Consequences

Клиент не хранит access token. Браузерный MSW не умеет Set-Cookie через весь lifecycle; в e2e и runtime живой BFF имитирует OTP.
