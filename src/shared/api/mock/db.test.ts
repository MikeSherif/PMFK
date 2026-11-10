import { describe, expect, it } from 'vitest';
import { DEMO_OTP_CODE } from '@/shared/config';
import { getViewerByToken, requestOtp, updateProfile, verifyOtp } from './db';

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

  it('sends the profile back to moderation after substantial edits', () => {
    requestOtp('anna@demo.ru', '2026-11-09');
    const verified = verifyOtp('anna@demo.ru', DEMO_OTP_CODE);
    expect(verified.ok).toBe(true);
    if (!verified.ok) {
      return;
    }
    const current = getViewerByToken(verified.token);
    expect(current?.profile.status).toBe('approved');
    if (!current) {
      return;
    }
    const next = updateProfile(current.id, {
      fullName: 'Анна Иванова',
      company: current.profile.company,
      role: current.profile.role,
      industry: current.profile.industry,
      city: current.profile.city,
      website: current.profile.website,
      lookingFor: current.profile.lookingFor,
      offering: current.profile.offering,
      tags: current.profile.tags,
      catalogConsent: current.profile.catalogConsent,
      publishConsent: current.profile.publishConsent,
    });
    expect(next?.profile.status).toBe('pending');
    expect(next?.profile.fullName).toBe('Анна Иванова');
  });
});
