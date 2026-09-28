import { products } from '@/data/products'
import { process } from '@/data/process'
import { services } from '@/data/services'
import { booking, site } from '@/data/site'
import { roleLabel, work } from '@/data/work'

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
        areaServed: 'Worldwide',
        knowsAbout: services.map((s) => s.name),
        makesOffer: [
          ...services.map((s) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: s.name, description: s.blurb, provider: { '@id': ids.studio } },
          })),
          ...products
            .filter((p) => p.status === 'live' && p.url)
            .map((p) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'SoftwareApplication', name: p.name, url: p.url, description: p.line },
            })),
        ],
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

// Ends a line with a full stop unless it already has one.
const stop = (text: string) => (/[.!?]$/.test(text) ? text : `${text}.`)

// /llms.txt (llmstxt.org): a plain-text brief for answer engines, built from the same data as the
// page so it never drifts from it.
export function llmsText(): string {
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `Founded by ${site.founderName} (${site.founderUrl}), based in ${site.basedIn}, working with clients anywhere.`,
    '',
    '## Services',
    '',
    ...services.map((s) => `- ${s.name}: ${s.blurb} See: ${s.proof.join('; ')}.`),
    '- Anything else that lives on a screen: just ask.',
    '',
    "## Our founder's client work",
    '',
    'Done by the founder personally, not under the studio name.',
    '',
    ...work.map((w) => {
      const when = [w.year, roleLabel(w.role)].filter(Boolean).join(', ')
      const status = w.status === 'launching' ? ' Built, launching soon.' : ''
      const links = [w.liveUrl && `Live: ${w.liveUrl}`, w.caseStudyUrl && `Case study: ${w.caseStudyUrl}`].filter(Boolean)
      return `- ${w.client}, ${w.project} (${when}): ${stop(w.summary)}${status}${links.length ? ` ${links.join('. ')}.` : ''}`
    }),
    '',
    '## Our own products',
    '',
    ...products.map((p) => `- ${p.name} (${p.platform}): ${p.line}${p.url ? ` ${p.url}` : ' Coming soon.'}`),
    '',
    '## How we work',
    '',
    ...process.steps.map((s, i) => `${i + 1}. ${s.name}: ${s.line}`),
    '',
    '## Contact',
    '',
    `- Start a project: ${site.url}/#contact`,
    ...(site.email ? [`- Email: ${site.email}`] : []),
    `- Book a 20-minute call: ${booking.href.startsWith('mailto:') ? `email ${site.email} with the subject "20-min call"` : booking.href}`,
    `- GitHub: ${site.githubUrl}`,
    '',
  ]
  return lines.join('\n')
}