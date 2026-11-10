import { routes } from '@/shared/config';

export const heroContent = {
  eyebrow: 'Москва / 10 декабря 2026',
  title: 'ПМФК',
  titleLine: 'Первый московский',
  titleAccent: 'форум коллабораций',
  subtitle: 'Партнёры для совместных проектов. Знакомства начинаются ещё до форума.',
  chips: [
    { label: '10 декабря 2026' },
    { label: 'Арт-центр Linda de La, Москва' },
  ],
  primaryCta: { label: 'Билеты и участие', href: routes.anchors.tickets },
  secondaryCta: { label: 'Найти партнёров', href: routes.connect.login },
  footnote: '10 декабря встречаемся лично. До форума — знакомимся через ПМФК CONNECT.',
  mobileAnchors: [
    { label: 'Бизнес', href: routes.anchors.idea },
    { label: 'Партнёрства', href: routes.anchors.partners },
    { label: 'Нетворкинг', href: routes.anchors.networking },
    { label: 'Афтерпати', href: routes.anchors.afterparty },
  ],
  orbitCaption: 'От переписки к действию',
  orbitCards: [
    { kicker: 'Есть идея', title: 'Найдём партнёра?' },
    { kicker: 'Есть контакт', title: 'Давайте обсудим!' },
    { kicker: 'Есть проект', title: 'Мы запускаемся' },
  ],
} as const;
