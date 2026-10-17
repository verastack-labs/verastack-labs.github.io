import { describe, expect, it } from 'vitest'
import { normaliseInput, publicUrl } from './guard'
import { readPage } from './html'
import { isAllowed, parseRobots } from './robots'
import { runChecks, score, topFixes, type Evidence } from './score'

describe('robots.txt', () => {
  const robots = parseRobots(`
User-agent: *
Disallow: /admin
Allow: /admin/public

User-agent: GPTBot
User-agent: ClaudeBot
Disallow: /

User-agent: PerplexityBot
Disallow: /*.pdf$
Sitemap: https://example.com/sitemap.xml
`)

  it('uses the group that names the crawler, else the * group', () => {
    expect(isAllowed(robots, 'GPTBot', '/')).toBe(false)
    expect(isAllowed(robots, 'claudebot', '/pricing')).toBe(false)
    expect(isAllowed(robots, 'OAI-SearchBot', '/pricing')).toBe(true)
    expect(isAllowed(robots, 'OAI-SearchBot', '/admin/x')).toBe(false)
  })

  it('lets the longest rule win, and Allow win a tie', () => {
    expect(isAllowed(robots, 'Bingbot', '/admin/public/page')).toBe(true)
    expect(isAllowed(parseRobots('User-agent: *\nDisallow: /a\nAllow: /a'), 'x', '/a')).toBe(true)
  })

  it('understands * and $ in paths', () => {
    expect(isAllowed(robots, 'PerplexityBot', '/docs/guide.pdf')).toBe(false)
    expect(isAllowed(robots, 'PerplexityBot', '/docs/guide.pdf?x=1')).toBe(true)
    // A named group replaces the * group entirely, so /admin is open to PerplexityBot.
    expect(isAllowed(robots, 'PerplexityBot', '/admin')).toBe(true)
  })

  it('treats an empty Disallow as allow-all and collects sitemaps', () => {
    expect(isAllowed(parseRobots('User-agent: *\nDisallow:'), 'GPTBot', '/')).toBe(true)
    expect(robots.sitemaps).toEqual(['https://example.com/sitemap.xml'])
  })
})

const goodHtml = `<!doctype html><html lang="en"><head>
<title>Acme: booking software for clinics</title>
<meta name="description" content="Acme is booking software for clinics: appointments, reminders and payments in one place, for small practices in India.">
<link rel="canonical" href="https://acme.example.com/">
<meta property="og:title" content="Acme"><meta property="og:description" content="x"><meta property="og:image" content="/og.png">
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization","name":"Acme"},{"@type":["SoftwareApplication"],"name":"Acme"}]}</script>
</head><body><h1>Booking for clinics</h1><script>var hidden = "these words do not count"</script>
<p>${'Clinics book patients with Acme every day. '.repeat(60)}</p></body></html>`

describe('reading a page', () => {
  it('finds the title, description, canonical, headings and JSON-LD types', () => {
    const page = readPage(goodHtml)
    expect(page.title).toBe('Acme: booking software for clinics')
    expect(page.description).toMatch(/^Acme is booking software/)
    expect(page.canonical).toBe('https://acme.example.com/')
    expect(page.lang).toBe('en')
    expect(page.h1Count).toBe(1)
    expect(page.schemaTypes).toEqual(['Organization', 'SoftwareApplication'])
    expect(page.og).toEqual({ title: true, description: true, image: true })
  })

  it('counts only text a reader would see, not scripts', () => {
    const page = readPage(goodHtml)
    expect(page.words).toBeGreaterThan(400)
    expect(readPage('<html><body><div id="root"></div><script>lots of words here really</script></body></html>').words).toBe(0)
  })

  it('counts JSON-LD that fails to parse', () => {
    const page = readPage('<script type="application/ld+json">{oops</script>')
    expect(page.jsonLdBlocks).toBe(1)
    expect(page.jsonLdErrors).toBe(1)
  })
})

const evidence = (over: Partial<Evidence> = {}): Evidence => ({
  finalUrl: 'https://acme.example.com/',
  headers: { xRobotsTag: null },
  page: readPage(goodHtml),
  robots: parseRobots('User-agent: *\nAllow: /'),
  llmsTxt: true,
  sitemap: true,
  botStatus: null,
  ...over,
})

describe('scoring', () => {
  it('gives a well-built page full marks', () => {
    const checks = runChecks(evidence())
    expect(checks.reduce((n, c) => n + c.weight, 0)).toBe(100)
    expect(checks.every((c) => c.status === 'pass')).toBe(true)
    expect(score(checks)).toBe(100)
    expect(topFixes(checks)).toEqual([])
  })

  it('fails a JavaScript-only page that blocks AI search, and ranks those fixes first', () => {
    const checks = runChecks(
      evidence({
        page: readPage('<html><head><title>App</title></head><body><div id="root"></div></body></html>'),
        robots: parseRobots('User-agent: OAI-SearchBot\nDisallow: /'),
        llmsTxt: false,
      }),
    )
    const byId = Object.fromEntries(checks.map((c) => [c.id, c.status]))
    expect(byId.crawlers).toBe('fail')
    expect(byId.text).toBe('fail')
    expect(byId.structured).toBe('fail')
    expect(byId.llms).toBe('warn')
    expect(score(checks)).toBeLessThan(40)
    expect(topFixes(checks).map((c) => c.id)).toEqual(['crawlers', 'text', 'structured'])
  })

  it('only warns when just the training crawlers are blocked', () => {
    const checks = runChecks(evidence({ robots: parseRobots('User-agent: GPTBot\nDisallow: /') }))
    expect(checks.find((c) => c.id === 'crawlers')?.status).toBe('warn')
  })

  it('fails noindex from a header, and warns when AI crawlers are turned away at the edge', () => {
    const checks = runChecks(evidence({ headers: { xRobotsTag: 'noindex, nofollow' }, botStatus: 403 }))
    expect(checks.find((c) => c.id === 'indexable')?.status).toBe('fail')
    expect(checks.find((c) => c.id === 'edge')?.status).toBe('warn')
  })

  it('writes every detail and fix without em dashes', () => {
    for (const c of runChecks(evidence({ botStatus: 403, llmsTxt: false }))) {
      expect(`${c.label} ${c.detail} ${c.fix}`).not.toContain(String.fromCodePoint(0x2014))
    }
  })
})

describe('which addresses may be fetched', () => {
  it('accepts public sites, adding https:// when missing', () => {
    expect(publicUrl(normaliseInput('example.com'))?.href).toBe('https://example.com/')
    expect(publicUrl('http://shop.example.co.in/path?q=1#x')?.href).toBe('http://shop.example.co.in/path?q=1')
  })

  it('refuses IP addresses, local names, odd ports, credentials and other schemes', () => {
    for (const bad of [
      'http://127.0.0.1/',
      'http://10.0.0.1/',
      'http://2130706433/',
      'http://0x7f000001/',
      'http://[::1]/',
      'http://localhost/',
      'http://intranet/',
      'http://printer.local/',
      'http://metadata.internal/',
      'https://example.com:8080/',
      'https://user:pass@example.com/',
      'ftp://example.com/',
      'file:///etc/passwd',
    ]) {
      expect(publicUrl(bad), bad).toBeNull()
    }
  })

  it('refuses the checker itself', () => {
    expect(publicUrl('https://api.verastack.dev/aeo-check', 'api.verastack.dev')).toBeNull()
  })
})
