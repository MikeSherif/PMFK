'use client';

import { connectMessages } from '@/shared/config';
import { QueryError } from '@/shared/ui/query-error';

export default function ConnectError({ reset }: { reset: () => void }) {
  return (
    <QueryError title={connectMessages.loadError} retryLabel={connectMessages.retry} onRetry={reset} />
  );
}
