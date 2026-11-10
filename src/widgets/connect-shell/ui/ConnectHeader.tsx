'use client';

import Link from 'next/link';
import { flags, links, routes } from '@/shared/config';
import { AppLink } from '@/shared/lib';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Logo } from '@/shared/ui/logo';
import { useLogout } from '@/features/auth-by-email';
import { shellCopy } from '../model/content';

type ConnectHeaderProps = {
  showLogout?: boolean;
};

export function ConnectHeader({ showLogout = false }: ConnectHeaderProps) {
  const logout = useLogout();

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6">
      <Link href={showLogout ? routes.connect.feed : routes.connect.login} className="flex items-center gap-3">
        <Logo withWordmark size="sm" />
        <span className="text-sm text-text-muted">| {shellCopy.product}</span>
      </Link>
      <div className="flex flex-wrap items-center gap-2">
        {flags.demoMode ? <Badge tone="demo">{shellCopy.demo}</Badge> : null}
        <Button asChild size="sm">
          <AppLink href={links.tickets}>{shellCopy.tickets}</AppLink>
        </Button>
        <Button asChild size="sm" variant="ghost">
          <Link href={routes.home}>{shellCopy.site}</Link>
        </Button>
        {showLogout ? (
          <Button
            size="sm"
            variant="secondary"
            loading={logout.isPending}
            onClick={() => logout.mutate()}
          >
            {shellCopy.logout}
          </Button>
        ) : null}
      </div>
    </header>
  );
}
