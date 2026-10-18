import { decode } from './html'

// What a crawler that does not run JavaScript reads on a page: the headings, paragraphs and list
// items in the HTML the server sends, in order. Powers the "What ChatGPT sees" tool.
export type Block = { tag: 'h1' | 'h2' | 'h3' | 'p' | 'li'; text: string }
export type CrawlerView = { title: string | null; description: string | null; words: number; blocks: Block[]; truncated: boolean }

const MAX_BLOCKS = 400
const MAX_WORDS = 4000

const clean = (s: string) =>
  decode(s.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .replace(/ ([.,!?;:])/g, '$1')
    .trim()

export function crawlerView(html: string): CrawlerView {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? ''
  const title = head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]
  const description = head.match(/<meta\b[^>]*name=["']description["'][^>]*>/i)?.[0].match(/content=["']([^"']*)["']/i)?.[1]
  const body = (html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html)
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|template|svg|noscript|iframe)\b[\s\S]*?<\/\1>/gi, ' ')

  const blocks: Block[] = []
  let words = 0
  let truncated = false
  for (const m of body.matchAll(/<(h[1-6]|p|li|dt|dd|summary|blockquote|figcaption|td|th)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const raw = m[1].toLowerCase()
    const text = clean(m[2])
    if (!text || !/[\p{L}\p{N}]/u.test(text)) continue
    const tag: Block['tag'] = raw === 'h1' ? 'h1' : raw === 'h2' ? 'h2' : /^h[3-6]$/.test(raw) ? 'h3' : raw === 'li' ? 'li' : 'p'
    const n = text.split(' ').length
    if (blocks.length >= MAX_BLOCKS || words + n > MAX_WORDS) {
      truncated = true
      break
    }
    // Nested matches (a <p> inside an <li>) repeat text; skip a block already contained in the last.
    if (blocks.length && blocks[blocks.length - 1].text.includes(text)) continue
    blocks.push({ tag, text })
    words += n
  }
  // All the readable words, not only those inside the blocks above (text sitting in bare divs counts).
  const allWords = clean(body)
    .split(' ')
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length
  return {
    title: title ? clean(title) || null : null,
    description: description ? decode(description).trim() || null : null,
    words: allWords,
    blocks,
    truncated,
  }
}
