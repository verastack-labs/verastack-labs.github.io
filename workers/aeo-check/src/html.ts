// Reads what a crawler that does not run JavaScript sees in a page: the HTML the server sent.
// Regular expressions are enough here; the checker reports, it does not render.

export type PageFacts = {
  title: string | null
  description: string | null
  canonical: string | null
  robotsMeta: string | null
  lang: string | null
  h1Count: number
  h2Count: number
  // h2 and h3 headings phrased as questions, the shape answer engines lift.
  questionHeadings: number
  // Images with an alt attribute (an empty alt marks a decorative image, which is fine).
  images: { total: number; withAlt: number }
  words: number
  og: { title: boolean; description: boolean; image: boolean }
  // Every schema.org type found in the page's JSON-LD, including inside @graph.
  schemaTypes: string[]
  // The organisation behind the page, as its JSON-LD describes it.
  org: { found: boolean; logo: boolean; sameAs: number }
  // Every datePublished and dateModified in the JSON-LD.
  dates: string[]
  jsonLdBlocks: number
  jsonLdErrors: number
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

export function decode(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code: string) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : whole
    }
    return ENTITIES[code.toLowerCase()] ?? whole
  })
}

// Attributes of one tag, keys lower-cased. Handles double, single and unquoted values.
export function attributes(tag: string): Record<string, string> {
  const out: Record<string, string> = {}
  const re = /([^\s=<>/"']+)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g
  const inner = tag.replace(/^<\s*[a-z0-9-]+/i, '').replace(/\/?>$/, '')
  for (const m of inner.matchAll(re)) out[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? '')
  return out
}

const tags = (html: string, name: string) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((m) => attributes(m[0]))

const ORG_TYPES = ['Organization', 'Corporation', 'LocalBusiness', 'OnlineStore', 'Store', 'NGO', 'EducationalOrganization']

type Found = { types: Set<string>; org: PageFacts['org']; dates: string[] }

function typesOf(node: Record<string, unknown>): string[] {
  const value = node['@type']
  return (Array.isArray(value) ? value : [value])
    .filter((t): t is string => typeof t === 'string')
    .map((t) => t.replace(/^https?:\/\/schema\.org\//, ''))
}

function collect(node: unknown, into: Found) {
  if (Array.isArray(node)) {
    for (const item of node) collect(item, into)
    return
  }
  if (!node || typeof node !== 'object') return
  const obj = node as Record<string, unknown>
  const types = typesOf(obj)
  for (const t of types) into.types.add(t)
  if (types.some((t) => ORG_TYPES.includes(t))) {
    const sameAs = obj.sameAs
    into.org = {
      found: true,
      logo: into.org.logo || !!obj.logo,
      sameAs: Math.max(into.org.sameAs, Array.isArray(sameAs) ? sameAs.length : sameAs ? 1 : 0),
    }
  }
  for (const key of ['dateModified', 'datePublished']) if (typeof obj[key] === 'string') into.dates.push(obj[key] as string)
  for (const [key, value] of Object.entries(obj)) if (key !== '@type') collect(value, into)
}

const stripTags = (html: string) => decode(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()

// The words a reader would see, from the server HTML alone.
export function visibleWords(html: string): number {
  const body = html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html
  const text = decode(
    body
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(script|style|template|svg|noscript)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length
}

export function readPage(html: string): PageFacts {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? html
  const metas = tags(head, 'meta')
  const meta = (key: 'name' | 'property', value: string) => metas.find((m) => m[key]?.toLowerCase() === value)?.content?.trim() || null

  const canonicalLink = tags(head, 'link').find((l) => (l.rel ?? '').toLowerCase().split(/\s+/).includes('canonical'))
  const title = head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0]
  const images = tags(html, 'img')

  const found: Found = { types: new Set(), org: { found: false, logo: false, sameAs: 0 }, dates: [] }
  let blocks = 0
  let errors = 0
  for (const m of html.matchAll(/<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi)) {
    blocks++
    try {
      collect(JSON.parse(m[1]), found)
    } catch {
      errors++
    }
  }

  return {
    title: title ? decode(title).replace(/\s+/g, ' ').trim() || null : null,
    description: meta('name', 'description'),
    canonical: canonicalLink?.href?.trim() || null,
    robotsMeta: meta('name', 'robots'),
    lang: htmlTag ? attributes(htmlTag).lang || null : null,
    h1Count: (html.match(/<h1\b/gi) ?? []).length,
    h2Count: (html.match(/<h2\b/gi) ?? []).length,
    questionHeadings: [...html.matchAll(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/gi)].filter((m) => stripTags(m[1]).endsWith('?')).length,
    images: { total: images.length, withAlt: images.filter((i) => 'alt' in i).length },
    words: visibleWords(html),
    og: { title: !!meta('property', 'og:title'), description: !!meta('property', 'og:description'), image: !!meta('property', 'og:image') },
    schemaTypes: [...found.types].sort(),
    org: found.org,
    dates: found.dates,
    jsonLdBlocks: blocks,
    jsonLdErrors: errors,
  }
}
