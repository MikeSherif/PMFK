'use client';

import Script from 'next/script';
import { env } from '@/shared/config';
import { useCookieConsent } from './CookieBanner';

export function YandexMetrika() {
  const consent = useCookieConsent();
  const counterId = env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  const allowed = consent === 'all' && Boolean(counterId) && /^\d+$/.test(counterId ?? '');

  if (!allowed || !counterId) {
    return null;
  }

  const init = `ym(${counterId},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:false,ecommerce:false});`;

  return (
    <>
      <Script
        id="yandex-metrika"
        src="https://mc.yandex.ru/metrika/tag.js"
        strategy="afterInteractive"
      />
      <Script id="yandex-metrika-init" strategy="afterInteractive">
        {`window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments)};window.ym.l=+new Date();${init}`}
      </Script>
    </>
  );
}
