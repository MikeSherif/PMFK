import type { MetadataRoute } from 'next';
import { env } from '@/shared/config/env';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const connect = `${env.NEXT_PUBLIC_BASE_PATH ?? ''}/connect`;
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: [connect] },
    ],
    sitemap: `${env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  };
}
