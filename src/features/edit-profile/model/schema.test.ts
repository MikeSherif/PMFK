import { describe, expect, it } from 'vitest';
import { emptyProfileForm, profileFormSchema } from './schema';

const valid = {
  ...emptyProfileForm,
  fullName: 'Анна (демо)',
  company: 'Маркетинговое агентство',
  role: 'Руководитель партнёрств',
  industry: 'Маркетинг и PR',
  lookingFor: 'Партнёрства FMCG и HoReCa',
  offering: 'Контент и комьюнити',
  tags: ['HoReCa'],
};

describe('profileFormSchema', () => {
  it('accepts a complete profile', () => {
    expect(profileFormSchema.safeParse(valid).success).toBe(true);
  });

  it('requires core fields and at least one tag', () => {
    expect(profileFormSchema.safeParse(emptyProfileForm).success).toBe(false);
    expect(profileFormSchema.safeParse({ ...valid, tags: [] }).success).toBe(false);
    expect(profileFormSchema.safeParse({ ...valid, tags: Array.from({ length: 9 }, (_, i) => `t${i}`) }).success).toBe(
      false,
    );
  });

  it('normalizes http(s) websites and rejects other protocols', () => {
    expect(profileFormSchema.parse({ ...valid, website: 'example.com' }).website).toBe('https://example.com/');
    expect(profileFormSchema.safeParse({ ...valid, website: 'javascript:alert(1)' }).success).toBe(false);
    expect(profileFormSchema.parse({ ...valid, website: '' }).website).toBe('');
  });
});
