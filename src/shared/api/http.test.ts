import { afterEach, describe, expect, it, vi } from 'vitest';
import { http } from './http';

describe('http client', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses JSON success payloads', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ expiresInSec: 300 }), { headers: { 'content-type': 'application/json' } })),
    );
    await expect(http.post<{ expiresInSec: number }>('/auth/otp/request', { email: 'a@b.c' })).resolves.toEqual({
      expiresInSec: 300,
    });
  });
});
