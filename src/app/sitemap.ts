import type { MetadataRoute } from 'next'
import { site } from '@/data/site'

export const dynamic = 'force-static'

// The studio's own pages only: a sitemap may only list URLs on its own host, and each product
// lives on its own subdomain with its own sitemap. Work and product pages join here when they
// become routes.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${site.url}/`, changeFrequency: 'monthly', priority: 1 }]
}
