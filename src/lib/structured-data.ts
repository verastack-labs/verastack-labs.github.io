import { products } from '@/data/products'
import { services } from '@/data/services'
import { site } from '@/data/site'

type Node = Record<string, unknown>

const ids = {
  studio: `${site.url}/#organization`,
  website: `${site.url}/#website`,
  founder: `${site.url}/#founder`,
}

// Spec 9: Organization JSON-LD for the home page, with the founder and the studio's own products.
export function homeGraph(): Node {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ids.studio,
        name: site.name,
        url: `${site.url}/`,
        logo: `${site.url}/icon.svg`,
        description: site.description,
        ...(site.email ? { email: `mailto:${site.email}` } : {}),
        address: { '@type': 'PostalAddress', addressCountry: 'IN' },
        founder: { '@id': ids.founder },
        sameAs: [site.githubUrl],
        knowsAbout: services.map((s) => s.name),
        makesOffer: products
          .filter((p) => p.status === 'live' && p.url)
          .map((p) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'SoftwareApplication', name: p.name, url: p.url, description: p.line },
          })),
      },
      { '@type': 'Person', '@id': ids.founder, name: site.founderName, url: site.founderUrl },
      { '@type': 'WebSite', '@id': ids.website, name: site.name, url: `${site.url}/`, publisher: { '@id': ids.studio } },
    ],
  }
}

// Safe to drop into a <script> tag: no closing tag can appear inside it.
export function jsonLd(node: Node): string {
  return JSON.stringify(node).replace(/</g, '\\u003c')
}
