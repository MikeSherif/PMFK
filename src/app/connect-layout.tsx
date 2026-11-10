import { type ReactNode } from 'react';
import { ConnectShell } from '@/widgets/connect-shell';
import { ConnectProviders } from './connect-providers';

export function ConnectAppLayout({ children }: { children: ReactNode }) {
  return (
    <ConnectProviders>
      <ConnectShell>{children}</ConnectShell>
    </ConnectProviders>
  );
}
