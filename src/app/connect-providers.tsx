'use client';

import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { registerApiListeners } from '@/shared/api';
import { routes } from '@/shared/config';
import { PaywallModal } from '@/widgets/paywall-modal';

export function ConnectProviders({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [paywallOpen, setPaywallOpen] = useState(false);

  useEffect(() => {
    return registerApiListeners({
      onUnauthorized: () => {
        const current = pathname ?? routes.connect.feed;
        const next = current.startsWith('/connect') ? current : routes.connect.feed;
        router.replace(`${routes.connect.login}?next=${encodeURIComponent(next)}` as Route);
      },
      onTicketRequired: () => setPaywallOpen(true),
      onRateLimit: (retryAfterSec) => {
        toast.error(`Слишком много запросов. Повторите через ${retryAfterSec} с.`);
      },
      onServerError: () => {
        toast.error('Сервис временно недоступен. Попробуйте позже.');
      },
    });
  }, [pathname, router]);

  return (
    <>
      {children}
      <PaywallModal open={paywallOpen} onOpenChange={setPaywallOpen} />
    </>
  );
}
