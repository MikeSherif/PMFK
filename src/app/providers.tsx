'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { type ReactNode, useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { flags } from '@/shared/config';
import { CookieBannerProvider, YandexMetrika } from '@/widgets/cookie-banner';
import { createQueryClient } from './query-client';

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());
  const [mocksReady, setMocksReady] = useState(!flags.githubPages);

  useEffect(() => {
    if (!flags.githubPages) {
      return;
    }
    void import('@/shared/api').then(({ enableMocking }) =>
      enableMocking().then(() => setMocksReady(true)),
    );
  }, []);

  if (!mocksReady) {
    return <div className="bg-bg min-h-dvh" />;
  }

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <CookieBannerProvider>
          {children}
          <YandexMetrika />
        </CookieBannerProvider>
        <Toaster theme="dark" position="top-center" />
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
