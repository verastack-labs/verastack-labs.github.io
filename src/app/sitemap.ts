import type { MetadataRoute } from 'next'
import { landingPages, landingUrl } from '@/data/landing-pages'
import { site } from '@/data/site'

export const dynamic = 'force-static'

// The home page, then every product landing page on this origin. Work and product pages join here
// when they become routes.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, changeFrequency: 'monthly', priority: 1 },
    ...landingPages.map((p) => ({ url: landingUrl(p), changeFrequency: 'monthly' as const, priority: 0.8 })),
  ]
}
