'use client';

import Link from 'next/link';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { routes } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { cookieCopy } from '../model/content';
import { type CookieConsent, readCookieConsent, writeCookieConsent } from '../model/consent';

const CookieConsentContext = createContext<CookieConsent | null>(null);

export function useCookieConsent() {
  return useContext(CookieConsentContext);
}

export function CookieBannerProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(readCookieConsent());
    setReady(true);
  }, []);

  function choose(next: CookieConsent) {
    writeCookieConsent(next);
    setConsent(next);
  }

  return (
    <CookieConsentContext.Provider value={consent}>
      {children}
      {ready && consent === null ? (
        <div
          className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] md:bottom-6 md:px-6 md:pb-0"
          role="dialog"
          aria-labelledby="cookie-banner-title"
        >
          <div className="glass mx-auto flex max-w-3xl flex-col gap-4 rounded-lg p-4 shadow-lg md:flex-row md:items-center">
            <div className="flex-1">
              <p id="cookie-banner-title" className="font-display text-sm font-bold tracking-wide uppercase">
                {cookieCopy.title}
              </p>
              <p className="mt-1 text-sm text-pretty text-text-muted">
                {cookieCopy.body}{' '}
                <Link href={routes.privacy} className="text-accent underline-offset-4 hover:underline">
                  {cookieCopy.privacy}
                </Link>
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" size="sm" onClick={() => choose('all')}>
                {cookieCopy.accept}
              </Button>
              <Button type="button" size="sm" variant="secondary" onClick={() => choose('necessary')}>
                {cookieCopy.necessary}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </CookieConsentContext.Provider>
  );
}
