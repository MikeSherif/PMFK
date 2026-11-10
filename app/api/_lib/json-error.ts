import { NextResponse } from 'next/server';
import type { ApiFieldErrors } from '@/shared/api/errors';

export function jsonError(
  status: number,
  code: string,
  message: string,
  extra?: { fieldErrors?: ApiFieldErrors; retryAfterSec?: number },
) {
  const headers = new Headers();
  if (extra?.retryAfterSec !== undefined) {
    headers.set('Retry-After', String(extra.retryAfterSec));
  }
  return NextResponse.json(
    {
      error: {
        code,
        message,
        fieldErrors: extra?.fieldErrors,
        requestId: crypto.randomUUID(),
      },
    },
    { status, headers },
  );
}
