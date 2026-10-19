import type { PageFacts } from './html'
import { isAllowed, type Robots } from './robots'

export type Status = 'pass' | 'warn' | 'fail'

export type Check = {
  id: string
  label: string
  status: Status
  // Points this check is worth out of 100. A warning earns a third.
  weight: number
  detail: string
  fix: string
}

// Everything the checker fetched, already read. Kept free of network code so it can be tested.
export type Evidence = {
  finalUrl: string
  headers: { xRobotsTag: string | null; lastModified: string | null }
  page: PageFacts
  robots: Robots | null
  // The text of /llms.txt, or null when there is none.
  llmsTxt: string | null
  sitemap: boolean
  // The newest <lastmod> in /sitemap.xml, if any.
  sitemapLastmod: string | null
  // HTTP status of the page when asked for by a request naming an AI crawler, if that differed.
  botStatus: number | null
  now: Date
}

// Crawlers that fetch pages to answer questions, on a schedule or when a user asks. Blocking one
// keeps you out of that engine's answers.
export const SEARCH_CRAWLERS = ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'Claude-SearchBot', 'Claude-User']
// Crawlers that collect training data. Blocking these is a fair choice, so it only warns.
export const TRAINING_CRAWLERS = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Meta-ExternalAgent']

const OFFER_TYPES = ['Product', 'ProductGroup', 'SoftwareApplication', 'WebApplication', 'MobileApplication', 'Service', 'Offer', 'AggregateOffer', 'Course', 'Event', 'Article', 'BlogPosting', 'NewsArticle', 'Recipe', 'ItemList']

const STOPWORDS = new Set(['with', 'that', 'this', 'from', 'your', 'have', 'into', 'more', 'than', 'best', 'only', 'each', 'about', 'their', 'what', 'when', 'which', 'will', 'also'])

const list = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items.at(-1)}` : items[0])

// A description written as a keyword list: one word three or more times, or a long run of words
// with no punctuation at all.
export function keywordy(text: string): string | null {
  const words = text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []
  const counts = new Map<string, number>()
  for (const w of words) if (w.length > 3 && !STOPWORDS.has(w)) counts.set(w, (counts.get(w) ?? 0) + 1)
  const repeated = [...counts].find(([, n]) => n >= 3)
  if (repeated) return `repeats "${repeated[0]}" ${repeated[1]} times`
  if (words.length >= 12 && !/[.,;:!?]/.test(text)) return 'has no punctuation'
  return null
}

const DAY = 86_400_000

export function runChecks(ev: Evidence): Check[] {
  const { page } = ev
  const path = new URL(ev.finalUrl).pathname
  const checks: Check[] = []

  const blocked = (agents: string[]) => (ev.robots ? agents.filter((a) => !isAllowed(ev.robots!, a, path)) : [])
  const searchBlocked = blocked(SEARCH_CRAWLERS)
  const trainingBlocked = blocked(TRAINING_CRAWLERS)
  checks.push({
    id: 'crawlers',
    label: 'AI and search crawlers can read the page',
    weight: 15,
    status: searchBlocked.length ? 'fail' : trainingBlocked.length ? 'warn' : 'pass',
    detail: searchBlocked.length
      ? `robots.txt blocks ${list(searchBlocked)} from this page.`
      : trainingBlocked.length
        ? `Search crawlers are allowed. robots.txt blocks the training crawlers ${list(trainingBlocked)}.`
        : ev.robots
          ? 'robots.txt lets every major search and AI crawler in.'
          : 'No robots.txt, so every crawler is allowed.',
    fix: searchBlocked.length
      ? `Remove the Disallow rules that cover ${list(searchBlocked)} in robots.txt. An engine cannot quote a page it may not fetch.`
      : 'Blocking training crawlers is a fair choice, but models then learn about you only from other sites. Allow them unless you have a reason not to.',
  })

  const edgeBlocked = ev.botStatus !== null && ev.botStatus >= 400
  checks.push({
    id: 'edge',
    label: 'Your server or CDN answers AI crawlers',
    weight: 5,
    // Only a warning: a request from the checker that names a crawler is not the real crawler, and
    // some CDNs treat the two differently.
    status: edgeBlocked ? 'warn' : 'pass',
    detail: edgeBlocked
      ? `A request naming an AI crawler got HTTP ${ev.botStatus}, while a normal request got the page.`
      : 'A request naming an AI crawler got the same page as everyone else.',
    fix: 'Check your CDN or firewall bot settings (Cloudflare, Vercel, Akamai and others can block AI crawlers by default) and allow the crawlers you want.',
  })

  checks.push({
    id: 'text',
    label: 'The page says what you do in plain HTML',
    weight: 11,
    status: page.words >= 500 ? 'pass' : page.words >= 200 ? 'warn' : 'fail',
    detail: `The HTML your server sends has about ${page.words} words of readable text, before any JavaScript runs.`,
    fix: 'Render your main copy on the server (static or server rendering), aim for 500 words or more, and include one plain sentence: what you are, for whom, and what it does.',
  })

  const { org } = page
  checks.push({
    id: 'identity',
    label: 'Structured data says who you are',
    weight: 10,
    status: org.found && org.logo && org.sameAs > 0 ? 'pass' : org.found ? 'warn' : 'fail',
    detail: org.found
      ? `Organization data found${org.logo ? ', with a logo' : ', without a logo'}, linking ${org.sameAs} other profile${org.sameAs === 1 ? '' : 's'} (sameAs).`
      : 'No Organization in the JSON-LD, so engines have to guess who is behind the page.',
    fix: 'Add Organization JSON-LD with your name, logo, URL and sameAs links to your LinkedIn, Instagram, Wikipedia or Crunchbase pages. It is how a model tells you apart from a namesake.',
  })

  const offers = page.schemaTypes.filter((t) => OFFER_TYPES.includes(t))
  checks.push({
    id: 'structured',
    label: 'Structured data describes what you sell',
    weight: 9,
    status: offers.length ? 'pass' : 'fail',
    detail:
      page.jsonLdBlocks === 0
        ? 'No JSON-LD structured data on the page.'
        : `Found ${page.schemaTypes.length ? page.schemaTypes.join(', ') : 'no readable types'}${page.jsonLdErrors ? `; ${page.jsonLdErrors} block(s) failed to parse` : ''}.`,
    fix: 'Describe what you sell in JSON-LD: Product with price and availability, SoftwareApplication, Service or an ItemList of products. Keep it in step with the visible page.',
  })

  // The answers on the page are what counts; FAQPage markup labels them but has no proven effect on
  // AI citations by itself (docs/why-ai-search-numbers.md). Markup with no visible questions is a
  // warning, since Google expects marked-up answers to be on the page.
  const hasFaq = page.schemaTypes.includes('FAQPage')
  const asked = page.visibleQuestions
  const plural = (n: number) => `${n} question${n === 1 ? '' : 's'}`
  checks.push({
    id: 'faq',
    label: 'Answers to the questions buyers ask',
    weight: 7,
    status: asked >= 3 || (hasFaq && asked >= 1) ? 'pass' : asked >= 1 || hasFaq ? 'warn' : 'fail',
    detail:
      asked >= 1
        ? `${plural(asked)} answered on the page${hasFaq ? ', labelled with FAQPage structured data' : ''}.`
        : hasFaq
          ? 'FAQPage structured data, but no questions a reader can see on the page.'
          : 'No questions and answers on the page.',
    fix: 'Answer the questions buyers actually ask (price, who it is for, how it compares) on the page, a sentence or two each. Labelling them with FAQPage structured data is good practice.',
  })

  const t = page.title
  checks.push({
    id: 'title',
    label: 'A clear title',
    weight: 6,
    status: !t ? 'fail' : t.length >= 15 && t.length <= 65 ? 'pass' : 'warn',
    detail: t ? `"${t}" (${t.length} characters).` : 'The page has no <title>.',
    fix: 'Write a title of about 30 to 60 characters that names the product and what it is, for example "Acme: booking software for clinics".',
  })

  const d = page.description
  const stuffed = d ? keywordy(d) : null
  checks.push({
    id: 'description',
    label: 'A meta description that answers "what is this?"',
    weight: 7,
    status: !d ? 'fail' : d.length >= 70 && d.length <= 170 && !stuffed ? 'pass' : 'warn',
    detail: d
      ? `${d.length} characters${stuffed ? `, reads like a keyword list (${stuffed})` : ''}: "${d.length > 140 ? `${d.slice(0, 140)}…` : d}"`
      : 'No meta description.',
    fix: 'Write the meta description as one or two plain sentences of 120 to 160 characters: what you offer and for whom. Engines quote sentences, not keyword lists.',
  })

  let canonicalStatus: Status = 'fail'
  let canonicalDetail = 'No canonical link.'
  if (page.canonical) {
    try {
      const c = new URL(page.canonical, ev.finalUrl)
      const same = c.host === new URL(ev.finalUrl).host
      canonicalStatus = same ? 'pass' : 'warn'
      canonicalDetail = same ? `Points to ${c.href}.` : `Points to another host, ${c.host}. Engines will credit that address instead.`
    } catch {
      canonicalDetail = 'The canonical link is not a valid address.'
    }
  }
  checks.push({
    id: 'canonical',
    label: 'One canonical address',
    weight: 4,
    status: canonicalStatus,
    detail: canonicalDetail,
    fix: 'Add <link rel="canonical"> with the full preferred address, so every copy of the page credits one URL.',
  })

  const noindex = [page.robotsMeta, ev.headers.xRobotsTag].some((v) => v && /noindex|none/i.test(v))
  checks.push({
    id: 'indexable',
    label: 'The page may be indexed',
    weight: 7,
    status: noindex ? 'fail' : 'pass',
    detail: noindex ? 'A robots meta tag or X-Robots-Tag header says noindex.' : 'Nothing tells engines to leave it out.',
    fix: 'Remove noindex from the robots meta tag or the X-Robots-Tag header on pages you want found.',
  })

  checks.push({
    id: 'headings',
    label: 'Headings that outline the page',
    weight: 4,
    status: page.h1Count === 1 && page.h2Count >= 2 ? 'pass' : page.h1Count >= 1 ? 'warn' : 'fail',
    detail: `${page.h1Count} <h1> and ${page.h2Count} <h2> in the server HTML.`,
    fix: 'Give the page one <h1> that says what it is, and <h2> headings for each section, so engines can lift the right passage for a question.',
  })

  const llms = ev.llmsTxt
  const llmsGood = !!llms && /^#\s+\S/m.test(llms) && /\[[^\]]+\]\([^)]+\)/.test(llms)
  checks.push({
    id: 'llms',
    label: 'An llms.txt for language models',
    weight: 3,
    status: llmsGood ? 'pass' : llms ? 'warn' : 'fail',
    detail: llmsGood ? 'Found /llms.txt with a title and links.' : llms ? 'Found /llms.txt, but without a # title or Markdown links to key pages.' : 'No /llms.txt.',
    fix: 'Add /llms.txt: a # title, a one-line summary, and Markdown links to your key pages. It is a proposed standard, so treat it as a cheap bet.',
  })

  checks.push({
    id: 'sitemap',
    label: 'A sitemap engines can find',
    weight: 3,
    status: ev.sitemap ? 'pass' : 'fail',
    detail: ev.sitemap ? 'Found a sitemap.' : 'No sitemap in robots.txt or at /sitemap.xml.',
    fix: 'Publish /sitemap.xml listing your important pages and name it in robots.txt with a Sitemap: line.',
  })

  const stamps = [ev.sitemapLastmod, ev.headers.lastModified, ...page.dates]
    .map((s) => (s ? Date.parse(s) : NaN))
    .filter((n) => Number.isFinite(n) && n <= ev.now.getTime() + DAY)
  const newest = stamps.length ? Math.max(...stamps) : null
  const ageDays = newest === null ? null : Math.floor((ev.now.getTime() - newest) / DAY)
  checks.push({
    id: 'fresh',
    label: 'Signs the page is current',
    weight: 4,
    status: ageDays === null ? 'warn' : ageDays <= 180 ? 'pass' : ageDays <= 365 ? 'warn' : 'fail',
    detail:
      ageDays === null
        ? 'No date anywhere: no lastmod in the sitemap, no Last-Modified header, no dateModified in the JSON-LD.'
        : `Last updated ${ageDays <= 0 ? 'today' : `${ageDays} day${ageDays === 1 ? '' : 's'} ago`}, by the newest date we found.`,
    fix: 'Keep <lastmod> in your sitemap accurate and add dateModified to your JSON-LD. Engines prefer recent sources, and models answer from stale facts when nothing says what is new.',
  })

  const { total, withAlt } = page.images
  const altShare = total ? withAlt / total : 1
  checks.push({
    id: 'images',
    label: 'Images described in text',
    weight: 3,
    status: altShare >= 0.9 ? 'pass' : altShare >= 0.6 ? 'warn' : 'fail',
    detail: total ? `${withAlt} of ${total} images have alt text.` : 'No images in the server HTML.',
    fix: 'Give every meaningful image alt text that says what it shows (product name, colour, use). Mark decorative images with an empty alt.',
  })

  const ogCount = Number(page.og.title) + Number(page.og.description) + Number(page.og.image)
  checks.push({
    id: 'og',
    label: 'Link previews (Open Graph)',
    weight: 2,
    status: ogCount === 3 ? 'pass' : ogCount > 0 ? 'warn' : 'fail',
    detail: `${ogCount} of og:title, og:description and og:image present.`,
    fix: 'Add og:title, og:description and og:image, so shared links and cited sources show a proper card.',
  })

  return checks
}

// A warning earns a third of its points. A page engines may not fetch or index is capped at 40,
// however tidy the rest is.
export function score(checks: Check[]): number {
  const total = checks.reduce((n, c) => n + c.weight, 0)
  const earned = checks.reduce((n, c) => n + (c.status === 'pass' ? c.weight : c.status === 'warn' ? c.weight / 3 : 0), 0)
  const raw = Math.round((earned / total) * 100)
  const shut = checks.some((c) => (c.id === 'crawlers' || c.id === 'indexable') && c.status === 'fail')
  return shut ? Math.min(raw, 40) : raw
}

// The fixes worth doing first: failures before warnings, heavier checks first.
export function topFixes(checks: Check[], n = 3): Check[] {
  const rank = (c: Check) => (c.status === 'fail' ? 2 : c.status === 'warn' ? 1 : 0) * 1000 + c.weight
  return checks.filter((c) => c.status !== 'pass').sort((a, b) => rank(b) - rank(a)).slice(0, n)
}

// What the public page gets: the score, a few fixes and only a count of the rest. Every check's
// finding and fix together are the audit, so they stay with the studio (see `full` in index.ts).
// The page never gets the whole list: with more than three issues it shows the top three in full;
// with three or fewer it shows the first in full and the next one's finding without its fix
// (`partial`), and the fix text is never sent, so it cannot be read in the page or its source.
export type PublicCheck = Check & { partial?: true }
export type PublicReport = {
  url: string
  checkedAt: string
  score: number
  top: PublicCheck[]
  counts: { pass: number; warn: number; fail: number; total: number }
}

export const FULL_SHOWN = 3

export function publicTop(checks: Check[]): PublicCheck[] {
  const failing = topFixes(checks, checks.length)
  if (failing.length > FULL_SHOWN) return failing.slice(0, FULL_SHOWN)
  const cut = (c: Check): PublicCheck => ({ ...c, fix: '', partial: true })
  if (failing.length === 1) return [cut(failing[0])]
  return failing.length ? [failing[0], cut(failing[1])] : []
}

export function publicView(report: { url: string; checkedAt: string; score: number; checks: Check[] }): PublicReport {
  const n = (s: Status) => report.checks.filter((c) => c.status === s).length
  return {
    url: report.url,
    checkedAt: report.checkedAt,
    score: report.score,
    top: publicTop(report.checks),
    counts: { pass: n('pass'), warn: n('warn'), fail: n('fail'), total: report.checks.length },
  }
}
