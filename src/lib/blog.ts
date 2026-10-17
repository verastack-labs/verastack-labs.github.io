import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { marked } from 'marked'

export type Post = {
  slug: string
  title: string
  description: string
  // ISO date, YYYY-MM-DD.
  date: string
  tags: string[]
  html: string
  words: number
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
  for (const key of ['title', 'description', 'date']) {
    if (!meta[key]) throw new Error(`Post ${slug} is missing ${key}`)
  }
  const body = match[2]
  return {
    slug,
    title: meta.title,
    description: meta.description,
    date: meta.date,
    tags: (meta.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean),
    html: marked.parse(body, { async: false }),
    words: body.split(/\s+/).filter(Boolean).length,
  }
}

// Every post, newest first. Read at build time; the site is a static export.
export function allPosts(): Post[] {
  return readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parsePost(f.replace(/\.md$/, ''), readFileSync(join(DIR, f), 'utf8')))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function postBySlug(slug: string): Post | undefined {
  return allPosts().find((p) => p.slug === slug)
}

export const readingMinutes = (words: number) => Math.max(1, Math.round(words / 220))

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}
