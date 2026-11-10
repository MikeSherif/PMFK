import { beforeEach, describe, expect, it } from 'vitest';
import { DEMO_OTP_CODE } from '@/shared/config';
import { resetMockDb } from './db';
import { handleMockRequest } from './handle-request';

describe('static demo API', () => {
  beforeEach(() => {
    resetMockDb();
  });

  it('issues an OTP without a network POST', () => {
    const result = handleMockRequest({
      method: 'POST',
      path: '/auth/otp/request',
      body: { email: 'anna@demo.ru', consentPdn: true, consentVersion: '2026-11-09' },
      token: undefined,
    });
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ expiresInSec: 300 });
  });

  it('verifies the demo code and returns a session header', () => {
    handleMockRequest({
      method: 'POST',
      path: '/PMFK/api/auth/otp/request',
      body: { email: 'ticket@demo.ru', consentPdn: true, consentVersion: '2026-11-09' },
      token: undefined,
    });
    const verified = handleMockRequest({
      method: 'POST',
      path: '/api/auth/otp/verify/',
      body: { email: 'ticket@demo.ru', code: DEMO_OTP_CODE },
      token: undefined,
    });
    expect(verified.status).toBe(200);
    expect(verified.headers.get('x-pmfk-session')).toBeTruthy();
  });
});
