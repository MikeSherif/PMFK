import { describe, expect, it } from 'vitest';
import { emailStepSchema, otpStepSchema } from './schema';

describe('auth schemas', () => {
  it('requires a valid email and consent', () => {
    expect(emailStepSchema.safeParse({ email: 'not-an-email', consentPdn: true }).success).toBe(false);
    expect(emailStepSchema.safeParse({ email: 'anna@demo.ru', consentPdn: false }).success).toBe(false);
    expect(emailStepSchema.safeParse({ email: 'anna@demo.ru', consentPdn: true }).success).toBe(true);
  });

  it('accepts only a 6-digit OTP', () => {
    expect(otpStepSchema.safeParse({ code: '12345' }).success).toBe(false);
    expect(otpStepSchema.safeParse({ code: '123456' }).success).toBe(true);
  });
});
