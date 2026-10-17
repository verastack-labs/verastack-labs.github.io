import type { PageFacts } from './html'
import { isAllowed, type Robots } from './robots'

export type Status = 'pass' | 'warn' | 'fail'

export type Check = {
  id: string
  label: string
  status: Status
  // Points this check is worth out of 100. A warning earns half.
  weight: number
  detail: string
  fix: string
}

// Everything the checker fetched, already read. Kept free of network code so it can be tested.
export type Evidence = {
  finalUrl: string
  headers: { xRobotsTag: string | null }
  page: PageFacts
  robots: Robots | null
  llmsTxt: boolean
  sitemap: boolean
  // HTTP status of the page when asked for by a request naming an AI crawler, if that differed.
  botStatus: number | null
}

// Crawlers that fetch pages to answer questions. Blocking one keeps you out of that engine's answers.
export const SEARCH_CRAWLERS = ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'PerplexityBot', 'Claude-SearchBot']
// Crawlers that collect training data. Blocking these is a fair choice, so it only warns.
export const TRAINING_CRAWLERS = ['GPTBot', 'ClaudeBot', 'Google-Extended']

const ANSWER_TYPES = ['Organization', 'LocalBusiness', 'Corporation', 'Person', 'Product', 'SoftwareApplication', 'WebApplication', 'Service', 'FAQPage', 'Article', 'BlogPosting', 'NewsArticle']

const list = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items.at(-1)}` : items[0])

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
    weight: 20,
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
      : 'Blocking training crawlers is a fair choice, but it can make models know less about you. Allow them unless you have a reason not to.',
  })

  const edgeBlocked = ev.botStatus !== null && ev.botStatus >= 400
  checks.push({
    id: 'edge',
    label: 'Your server or CDN answers AI crawlers',
    weight: 8,
    status: edgeBlocked ? 'warn' : 'pass',
    detail: edgeBlocked
      ? `A request naming an AI crawler got HTTP ${ev.botStatus}, while a normal request got the page.`
      : 'A request naming an AI crawler got the same page as everyone else.',
    fix: 'Check your CDN or firewall bot settings (Cloudflare, Vercel, Akamai and others can block AI crawlers by default) and allow the crawlers you want.',
  })

  checks.push({
    id: 'text',
    label: 'The page says what you do in plain HTML',
    weight: 15,
    status: page.words >= 300 ? 'pass' : page.words >= 100 ? 'warn' : 'fail',
    detail: `The HTML your server sends has about ${page.words} words of readable text, before any JavaScript runs.`,
    fix: 'Render your main copy on the server (static or server rendering) and include one plain sentence: what you are, for whom, and what it does. Crawlers that skip JavaScript see nothing else.',
  })

  const answerTypes = page.schemaTypes.filter((t) => ANSWER_TYPES.includes(t))
  checks.push({
    id: 'structured',
    label: 'Structured data labels the facts',
    weight: 15,
    status: answerTypes.length ? 'pass' : page.jsonLdBlocks > 0 && page.jsonLdErrors < page.jsonLdBlocks ? 'warn' : 'fail',
    detail: page.jsonLdBlocks === 0
      ? 'No JSON-LD structured data on the page.'
      : `Found ${page.schemaTypes.length ? page.schemaTypes.join(', ') : 'no readable types'}${page.jsonLdErrors ? `; ${page.jsonLdErrors} block(s) failed to parse` : ''}.`,
    fix: 'Add JSON-LD for who you are and what you sell: Organization, plus SoftwareApplication, Product or Service with the price, and FAQPage where you have one. Keep it in step with the visible page.',
  })

  const t = page.title
  checks.push({
    id: 'title',
    label: 'A clear title',
    weight: 7,
    status: !t ? 'fail' : t.length >= 15 && t.length <= 65 ? 'pass' : 'warn',
    detail: t ? `"${t}" (${t.length} characters).` : 'The page has no <title>.',
    fix: 'Write a title of about 30 to 60 characters that names the product and what it is, for example "Acme: booking software for clinics".',
  })

  const d = page.description
  checks.push({
    id: 'description',
    label: 'A meta description that answers "what is this?"',
    weight: 7,
    status: !d ? 'fail' : d.length >= 70 && d.length <= 170 ? 'pass' : 'warn',
    detail: d ? `${d.length} characters: "${d.length > 140 ? `${d.slice(0, 140)}…` : d}"` : 'No meta description.',
    fix: 'Add a meta description of 120 to 160 characters that states plainly what you offer and for whom. Engines often quote it.',
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
    weight: 5,
    status: canonicalStatus,
    detail: canonicalDetail,
    fix: 'Add <link rel="canonical"> with the full preferred address, so every copy of the page credits one URL.',
  })

  const noindex = [page.robotsMeta, ev.headers.xRobotsTag].some((v) => v && /noindex|none/i.test(v))
  checks.push({
    id: 'indexable',
    label: 'The page may be indexed',
    weight: 10,
    status: noindex ? 'fail' : 'pass',
    detail: noindex ? 'A robots meta tag or X-Robots-Tag header says noindex.' : 'Nothing tells engines to leave it out.',
    fix: 'Remove noindex from the robots meta tag or the X-Robots-Tag header on pages you want found.',
  })

  checks.push({
    id: 'h1',
    label: 'One main heading',
    weight: 3,
    status: page.h1Count === 1 ? 'pass' : page.h1Count > 1 ? 'warn' : 'fail',
    detail: page.h1Count === 1 ? 'Exactly one <h1>.' : page.h1Count > 1 ? `${page.h1Count} <h1> headings.` : 'No <h1> in the server HTML.',
    fix: 'Give the page a single <h1> that says what it is about, in the HTML the server sends.',
  })

  checks.push({
    id: 'llms',
    label: 'An llms.txt for language models',
    weight: 4,
    status: ev.llmsTxt ? 'pass' : 'warn',
    detail: ev.llmsTxt ? 'Found /llms.txt.' : 'No /llms.txt.',
    fix: 'Add /llms.txt: a short plain-text summary of what you do and links to your key pages. It is a proposed standard, so treat it as a cheap bet.',
  })

  checks.push({
    id: 'sitemap',
    label: 'A sitemap engines can find',
    weight: 4,
    status: ev.sitemap ? 'pass' : 'warn',
    detail: ev.sitemap ? 'Found a sitemap.' : 'No sitemap in robots.txt or at /sitemap.xml.',
    fix: 'Publish /sitemap.xml listing your important pages and name it in robots.txt with a Sitemap: line.',
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

export function score(checks: Check[]): number {
  const total = checks.reduce((n, c) => n + c.weight, 0)
  const earned = checks.reduce((n, c) => n + (c.status === 'pass' ? c.weight : c.status === 'warn' ? c.weight / 2 : 0), 0)
  return Math.round((earned / total) * 100)
}

// The fixes worth doing first: failures before warnings, heavier checks first.
export function topFixes(checks: Check[], n = 3): Check[] {
  const rank = (c: Check) => (c.status === 'fail' ? 2 : c.status === 'warn' ? 1 : 0) * 1000 + c.weight
  return checks.filter((c) => c.status !== 'pass').sort((a, b) => rank(b) - rank(a)).slice(0, n)
}
