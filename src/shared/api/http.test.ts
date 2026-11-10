import { afterEach, describe, expect, it, vi } from 'vitest';
import { http } from './http';
import { isStaticDemoApi } from './mock/handle-request';
import { resetMockDb } from './mock/db';

vi.mock('./mock/handle-request', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./mock/handle-request')>();
  return {
    ...actual,
    isStaticDemoApi: vi.fn(actual.isStaticDemoApi),
  };
});

describe('http client', () => {
  afterEach(() => {
    vi.mocked(isStaticDemoApi).mockReset();
    vi.mocked(isStaticDemoApi).mockImplementation(() => false);
    vi.unstubAllGlobals();
    resetMockDb();
  });

  it('parses JSON success payloads', async () => {
    vi.mocked(isStaticDemoApi).mockReturnValue(false);
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ expiresInSec: 300 }), { headers: { 'content-type': 'application/json' } })),
    );
    await expect(http.post<{ expiresInSec: number }>('/auth/otp/request', { email: 'a@b.c' })).resolves.toEqual({
      expiresInSec: 300,
    });
  });

  it('does not POST OTP to GitHub Pages', async () => {
    vi.mocked(isStaticDemoApi).mockReturnValue(true);
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(
      http.post<{ expiresInSec: number }>('/auth/otp/request', {
        email: 'anna@demo.ru',
        consentPdn: true,
        consentVersion: '2026-11-09',
      }),
    ).resolves.toEqual({ expiresInSec: 300 });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
