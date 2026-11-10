'use client';

import Link from 'next/link';
import { useState } from 'react';
import { routes } from '@/shared/config';
import { AppLink } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { Logo } from '@/shared/ui/logo';
import { Container } from '@/shared/ui/container';

const nav = [
  { href: routes.anchors.program, label: 'Программа' },
  { href: routes.anchors.connect, label: 'CONNECT' },
  { href: routes.anchors.venue, label: 'Площадка' },
  { href: routes.anchors.tickets, label: 'Билеты' },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href={routes.home} className="shrink-0" aria-label="ПМФК — на главную">
          <Logo withWordmark size="sm" />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Разделы форума">
          {nav.map((item) => (
            <AppLink key={item.href} href={item.href} className="text-sm text-text-muted hover:text-text">
              {item.label}
            </AppLink>
          ))}
        </nav>
        <div className="hidden lg:block">
          <Button asChild size="sm">
            <AppLink href={routes.anchors.tickets}>Билеты и участие ↗</AppLink>
          </Button>
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Меню</span>
          <span aria-hidden className="text-xl">
            {open ? '×' : '☰'}
          </span>
        </button>
      </Container>
      {open ? (
        <div id="mobile-nav" className="border-t border-border bg-bg-elevated lg:hidden">
          <Container className="flex flex-col gap-3 py-4">
            {nav.map((item) => (
              <AppLink
                key={item.href}
                href={item.href}
                className="py-2 text-text"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </AppLink>
            ))}
            <Button asChild fullWidth>
              <AppLink href={routes.anchors.tickets}>Билеты и участие ↗</AppLink>
            </Button>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
