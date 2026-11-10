'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib';
import { connectNav, shellCopy } from '../model/content';
import { NavIcon } from './NavIcon';

export function SidebarNav() {
  const pathname = usePathname() ?? '';

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-bg-elevated/60 px-4 py-8 lg:flex">
      <p className="text-xs tracking-[0.2em] text-peach uppercase">{shellCopy.sidebarEyebrow}</p>
      <p className="font-display mt-3 text-[1.7rem] leading-[0.95] font-bold tracking-tight uppercase">
        {shellCopy.sidebarTitle}{' '}
        <span className="text-accent">{shellCopy.sidebarAccent}</span>
      </p>
      <nav className="mt-8 flex flex-col gap-1" aria-label="ПМФК CONNECT">
        {connectNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-11 items-center gap-3 rounded-pill px-4 py-2 text-sm',
                active ? 'bg-surface text-text' : 'text-text-muted hover:bg-surface/60 hover:text-text',
              )}
            >
              <span className={cn(active && 'text-accent')}>
                <NavIcon name={item.icon} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-border pt-6 text-sm text-text-muted">
        <p>{shellCopy.dateLine}</p>
        <p className="font-display mt-1 text-base tracking-tight text-text uppercase">{shellCopy.venue}</p>
        <p className="mt-2 text-pretty">{shellCopy.dateNote}</p>
      </div>
    </aside>
  );
}
