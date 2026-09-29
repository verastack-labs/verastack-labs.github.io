import type { MetadataRoute } from 'next'
import { landingPages, landingUrl } from '@/data/landing-pages'
import { site } from '@/data/site'

export const dynamic = 'force-static'

// Crawlers only read robots.txt at the root, so it also points at the landing pages' own sitemaps.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: [`${site.url}/sitemap.xml`, ...landingPages.filter((p) => p.ownSitemap).map((p) => `${landingUrl(p)}sitemap.xml`)],
    host: site.url,
  }
}
