'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib';
import { connectNav } from '../model/content';
import { NavIcon } from './NavIcon';

export function BottomNav() {
  const pathname = usePathname() ?? '';

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      aria-label="ПМФК CONNECT"
    >
      <ul className="grid grid-cols-6">
        {connectNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-[0.65rem]',
                  active ? 'text-accent' : 'text-text-muted',
                )}
              >
                <NavIcon name={item.icon} />
                {item.short}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
