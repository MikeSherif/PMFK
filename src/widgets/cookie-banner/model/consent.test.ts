import { afterEach, describe, expect, it } from 'vitest';
import { COOKIE_CONSENT_KEY, readCookieConsent, writeCookieConsent } from './consent';

describe('cookie consent storage', () => {
  afterEach(() => {
    window.localStorage.removeItem(COOKIE_CONSENT_KEY);
  });

  it('reads only known consent values', () => {
    expect(readCookieConsent()).toBeNull();
    window.localStorage.setItem(COOKIE_CONSENT_KEY, 'other');
    expect(readCookieConsent()).toBeNull();
    writeCookieConsent('necessary');
    expect(readCookieConsent()).toBe('necessary');
    writeCookieConsent('all');
    expect(readCookieConsent()).toBe('all');
  });
});
