'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { type ReactNode, useState } from 'react';
import { Toaster } from 'sonner';
import { createQueryClient } from './query-client';

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster theme="dark" position="top-center" />
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
