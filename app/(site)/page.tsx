import type { Metadata } from 'next';
import { LandingPage } from '@/pages/landing';
import { siteMeta } from '@/shared/config/site-meta';

export const metadata: Metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
};

export default LandingPage;
