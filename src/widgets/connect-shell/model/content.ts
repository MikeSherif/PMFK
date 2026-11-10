import { routes } from '@/shared/config';

export const shellCopy = {
  product: 'CONNECT',
  demo: 'DEMO',
  tickets: 'Билеты ↗',
  site: 'На сайт форума ↗',
  logout: 'Выйти',
  demoBanner:
    'ДЕМО-РЕЖИМ: тестовая среда, регистрация и доступы только для локальных испытаний. Здесь нет реальных участников.',
  sidebarEyebrow: 'Встречайтесь со своими',
  sidebarTitle: 'От запроса',
  sidebarAccent: 'к партнёрству.',
  dateLine: '10 декабря 2026 · Москва',
  venue: 'LINDA DE LA',
  dateNote: 'Знакомство может начаться до форума.',
  skipToContent: 'К содержанию',
} as const;

export const connectNav = [
  { href: routes.connect.feed, label: 'Лента знакомств', short: 'Лента', icon: 'feed' },
  { href: routes.connect.saved, label: 'Сохранённое', short: 'Сохранено', icon: 'saved' },
  { href: routes.connect.matches, label: 'Мои мэтчи', short: 'Мэтчи', icon: 'matches' },
  { href: routes.connect.meetings, label: 'Мои встречи', short: 'Встречи', icon: 'meetings' },
  { href: routes.connect.profile, label: 'Мой профиль', short: 'Профиль', icon: 'profile' },
  { href: routes.connect.ticket, label: 'Мой билет', short: 'Билет', icon: 'ticket' },
] as const;

export type ConnectNavIcon = (typeof connectNav)[number]['icon'];
