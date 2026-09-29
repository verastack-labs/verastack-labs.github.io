import { site } from '@/data/site'

export type LandingPage = {
  name: string
  // Served at site.url + path, from its own repo (verastack-labs/<name>).
  path: string
  // Publishes its own sitemap.xml, which robots.txt points at.
  ownSitemap: boolean
}

// Every landing page the studio serves on this origin. The studio's sitemap lists each one, so
// search engines find them from the root.
export const landingPages: LandingPage[] = [
  { name: 'Origan', path: '/origan/', ownSitemap: true },
  { name: 'rigseed', path: '/rigseed/', ownSitemap: false },
  { name: 'Riggit', path: '/riggit/', ownSitemap: true },
  { name: 'Mehfil', path: '/mehfil/', ownSitemap: false },
]

export const landingUrl = (page: LandingPage) => `${site.url}${page.path}`
