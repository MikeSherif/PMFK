'use client';

import { useEffect, useState } from 'react';
import { getWsStatus, subscribeWsStatus } from '@/shared/api';

export function useWsStatus() {
  const [status, setStatus] = useState(getWsStatus);

  useEffect(() => subscribeWsStatus(setStatus), []);

  return status;
}
