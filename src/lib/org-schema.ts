// The Organization markup generator (/tools/organization-schema): says who a company is, as a plain
// line for the page and as Organization JSON-LD linking its other profiles (sameAs), which is how a
// model tells it apart from namesakes. Pure functions shared with the tests.

export type OrgInput = {
  name: string
  // What the company does, for whom: "booking software for clinics".
  what: string
  url: string
  logo: string
  founded: string
  city: string
  country: string
  founders: string
  email: string
  profiles: string[]
}

export const blankOrg = (): OrgInput => ({ name: '', what: '', url: '', logo: '', founded: '', city: '', country: '', founders: '', email: '', profiles: [''] })

const PLATFORMS: [RegExp, string][] = [
  [/(^|\.)linkedin\.com$/, 'LinkedIn'],
  [/(^|\.)(x|twitter)\.com$/, 'X'],
  [/(^|\.)github\.com$/, 'GitHub'],
  [/(^|\.)crunchbase\.com$/, 'Crunchbase'],
  [/(^|\.)instagram\.com$/, 'Instagram'],
  [/(^|\.)youtube\.com$/, 'YouTube'],
  [/(^|\.)facebook\.com$/, 'Facebook'],
  [/(^|\.)wikipedia\.org$/, 'Wikipedia'],
  [/(^|\.)producthunt\.com$/, 'Product Hunt'],
  [/(^|\.)clutch\.co$/, 'Clutch'],
  [/(^|\.)ycombinator\.com$/, 'Y Combinator'],
  [/(^|\.)g2\.com$/, 'G2'],
]

const t = (s: string) => s.replace(/\s+/g, ' ').trim()

// The address as written, with https:// added if it is missing; null when it is not a web address.
export function webAddress(raw: string): string | null {
  const s = t(raw)
  if (!s) return null
  try {
    const u = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`)
    return u.hostname.includes('.') ? u.href.replace(/\/$/, '') : null
  } catch {
    return null
  }
}

export function platform(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return PLATFORMS.find(([re]) => re.test(host))?.[1] ?? null
  } catch {
    return null
  }
}

const profilesOf = (o: OrgInput) => [...new Set(o.profiles.map(webAddress).filter((u): u is string => !!u))]

// The line for the page: who you are, what you do, since when and where.
export function aboutSentence(o: OrgInput): string {
  const name = t(o.name) || 'Your company'
  const what = t(o.what).replace(/\.$/, '')
  const place = [t(o.city), t(o.country)].filter(Boolean).join(', ')
  const since = /^\d{4}$/.test(t(o.founded)) ? `founded in ${t(o.founded)}` : ''
  const tail = [since, place && `based in ${place}`].filter(Boolean).join(' and ')
  return `${name}${what ? ` makes ${what}` : ' is …'}${tail ? `, ${tail}` : ''}.`
}

export function orgJsonLd(o: OrgInput): string {
  const url = webAddress(o.url)
  const logo = webAddress(o.logo)
  const founders = t(o.founders)
    .split(',')
    .map(t)
    .filter(Boolean)
  const place = t(o.city) || t(o.country)
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t(o.name),
    ...(url ? { url } : {}),
    ...(logo ? { logo } : {}),
    ...(t(o.what) ? { description: aboutSentence(o) } : {}),
    ...(/^\d{4}$/.test(t(o.founded)) ? { foundingDate: t(o.founded) } : {}),
    ...(place ? { address: { '@type': 'PostalAddress', ...(t(o.city) ? { addressLocality: t(o.city) } : {}), ...(t(o.country) ? { addressCountry: t(o.country) } : {}) } } : {}),
    ...(founders.length ? { founder: founders.map((name) => ({ '@type': 'Person', name })) } : {}),
    ...(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t(o.email)) ? { contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: t(o.email) } } : {}),
    ...(profilesOf(o).length ? { sameAs: profilesOf(o) } : {}),
  }
  const json = JSON.stringify(data, null, 2).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">\n${json}\n</script>`
}

export function orgNotes(o: OrgInput): string[] {
  const notes: string[] = []
  if (!t(o.name)) notes.push('Add the company name.')
  if (!t(o.what)) notes.push('Say what you make and for whom, in a few words.')
  if (!webAddress(o.url)) notes.push('Add your website address.')
  if (!webAddress(o.logo)) notes.push('Add the full address of your logo image (square works best).')
  const given = o.profiles.map(t).filter(Boolean)
  if (given.some((p) => !webAddress(p))) notes.push('One of the profile links is not a web address.')
  if (profilesOf(o).length < 2) notes.push('Link at least two other profiles (LinkedIn, X, GitHub, Crunchbase): they help engines tell you apart from namesakes.')
  return notes
}
