'use client';

import { connectMessages } from '@/shared/config';
import { useOnlineStatus } from '@/shared/lib';

export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) {
    return null;
  }

  return (
    <p className="bg-danger px-4 py-2 text-center text-xs text-text" role="status" aria-live="polite">
      {connectMessages.offline}
    </p>
  );
}
