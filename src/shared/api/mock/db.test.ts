import { describe, expect, it } from 'vitest';
import { DEMO_OTP_CODE } from '@/shared/config';
import { getViewerByToken, requestOtp, verifyOtp } from './db';

describe('mock otp store', () => {
  it('issues a demo code and creates a session on verify', () => {
    const requested = requestOtp('anna@demo.ru', '2026-11-09');
    expect(requested.ok).toBe(true);

    const wrong = verifyOtp('anna@demo.ru', '000000');
    expect(wrong.ok).toBe(false);

    const verified = verifyOtp('anna@demo.ru', DEMO_OTP_CODE);
    expect(verified.ok).toBe(true);
    if (!verified.ok) {
      return;
    }
    const viewer = getViewerByToken(verified.token);
    expect(viewer?.email).toBe('anna@demo.ru');
    expect(viewer?.abilities.canSendInterest).toBe(false);
  });

  it('rejects expired or missing codes', () => {
    const result = verifyOtp('missing@demo.ru', DEMO_OTP_CODE);
    expect(result.ok).toBe(false);
  });
});
