'use client';

import { type ReactNode, useLayoutEffect, useState } from 'react';
import { toast } from 'sonner';
import { registerApiListeners } from '@/shared/api';
import { routes } from '@/shared/config';
import { stripBasePath, withBasePath } from '@/shared/lib';
import { PaywallModal } from '@/widgets/paywall-modal';

export function ConnectProviders({ children }: { children: ReactNode }) {
  const [paywallOpen, setPaywallOpen] = useState(false);

  useLayoutEffect(() => {
    return registerApiListeners({
      onUnauthorized: () => {
        if (typeof window === 'undefined') {
          return;
        }
        const current = stripBasePath(window.location.pathname);
        if (current.startsWith(routes.connect.login)) {
          return;
        }
        const next = current.startsWith('/connect') ? current : routes.connect.feed;
        window.location.replace(`${withBasePath(routes.connect.login)}?next=${encodeURIComponent(next)}`);
      },
      onTicketRequired: () => setPaywallOpen(true),
      onRateLimit: (retryAfterSec) => {
        toast.error(`Слишком много запросов. Повторите через ${retryAfterSec} с.`);
      },
      onServerError: () => {
        toast.error('Сервис временно недоступен. Попробуйте позже.');
      },
    });
  }, []);

  return (
    <>
      {children}
      <PaywallModal open={paywallOpen} onOpenChange={setPaywallOpen} />
    </>
  );
}
