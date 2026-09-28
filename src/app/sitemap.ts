import type { MetadataRoute } from 'next'
import { site } from '@/data/site'

export const dynamic = 'force-static'

// One page for now (spec 3). Work and product pages join here when they become routes.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${site.url}/`, changeFrequency: 'monthly', priority: 1 }]
}
