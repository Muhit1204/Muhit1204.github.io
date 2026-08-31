import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/** Generated to out/sitemap.xml at build time by the static export. */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/education`, changeFrequency: 'yearly', priority: 0.6 },
  ];
}
