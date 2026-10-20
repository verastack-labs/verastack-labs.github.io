import { faq } from '@/data/faq'
import { founder } from '@/data/founder'
import { mods, modsLicense } from '@/data/mods'
import { allPosts } from '@/lib/blog'
import { checker } from '@/data/ai-search-check'
import { products } from '@/data/products'
import { process } from '@/data/process'
import { services, tools } from '@/data/services'
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
        knowsAbout: [...services.map((s) => s.name), ...tools],
        makesOffer: [
          ...services.map((s) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: s.name, description: s.blurb, provider: { '@id': ids.studio } },
          })),
          ...products
            .filter((p) => p.status === 'live' && p.url)
            .map((p) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': p.kind === 'service' ? 'Service' : 'SoftwareApplication',
                name: p.name,
                url: p.url,
                description: p.line,
                ...(p.kind === 'service' ? { provider: { '@id': ids.studio } } : {}),
              },
            })),
          ...mods.map((m) => ({
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            itemOffered: {
              '@type': 'SoftwareApplication',
              name: m.name,
              url: m.repo,
              description: m.line,
              applicationCategory: 'DeveloperApplication',
              license: 'https://www.apache.org/licenses/LICENSE-2.0',
            },
          })),
        ],
      },
      {
        '@type': 'Person',
        '@id': ids.founder,
        name: site.founderName,
        url: `${site.url}${founder.path}/`,
        image: `${site.url}${founder.photo.src}`,
        jobTitle: 'Founder',
        worksFor: { '@id': ids.studio },
        sameAs: founder.sameAs,
      },
      { '@type': 'WebSite', '@id': ids.website, name: site.name, url: `${site.url}/`, publisher: { '@id': ids.studio } },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  }
}

// The studio as a standalone node, for pages other than home: who is behind the page, with a logo
// and links to its other profiles.
export function studioNode(): Node {
  return { '@type': 'Organization', '@id': ids.studio, name: site.name, url: `${site.url}/`, logo: `${site.url}/icon.svg`, sameAs: [site.githubUrl] }
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
    `Founded by ${site.founderName} (${site.url}${founder.path}/), based in ${site.basedIn}, working with clients anywhere.`,
    '',
    '## Key pages',
    '',
    `- [Home](${site.url}/): services, work, products and how we work`,
    `- [SaaS Launch Kit](${site.url}/launch-kit/): brand, launch site, launch film, AEO and GEO; 4 weeks, $9,500 fixed (25% off, $7,125, booked by 31 December 2026); a smaller Launch Site kit from $4,500`,
    `- [Free tools](${site.url}/tools/): free tools for launches and AI search`,
    `- [Free AEO and GEO check](${site.url}${checker.path}/): score a page for AI search`,
    `- [Free Organization schema generator](${site.url}/tools/organization-schema/): who your company is, with its profiles linked`,
    `- [What ChatGPT sees](${site.url}/tools/what-ai-sees/): a page the way AI crawlers read it, without JavaScript`,
    `- [Free product and service schema generator](${site.url}/tools/product-schema/): one sentence that says what you sell, and its structured data`,
    `- [Free FAQ schema generator](${site.url}/tools/faq-schema/): FAQPage structured data and HTML from your questions`,
    `- [Blog](${site.url}/blog/): notes on launches and AI search`,
    `- [The founder](${site.url}${founder.path}/): who you work with, on every call`,
    `- [Films](${site.url}/films/): the studio's 90-second film and the launch films and explainers we make`,
    `- [Start a project](${site.url}/#contact)`,
    '',
    '## Services',
    '',
    ...services.map((s) => `- ${s.name}: ${s.blurb} See: ${s.proof.join('; ')}.`),
    '- Anything else that lives on a screen: just ask.',
    '',
    `Tools: ${tools.join(', ')}.`,
    '',
    "## Our founder's client work",
    '',
    'Done by the founder personally, not under the studio name.',
    '',
    ...work.map((w) => {
      const when = [w.year, roleLabel(w.role)].filter(Boolean).join(', ')
      const status = w.status === 'launching' ? ' Built, launching soon.' : ''
      const links = [w.liveUrl && `Live: ${w.liveUrl}`, w.caseStudyUrl && `Case study: ${w.caseStudyUrl}`].filter(Boolean)
      const result = w.result ? ` ${stop(w.result)}` : ''
      const press = w.press?.length ? ` Press: ${w.press.map((p) => `${p.outlet} ${p.url}`).join('; ')}.` : ''
      return `- ${w.client}, ${w.project} (${when}): ${stop(w.summary)}${result}${status}${links.length ? ` ${links.join('. ')}.` : ''}${press}`
    }),
    '',
    '## Our own products',
    '',
    ...products.map((p) => {
      const soon = p.status === 'coming-soon' ? ' In development.' : ''
      return `- ${p.name} (${p.platform}): ${stop(p.line)}${soon}${p.url ? ` ${p.url}` : ''}`
    }),
    '',
    `## Open-source mods for Claude Code (${modsLicense})`,
    '',
    ...mods.map((m) => `- ${m.name}: ${stop(m.line)} ${m.repo}. Install: \`${m.install}\``),
    '',
    '## Free tools',
    '',
    `- AI search check: ${checker.description} ${site.url}${checker.path}/`,
    '',
    '## Notes from the blog',
    '',
    ...allPosts().map((p) => `- ${p.title} (${p.date}): ${stop(p.description)} ${site.url}/blog/${p.slug}/`),
    '',
    '## How we work',
    '',
    ...process.steps.map((s, i) => `${i + 1}. ${s.name}: ${s.line}`),
    '',
    '## Contact',
    '',
    `- Start a project: ${site.url}/#contact`,
    ...(site.email ? [`- Email: ${site.email}`] : []),
    `- Book a 30-minute call: ${booking.href.startsWith('mailto:') ? `email ${site.email} with the subject "30-min call"` : booking.href}`,
    `- GitHub: ${site.githubUrl}`,
    '',
  ]
  return lines.join('\n')
}