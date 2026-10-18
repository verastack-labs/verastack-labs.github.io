// The AI search check behind verastack.dev/ai-search-check: fetches one public page plus its
// robots.txt, llms.txt and sitemap, and scores how readable it is to search and answer engines.
// GET /aeo-check?url=example.com returns JSON: the score, the top three fixes and a count of the rest.
// With the studio's key in an X-Report-Key header it returns every check, for studies and summaries.

import { decode, readPage } from './html'
import { normaliseInput, publicUrl } from './guard'
import { parseRobots, type Robots } from './robots'
import { publicView, runChecks, score, topFixes, type Evidence } from './score'

type RateLimiter = { limit: (opts: { key: string }) => Promise<{ success: boolean }> }
type Env = { LIMITER?: RateLimiter; ALLOWED_ORIGINS: string; SELF_HOST: string; REPORT_KEY?: string }

const USER_AGENT = 'Mozilla/5.0 (compatible; VeraStackCheck/1.0; +https://verastack.dev/tools/ai-search-check/)'
const BOT_AGENT = 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.3; +https://openai.com/searchbot'
const TIMEOUT_MS = 8000
const MAX_BYTES = 2_000_000
const MAX_REDIRECTS = 5
const CACHE_SECONDS = 600

class CheckError extends Error {
  constructor(
    message: string,
    readonly status = 422,
  ) {
    super(message)
  }
}

// Reads at most `limit` bytes of a body, so a huge page cannot exhaust the Worker.
async function readCapped(res: Response, limit = MAX_BYTES): Promise<string> {
  if (!res.body) return ''
  const reader = res.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  while (size < limit) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    size += value.byteLength
  }
  await reader.cancel().catch(() => {})
  const all = new Uint8Array(Math.min(size, limit))
  let offset = 0
  for (const c of chunks) {
    const part = c.subarray(0, Math.max(0, all.length - offset))
    all.set(part, offset)
    offset += part.length
  }
  return new TextDecoder().decode(all)
}

// Follows redirects by hand so every hop passes the same public-address check.
async function safeFetch(start: URL, selfHost: string, agent = USER_AGENT): Promise<{ res: Response; url: URL }> {
  let url = start
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await fetch(url.href, {
      redirect: 'manual',
      headers: { 'User-Agent': agent, Accept: 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.5' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    const location = res.headers.get('location')
    if (res.status >= 300 && res.status < 400 && location) {
      const next = publicUrl(new URL(location, url).href, selfHost)
      if (!next) throw new CheckError('The page redirects somewhere the checker will not follow.')
      url = next
      continue
    }
    return { res, url }
  }
  throw new CheckError('The page redirects too many times.')
}

// A side file (robots.txt and friends): its text if it exists and is not an HTML error page.
async function sideFile(origin: string, path: string, selfHost: string): Promise<string | null> {
  try {
    const target = publicUrl(`${origin}${path}`, selfHost)
    if (!target) return null
    const { res } = await safeFetch(target, selfHost)
    if (!res.ok) {
      await res.body?.cancel()
      return null
    }
    const text = await readCapped(res, 500_000)
    return /^\s*<(!doctype html|html)/i.test(text) ? null : text
  } catch {
    return null
  }
}

// The newest <lastmod> in a sitemap or sitemap index.
function newestLastmod(xml: string | null): string | null {
  if (!xml) return null
  const stamps = [...xml.matchAll(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/gi)].map((m) => m[1]).filter((s) => Number.isFinite(Date.parse(s)))
  return stamps.sort((a, b) => Date.parse(b) - Date.parse(a))[0] ?? null
}

export async function check(input: string, selfHost: string) {
  const start = publicUrl(normaliseInput(input), selfHost)
  if (!start) throw new CheckError('Enter a public website address, like example.com.', 400)

  let page: { res: Response; url: URL }
  try {
    page = await safeFetch(start, selfHost)
  } catch (e) {
    if (e instanceof CheckError) throw e
    throw new CheckError("We couldn't reach that site. Check the address for a typo, or try again in a minute.")
  }
  const { res, url } = page
  // Cloudflare answers 530 (and 52x) when the name does not resolve or the origin is unreachable.
  if (res.status === 530 || (res.status >= 521 && res.status <= 523)) {
    throw new CheckError("We couldn't find that site. Check the address for a typo.")
  }
  if ([401, 403, 429, 503].includes(res.status)) {
    throw new CheckError(`The site turned the checker away (HTTP ${res.status}). Bot protection that blocks us may be blocking AI crawlers too, which is worth checking.`)
  }
  if (!res.ok) throw new CheckError(`The site answered HTTP ${res.status}, so there was no page to check.`)
  const type = res.headers.get('content-type') ?? ''
  if (!/html/i.test(type)) throw new CheckError('That address did not return a web page.')
  const html = await readCapped(res)

  const origin = url.origin
  const [robotsText, llms, sitemapXml, botStatus] = await Promise.all([
    sideFile(origin, '/robots.txt', selfHost),
    sideFile(origin, '/llms.txt', selfHost),
    sideFile(origin, '/sitemap.xml', selfHost),
    safeFetch(url, selfHost, BOT_AGENT)
      .then(({ res: r }) => (r.body?.cancel(), r.status))
      .catch(() => null),
  ])
  const robots: Robots | null = robotsText === null ? null : parseRobots(robotsText)

  // A sitemap index often carries no dates itself (Shopify's never does), while the sitemaps it
  // lists do. Then read one child, preferring products, then pages.
  let lastmod = newestLastmod(sitemapXml)
  if (!lastmod && sitemapXml && /<sitemapindex\b/i.test(sitemapXml)) {
    const children = [...sitemapXml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => decode(m[1]))
    const child = children.find((u) => /product/i.test(u)) ?? children.find((u) => /page/i.test(u)) ?? children[0]
    const target = child ? publicUrl(child, selfHost) : null
    if (target && target.origin === origin) {
      lastmod = newestLastmod(await sideFile(origin, target.pathname + target.search, selfHost))
    }
  }

  const evidence: Evidence = {
    finalUrl: url.href,
    headers: { xRobotsTag: res.headers.get('x-robots-tag'), lastModified: res.headers.get('last-modified') },
    page: readPage(html),
    robots,
    llmsTxt: llms && llms.trim().length > 20 ? llms : null,
    sitemap: !!(robots?.sitemaps.length || (sitemapXml && /<(urlset|sitemapindex)\b/i.test(sitemapXml))),
    sitemapLastmod: lastmod,
    botStatus: botStatus !== null && botStatus !== res.status ? botStatus : null,
    now: new Date(),
  }
  const checks = runChecks(evidence)
  return { url: url.href, checkedAt: new Date().toISOString(), score: score(checks), top: topFixes(checks).map((c) => c.id), checks }
}

function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get('origin') ?? ''
  const allowed = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  return {
    // Any local dev server may call it too; browsers on other sites are refused by CORS.
    'Access-Control-Allow-Origin': allowed.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin) ? origin : allowed[0],
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    // Deliberately no X-Report-Key here: browsers can't send the key, only our own scripts can.
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

const json = (body: unknown, status: number, headers: Record<string, string>) =>
  new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' } })

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const cors = corsHeaders(request, env)
    const { pathname, searchParams } = new URL(request.url)
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
    if (pathname !== '/aeo-check') return json({ error: 'Not found.' }, 404, cors)
    if (request.method !== 'GET') return json({ error: 'Use GET.' }, 405, cors)

    const input = searchParams.get('url') ?? ''
    if (!input || input.length > 2000) return json({ error: 'Enter a website address.' }, 400, cors)

    // Repeat checks of the same address within ten minutes come from the cache and cost nothing.
    // `fresh=1` (the page's "check again" after a fix) skips it, and counts against the rate limit.
    const fresh = searchParams.get('fresh') === '1'
    const key = request.headers.get('x-report-key')
    const full = !!env.REPORT_KEY && key === env.REPORT_KEY
    const view = (report: Parameters<typeof publicView>[0]) => (full ? report : publicView(report))
    const target = publicUrl(normaliseInput(input), env.SELF_HOST)
    const cacheKey = target ? new Request(`https://${env.SELF_HOST}/cache/aeo-check/v3?u=${encodeURIComponent(target.href)}`) : null
    if (cacheKey && !fresh) {
      const hit = await caches.default.match(cacheKey)
      if (hit) return json(view((await hit.json()) as Parameters<typeof publicView>[0]), 200, cors)
    }

    if (env.LIMITER) {
      const ip = request.headers.get('cf-connecting-ip') ?? 'unknown'
      const { success } = await env.LIMITER.limit({ key: ip })
      if (!success) return json({ error: 'Too many checks at once. Wait a minute and try again.' }, 429, cors)
    }

    try {
      const report = await check(input, env.SELF_HOST)
      if (cacheKey) {
        const cached = new Response(JSON.stringify(report), { headers: { 'Content-Type': 'application/json', 'Cache-Control': `max-age=${CACHE_SECONDS}` } })
        ctx.waitUntil(caches.default.put(cacheKey, cached))
      }
      return json(view(report), 200, cors)
    } catch (e) {
      if (e instanceof CheckError) return json({ error: e.message }, e.status, cors)
      return json({ error: 'Something went wrong while checking. Try again in a minute.' }, 500, cors)
    }
  },
}

export default worker
