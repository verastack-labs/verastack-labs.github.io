import type { MetadataRoute } from 'next'
import { site } from '@/data/site'
import { allPosts } from '@/lib/blog'

export const dynamic = 'force-static'

// The studio's own pages only: a sitemap may only list URLs on its own host, and each product
// lives on its own subdomain with its own sitemap. Work and product pages join here when they
// become routes. The page is rebuilt on every push to main, so the build time is when it last changed.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/blog/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ...allPosts().map((p) => ({ url: `${site.url}/blog/${p.slug}/`, lastModified: new Date(`${p.date}T00:00:00Z`), changeFrequency: 'yearly' as const, priority: 0.6 })),
  ]
}
