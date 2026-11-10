import type { Metadata } from 'next';
import { Arimo, Noto_Sans } from 'next/font/google';
import { AppProviders } from '@/app/providers';
import { siteMeta } from '@/shared/config/site-meta';
import '@/app/styles/globals.css';

const display = Arimo({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-display-family',
  display: 'swap',
  weight: ['400', '700'],
});

const body = Noto_Sans({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-body-family',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: siteMeta.title,
  description: siteMeta.description,
  openGraph: {
    title: siteMeta.title,
    description: siteMeta.description,
    locale: siteMeta.locale,
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
