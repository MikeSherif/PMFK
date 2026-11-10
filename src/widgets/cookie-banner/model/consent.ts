export const COOKIE_CONSENT_KEY = 'pmfk_cookie_consent';

export type CookieConsent = 'necessary' | 'all';

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  return value === 'necessary' || value === 'all' ? value : null;
}

export function writeCookieConsent(value: CookieConsent) {
  window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
}
