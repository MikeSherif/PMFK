import type { MetadataRoute } from 'next';
import { env } from '@/shared/config/env';
import { routes } from '@/shared/config/routes';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_APP_URL;
  return [
    { url: `${base}${routes.home}`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}${routes.privacy}`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}${routes.consent}`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}${routes.profilePublication}`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
