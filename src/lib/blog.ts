import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { marked } from 'marked'
import { blogCategories, categoryById } from '@/data/blog-categories'

export type Post = {
  slug: string
  // Plain title, for search results, share cards and structured data.
  title: string
  // The same title in pieces; `hi` marks the words shown in signal green. In the front matter they
  // sit between asterisks: `title: GEO is the new *SEO*`.
  titleParts: TitlePart[]
  description: string
  // ISO date, YYYY-MM-DD.
  date: string
  // Publish time in India, HH:MM, so posts from the same day sort newest first. Optional.
  time: string | null
  // One of src/data/blog-categories.ts.
  category: string
  tags: string[]
  // The highlighted hook: a line that pulls founders in, and its button. `call` means book a call.
  hook: { text: string; label: string; href: string } | null
  // A line beside the inline check at the end, such as a study's median to beat.
  checkCompare: string | null
  // A headline number, `stat: 81 | median score`. Optional; posts with one can be featured on the
  // home page's notes section.
  stat: { value: string; label: string } | null
  html: string
  words: number
}

export type TitlePart = { text: string; hi: boolean }

// Links that leave the site open in a new tab, say so to screen readers, and carry a small arrow
// kept on the same line as the link's last word. Only plain-text links are touched.
const OWN_HOSTS = /^https?:\/\/(www\.)?verastack\.dev(\/|$)/i
export function externalLinks(html: string): string {
  return html.replace(/<a href="(https?:\/\/[^"]+)"([^>]*)>([^<]+)<\/a>/g, (whole, href: string, attrs: string, text: string) => {
    if (OWN_HOSTS.test(href)) return whole
    const cut = text.lastIndexOf(' ')
    const head = cut === -1 ? '' : text.slice(0, cut + 1)
    const last = cut === -1 ? text : text.slice(cut + 1)
    return `<a href="${href}"${attrs} class="ext" target="_blank" rel="noopener noreferrer">${head}<span class="ext-tail">${last}<span class="ext-arrow" aria-hidden="true">↗</span></span><span class="sr-only"> (opens in a new tab)</span></a>`
  })
}

export function splitTitle(raw: string): TitlePart[] {
  return raw
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .map((piece) => (piece.startsWith('*') && piece.endsWith('*') ? { text: piece.slice(1, -1), hi: true } : { text: piece, hi: false }))
}

const DIR = join(process.cwd(), 'src', 'content', 'blog')

// The front matter is a few `key: value` lines between --- fences. Only the first colon splits, so
// a title may contain colons.
export function parsePost(slug: string, source: string): Post {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) throw new Error(`Post ${slug} has no front matter`)
  const meta: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  for (const key of ['title', 'description', 'date', 'category']) {
    if (!meta[key]) throw new Error(`Post ${slug} is missing ${key}`)
  }
  if (!categoryById(meta.category)) throw new Error(`Post ${slug} has an unknown category ${meta.category}`)
  const body = match[2]
  return {
    slug,
    title: splitTitle(meta.title).map((p) => p.text).join(''),
    titleParts: splitTitle(meta.title),
    description: meta.description,
    date: meta.date,
    time: meta.time || null,
    category: meta.category,
    hook: meta.hook ? parseHook(meta.hook, meta.hookCta, slug) : null,
    checkCompare: meta.checkCompare || null,
    stat: parseStat(meta.stat, slug),
    tags: (meta.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean),
    html: externalLinks(marked.parse(body, { async: false })),
    words: body.split(/\s+/).filter(Boolean).length,
  }
}

function parseStat(raw: string | undefined, slug: string): Post['stat'] {
  if (!raw) return null
  const [value, label] = raw.split('|').map((s) => s.trim())
  if (!value || !label) throw new Error(`Post ${slug} has a stat without "value | label"`)
  return { value, label }
}

function parseHook(text: string, cta: string | undefined, slug: string): Post['hook'] {
  const [label, href] = (cta ?? '').split('|').map((s) => s.trim())
  if (!label || !href) throw new Error(`Post ${slug} has a hook without a hookCta "Label | href"`)
  return { text, label, href }
}

// Where the hook goes in a post: at a <!-- hook --> marker in the Markdown, else after the opening.
export const HOOK_MARKER = '<!-- hook -->'

// Every post, newest first. Read at build time; the site is a static export.
export function allPosts(): Post[] {
  return readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parsePost(f.replace(/\.md$/, ''), readFileSync(join(DIR, f), 'utf8')))
    .sort((a, b) => published(b).localeCompare(published(a)))
}

// When a post went out, as an ISO timestamp in India's time zone (for sorting and JSON-LD).
export const published = (p: Pick<Post, 'date' | 'time'>) => `${p.date}T${p.time ?? '00:00'}:00+05:30`

export function postBySlug(slug: string): Post | undefined {
  return allPosts().find((p) => p.slug === slug)
}

export const readingMinutes = (words: number) => Math.max(1, Math.round(words / 220))

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

// Categories that have posts, in the order blog-categories.ts lists them, with their counts.
export function usedCategories() {
  const posts = allPosts()
  return blogCategories
    .map((c) => ({ ...c, count: posts.filter((p) => p.category === c.id).length }))
    .filter((c) => c.count > 0)
}

export const postsIn = (category: string) => allPosts().filter((p) => p.category === category)
