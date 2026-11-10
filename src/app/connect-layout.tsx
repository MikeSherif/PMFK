import { type ReactNode } from 'react';
import { ConnectRealtime } from '@/widgets/connect-realtime';
import { ConnectShell } from '@/widgets/connect-shell';
import { ConnectProviders } from './connect-providers';

export function ConnectAppLayout({ children }: { children: ReactNode }) {
  return (
    <ConnectProviders>
      <ConnectRealtime />
      <ConnectShell>{children}</ConnectShell>
    </ConnectProviders>
  );
}
