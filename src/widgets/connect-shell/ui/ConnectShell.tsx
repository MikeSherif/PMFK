'use client';

import { useQuery } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { Skeleton } from '@/shared/ui/skeleton';
import { viewerQuery } from '@/entities/viewer';
import { shellCopy } from '../model/content';
import { BottomNav } from './BottomNav';
import { ConnectHeader } from './ConnectHeader';
import { DemoBanner } from './DemoBanner';
import { SidebarNav } from './SidebarNav';

export function ConnectShell({ children }: { children: ReactNode }) {
  const viewer = useQuery(viewerQuery());

  return (
    <div className="flex min-h-dvh flex-col bg-mesh">
      <a
        href="#connect-main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-bg focus:px-4 focus:py-2"
      >
        {shellCopy.skipToContent}
      </a>
      <ConnectHeader showLogout />
      <DemoBanner />
      <div className="flex flex-1">
        <SidebarNav />
        <main id="connect-main" className="min-w-0 flex-1 px-4 py-8 pb-28 md:px-8 lg:pb-10">
          {viewer.isPending ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
