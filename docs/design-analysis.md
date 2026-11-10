# Design analysis — ПМФК 2026 RC3

Источники: `PMFK_2026_WEB_approval_RC3.pdf` (45 стр., 1440 px) и `PMFK_2026_MOBILE_approval_RC3.pdf` (53 стр., 390 px). Дата разбора 09.11.2026. Растровые фрагменты в `docs/design/ref/{web,mobile}/`.

Это скриншоты с локальной сборки макета, не исходник-фигма. CONNECT собран по тем же токенам.

---

## 1. Карта экранов

### 1.1. Публичный сайт форума — лендинг `/`

Один SSG-маршрут, 17 секций с якорями. В PDF длинные экраны нарезаны по вертикали.

| № | Секция | Якорь | Desktop (1440) | Mobile (390) | Примечания |
|---|---|---|---|---|---|
| 01 | Главный экран | `#hero` | 2 колонки: текстовый блок, орбита карточек | Заголовок + sticky CTA + якорные чипы 2×2 | Баг: sticky CTA перекрывает сноску |
| 02 | Проблема и идея | `#idea` | Заголовок + мок чата, низ punchline | Колонка | |
| 03 | Концепция | `#concept` | Заголовок + 3 карточки + punchline | Стопка карточек | |
| 04 | Для кого форум | `#audience` | Сетка 3×2 | 1 колонка | 6 ролей |
| 05 | ПМФК CONNECT | `#connect` | Текст + CTA слева, панель 3 шага справа | Стопка | |
| 06 | Спикеры | `#speakers` | Empty state в пунктире | То же | Флаг `SPEAKERS_PUBLISHED` |
| 07 | Форматы | `#formats` | 3 карточки с крупными иконками | Стопка | |
| 08 | Программа | `#program` | Карточка дня + 4 пункта | Стопка | Флаг `PROGRAM_PUBLISHED` |
| 09 | Нетворкинг | `#networking` | 4 колонки | 1 колонка | |
| 10 | Арт-центр Linda de La | `#venue` | 2+2 фото, кнопка маршрута disabled | Стопка фото | Флаг `ADDRESS_CONFIRMED` |
| 11 | Афтерпати | `#afterparty` | 2 карточки | Стопка | |
| 12 | Организаторы | `#organizers` | 2 карточки | Стопка | |
| 13 | Партнёры | `#partners` | Empty + CTA-карточка | Стопка | Флаг `PARTNERS_PUBLISHED` |
| 14 | Информационные партнёры | `#media` | Empty + CTA СМИ | Стопка | Флаг `MEDIA_PARTNERS_PUBLISHED` |
| 15 | Билеты | `#tickets` | Текст + наклонённая карточка-билет | Без карточки билета, CTA на всю ширину | Флаг `TICKET_SALES_OPEN` |
| 16 | FAQ | `#faq` | Аккордеон, в макете все открыты | Стопка | Делаем нормальный аккордеон, первый открыт |
| 17 | Контакты | `#contacts` | Текстовый блок + 2 CTA | Стопка | |

Ненавязчивая шапка и футер в макете нет. Добавляем минимальные header + footer в том же стиле (см. пробелы).

### 1.2. ПМФК CONNECT

Общий shell: знак «ПМФК | CONNECT», DEMO-бейдж, «Билеты ↗», «На сайт форума ↗», «Выйти». Янтарный баннер демо-режима. Desktop — левый сайдбар. Mobile — нижний таббар из 6 пунктов.

| № | Экран | Роут | Desktop | Mobile | Состояния |
|---|---|---|---|---|---|
| 01 | Вход и регистрация | `/connect/login` | Форма + 3 шага справа | Стопка | OTP-шаг в том же каркасе |
| 02 | Профиль и интересы | `/connect/profile` | Форма 2 кол. + статус справа | Стопка, статус ниже | draft / pending / approved / rejected |
| 03 | Лента знакомств | `/connect/feed` | Карточка + how-to справа | Карточка + sticky actions над таббаром | skip / save / interest; paywall |
| 04 | Paywall | модалка | Поверх ленты | Полноэкранный диалог | 403 TICKET_REQUIRED |
| 05 | Сохранённое | `/connect/saved` | Список карточек | Список | empty |
| 06 | Взаимные мэтчи | `/connect/matches` | Список | Список | empty |
| 07 | Диалог | `/connect/matches/[id]` | Шапка + лента | Стопка, поле над таббаром | polling-сообщения и сокет |
| 08 | Встречи | `/connect/meetings` | Плашка «не открыто» + empty | То же | Флаг `BOOKING_ENABLED` |
| 09 | Билет и права | `/connect/ticket` | 2 карточки + «Заказ не найден?» | Стопка | Нет доступа / доступ открыт |

Юридические страницы: `/privacy`, `/consent`, `/profile-publication` — в том же визуальном языке, что и оболочка CONNECT.

---

## 2. Токены (сэмпл с JPEG 2× / 1×)

Опорные кадры: `docs/design/ref/web/web_p003_0.jpeg` (hero), `web_p027_0.jpeg` (login), `web_p029_0.jpeg` (profile).

| Токен | Значение | Откуда |
|---|---|---|
| `--color-bg` | `#100018` | Основной фон экранов |
| `--color-bg-elevated` | `#180028` | Карточки CONNECT, модалки |
| `--color-bg-input` | `#14001C` | Поля ввода |
| `--color-surface` | `rgba(255,255,255,0.05)` | glass-панели |
| `--color-border` | `rgba(255,255,255,0.10)` | 1 px обводка карточек |
| `--color-accent` | `#FC5820` | Кнопки, CTA, оранжевая часть заголовков |
| `--color-accent-hover` | `#FF6A33` | +светлее для hover (нет в макете) |
| `--color-glow-purple` | `#5800E0` | Правый bloom hero |
| `--color-glow-coral` | `#CC403C` | Левый hero / низ |
| `--color-peach` | `#F2B48A` | eyebrow, второстепенные акценты |
| `--color-text` | `#FCFCFC` | Основной |
| `--color-text-muted` | `#C9B8D6` | Подписи (проверять контраст AA) |
| `--color-demo` | `#50300C` | Янтарный бейдж DEMO |
| `--color-online` | `#3DDC84` | Индикатор (нет в макете, системный) |
| `--color-danger` | `#E5484D` | Ошибки |
| `--radius-sm` | `12px` | Чипы, мелкие кнопки |
| `--radius-md` | `16px` | Поля |
| `--radius-lg` | `24px` | Карточки |
| `--radius-xl` | `32px` | Крупные панели, модал |
| `--radius-pill` | `9999px` | CTA |
| `--font-display` | Arimo | Крупные заголовки, капсом |
| `--font-body` | Noto Sans | Абзацы, UI |
| `--tracking-eyebrow` | `0.2em` | `01 / ИДЕЯ` |
| `--container` | `1160px` | Живая колонка на 1440 |
| `--gutter-mobile` | `20px` | 16–24 на глаз |
| Breakpoints | 640 / 768 / 1024 / 1280 / 1440 | Опорные кадры 390 и 1440 |

Градиенты:

- Hero: вертикальный градиент `#2A0546` → `#5800E0` + радиальный bloom по краям.
- Плашка-призыв («Хватит переписываться», вечер, контакты): линейный `#5B0FD1` → `#FC5820`.
- Glow кнопки: `0 8px 32px rgba(252, 88, 32, 0.45)`.

Крупные заголовки через `clamp()`; `text-transform: uppercase` на секционных шапках (не абзац в карточках), иначе переполнение узких контейнеров.

---

## 3. Переиспользуемые компоненты

См. `shared/ui`: Button, IconButton, Input, Textarea, Select, Checkbox, Field, TagToggle/TagGroup, Badge/StatusPill, Card, Modal, Accordion, Tabs, Toast, Skeleton, EmptyState, Avatar, Container, Section, SectionHeader, Heading, GlassPanel, BottomNav, SidebarNav, ChatBubble, ChatInput, OtpInput, Logo.

Лендинг-специфика (остаётся в `pages/landing`): HeroOrbit, ChatMock, TicketCard, StickyCta.

CONNECT-виджеты: ConnectShell, PaywallModal, ProfileCard, ChatPanel.

---

## 4. Пробелы макета и решения

| Пробел | Решение |
|---|---|
| Нет hover/focus/disabled | Система: accent-hover, `opacity-50` disabled, `outline 2px accent` focus-visible |
| Нет loading/empty/error CONNECT | Skeleton на время загрузки, EmptyState, inline/toast на сетевые ошибки |
| Нет экрана OTP | 6 цифр (`input-otp`), таймер 60 с, неверный код, лимит попыток |
| Нет confirm logout / delete | Modal в стиле paywall |
| Нет tablet 768–1024 | Лендинг: 2 колонки с 768, hero как десктоп с 1024. CONNECT: сайдбар с 1024, иначе таббар |
| Нет 404/500/legal | Оболочка в токенах, legal — заглушка «Текст подготовит юрист» |
| Нет тостов | sonner, тёмная тема |
| Нет статуса сокета чата | Базовый polling 8 с, WS как улучшение (`useConversation`) |
| Нет шапки лендинга | Лёгкий header: знак + якоря + CTA |
| CTA без URL | `mailto:` / `#` в `links.ts` |
| Нет OTP, тостеров, ошибок, оффлайн | Формы + empty states |

---

## 5. Баги макета (не повторяем)

1. Слово «ПРОФЕССИОНАЛЬНЫЕ / СООБЩЕСТВА» на узких экранах: `text-wrap: balance` + `clamp()`.
2. «НЕТ ДОСТУПА» наезжает на абзац в билете: line-height, не отрицательный отступ или leading.
3. Sticky CTA на hero режет сноску — запас снизу под высоту панели, `padding-bottom: sticky + safe-area`.
4. Панель действий ленты перекрывает карточку — `padding-bottom` = панель + таббар + safe-area.
5. Таб-бар и CTA учитывают safe-area в `env(safe-area-inset-bottom)` + `dvh`.
6. Капс-заголовки на 360 px через `clamp()` и перенос по словам, не по буквам.

---

## 6. Ассеты

Временные кропы площадки: `public/images/venue/{interior,entrance,ceiling,facade}.jpg` из PDF. Знак аппроксимирован SVG из четырёх 2×2 и вордмарк-текстом. Запросить оригиналы (см. `docs/assets-todo.md`).
