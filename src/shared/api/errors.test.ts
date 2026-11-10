import { describe, expect, it } from 'vitest';
import { apiErrorFromResponse, isApiError, ApiError } from './errors';

describe('ApiError', () => {
  it('parses JSON error payload and Retry-After', () => {
    const error = apiErrorFromResponse(
      429,
      { error: { code: 'RATE_LIMITED', message: 'Подождите', requestId: 'abc' } },
      '12',
    );
    expect(isApiError(error)).toBe(true);
    expect(error.status).toBe(429);
    expect(error.code).toBe('RATE_LIMITED');
    expect(error.retryAfterSec).toBe(12);
    expect(error.requestId).toBe('abc');
  });

  it('falls back when body is empty', () => {
    const error = apiErrorFromResponse(500, null, null);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.code).toBe('UNKNOWN');
  });
});
