import { describe, expect, it } from 'vitest'
import { normaliseInput, publicUrl } from './guard'
import { readPage } from './html'
import { isAllowed, parseRobots } from './robots'
import { keywordy, publicView, runChecks, score, topFixes, type Evidence } from './score'

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

const ORG = '{"@type":"Organization","name":"Acme","logo":"https://acme.example.com/logo.png","sameAs":["https://www.linkedin.com/company/acme"]}'
const APP = '{"@type":["SoftwareApplication"],"name":"Acme","dateModified":"2026-10-01"}'
const FAQ = '{"@type":"FAQPage","mainEntity":[]}'

const page = ({ graph = [ORG, APP, FAQ], date = '2026-10-01' } = {}) => `<!doctype html><html lang="en"><head>
<title>Acme: booking software for clinics</title>
<meta name="description" content="Acme is booking software for clinics: appointments, reminders and payments in one place, for small practices in India.">
<link rel="canonical" href="https://acme.example.com/">
<meta property="og:title" content="Acme"><meta property="og:description" content="x"><meta property="og:image" content="/og.png">
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[${graph.join(',').replace('2026-10-01', date)}]}</script>
</head><body><h1>Booking for clinics</h1><script>var hidden = "these words do not count"</script>
<h2>How it works</h2><p>${'Clinics book patients with Acme every day. '.repeat(70)}</p>
<h2>What does it <em>cost</em>?</h2><p>It is free for one clinic.</p>
<img src="/a.png" alt="The Acme calendar"><img src="/line.svg" alt=""></body></html>`

describe('reading a page', () => {
  it('finds the title, description, canonical, headings, images and JSON-LD', () => {
    const p = readPage(page())
    expect(p.title).toBe('Acme: booking software for clinics')
    expect(p.description).toMatch(/^Acme is booking software/)
    expect(p.canonical).toBe('https://acme.example.com/')
    expect(p.lang).toBe('en')
    expect(p.h1Count).toBe(1)
    expect(p.h2Count).toBe(2)
    expect(p.questionHeadings).toBe(1)
    expect(p.images).toEqual({ total: 2, withAlt: 2 })
    expect(p.schemaTypes).toEqual(['FAQPage', 'Organization', 'SoftwareApplication'])
    expect(p.org).toEqual({ found: true, logo: true, sameAs: 1 })
    expect(p.dates).toEqual(['2026-10-01'])
    expect(p.og).toEqual({ title: true, description: true, image: true })
  })

  it('counts only text a reader would see, not scripts', () => {
    expect(readPage(page()).words).toBeGreaterThan(500)
    expect(readPage('<html><body><div id="root"></div><script>lots of words here really</script></body></html>').words).toBe(0)
  })

  it('counts JSON-LD that fails to parse', () => {
    const p = readPage('<script type="application/ld+json">{oops</script>')
    expect(p.jsonLdBlocks).toBe(1)
    expect(p.jsonLdErrors).toBe(1)
  })
})

const evidence = (over: Partial<Evidence> = {}): Evidence => ({
  finalUrl: 'https://acme.example.com/',
  headers: { xRobotsTag: null, lastModified: null },
  page: readPage(page()),
  robots: parseRobots('User-agent: *\nAllow: /'),
  llmsTxt: '# Acme\n\n> Booking for clinics.\n\n- [Pricing](https://acme.example.com/pricing)',
  sitemap: true,
  sitemapLastmod: null,
  botStatus: null,
  now: new Date('2026-10-17T00:00:00Z'),
  ...over,
})

const statuses = (ev: Evidence) => Object.fromEntries(runChecks(ev).map((c) => [c.id, c.status]))

describe('scoring', () => {
  it('gives a well-built page full marks', () => {
    const checks = runChecks(evidence())
    expect(checks).toHaveLength(16)
    expect(checks.reduce((n, c) => n + c.weight, 0)).toBe(100)
    expect(checks.filter((c) => c.status !== 'pass')).toEqual([])
    expect(score(checks)).toBe(100)
    expect(topFixes(checks)).toEqual([])
  })

  it('caps a JavaScript-only page that blocks AI search at 40, and ranks those fixes first', () => {
    const checks = runChecks(
      evidence({
        page: readPage('<html><head><title>App</title></head><body><div id="root"></div></body></html>'),
        robots: parseRobots('User-agent: OAI-SearchBot\nDisallow: /'),
        llmsTxt: null,
      }),
    )
    const byId = Object.fromEntries(checks.map((c) => [c.id, c.status]))
    expect(byId.crawlers).toBe('fail')
    expect(byId.text).toBe('fail')
    expect(byId.structured).toBe('fail')
    expect(byId.llms).toBe('fail')
    expect(score(checks)).toBeLessThanOrEqual(40)
    expect(topFixes(checks).map((c) => c.id)).toEqual(['crawlers', 'text', 'identity'])
  })

  it('only warns when just the training crawlers are blocked, or ChatGPT-User fails it', () => {
    expect(statuses(evidence({ robots: parseRobots('User-agent: GPTBot\nDisallow: /') })).crawlers).toBe('warn')
    expect(statuses(evidence({ robots: parseRobots('User-agent: ChatGPT-User\nDisallow: /') })).crawlers).toBe('fail')
  })

  it('fails noindex and caps the score at 40, but only warns when the edge turns a crawler away', () => {
    const noindex = runChecks(evidence({ headers: { xRobotsTag: 'noindex, nofollow', lastModified: null } }))
    expect(noindex.find((c) => c.id === 'indexable')?.status).toBe('fail')
    expect(score(noindex)).toBe(40)
    const edge = runChecks(evidence({ botStatus: 403 }))
    expect(edge.find((c) => c.id === 'edge')?.status).toBe('warn')
    expect(score(edge)).toBeGreaterThan(90)
  })

  it('gives a warning a third of its points', () => {
    const checks = runChecks(evidence({ llmsTxt: 'just some words about acme, nothing else here' }))
    expect(checks.find((c) => c.id === 'llms')?.status).toBe('warn')
    expect(score(checks)).toBe(98)
  })

  it('marks down a keyword-list description and a site with no Organization or FAQ', () => {
    expect(keywordy('OneFin LOS LMS Powered by AI Loan Origination System Loan Management System Collection System for NBFCs')).toMatch(/system/)
    expect(keywordy('Acme is booking software for clinics: appointments, reminders and payments in one place.')).toBeNull()
    const checks = runChecks(evidence({ page: readPage(page({ graph: [APP] })) }))
    const byId = Object.fromEntries(checks.map((c) => [c.id, c.status]))
    expect(byId.identity).toBe('fail')
    // One visible question and no markup: answered, but thinly.
    expect(byId.faq).toBe('warn')
    expect(score(checks)).toBeLessThan(90)
  })

  it('scores the answers on the page, with markup as a label', () => {
    const faq = (html: string) => statuses(evidence({ page: readPage(html) })).faq
    const qs = '<h2>What does it cost?</h2><p>From $9.</p><details><summary>Who is it for?</summary><p>Clinics.</p></details><dl><dt>Is my data safe?</dt><dd>Yes.</dd></dl>'
    expect(faq(`<html><body>${qs}</body></html>`)).toBe('pass')
    expect(faq('<html><body><h2>What does it cost?</h2></body></html>')).toBe('warn')
    expect(faq(`<html><head><script type="application/ld+json">${FAQ}</script></head><body><p>No questions here.</p></body></html>`)).toBe('warn')
    expect(faq('<html><body><p>Nothing asked.</p></body></html>')).toBe('fail')
  })

  it('reads freshness from the newest date it can find', () => {
    const stale = readPage(page({ date: '2024-01-01' }))
    const fresh = (over: Partial<Evidence>) => statuses(evidence({ page: stale, ...over })).fresh
    expect(fresh({})).toBe('fail')
    expect(fresh({ sitemapLastmod: '2026-09-30' })).toBe('pass')
    expect(fresh({ headers: { xRobotsTag: null, lastModified: 'Wed, 01 Jan 2026 00:00:00 GMT' } })).toBe('warn')
  })

  it('writes every detail and fix without em dashes', () => {
    for (const c of runChecks(evidence({ botStatus: 403, llmsTxt: null, page: readPage('<p>x</p>') }))) {
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

describe('public view', () => {
  it('keeps the top fixes and only counts the rest', () => {
    const mk = (id: string, status: 'pass' | 'warn' | 'fail', weight: number) => ({ id, label: id, status, weight, detail: `d ${id}`, fix: `f ${id}` })
    const checks = [mk('a', 'fail', 10), mk('b', 'warn', 5), mk('c', 'fail', 3), mk('d', 'warn', 2), mk('e', 'pass', 8)]
    const view = publicView({ url: 'https://x.dev/', checkedAt: 'now', score: 50, checks })
    expect(view.top.map((c) => c.id)).toEqual(['a', 'c', 'b'])
    expect(view.counts).toEqual({ pass: 1, warn: 2, fail: 2, total: 5 })
    const text = JSON.stringify(view)
    expect(text).not.toContain('f d')
    expect(text).not.toContain('"checks"')
  })

  // Never the whole list for free: short reports show one fix in full, the next one's finding
  // without its fix, and nothing of the rest.
  it('never gives away a short list', () => {
    const mk = (id: string, status: 'pass' | 'warn' | 'fail', weight: number) => ({ id, label: id, status, weight, detail: `d ${id}`, fix: `f ${id}` })
    const view = (failing: number, passing = 0) =>
      publicView({
        url: 'https://x.dev/',
        checkedAt: 'now',
        score: 50,
        checks: [
          ...Array.from({ length: failing }, (_, i) => mk(`c${i}`, 'fail', 20 - i)),
          ...Array.from({ length: passing }, (_, i) => mk(`p${i}`, 'pass', 1)),
        ],
      })
    expect(view(0, 3).top).toEqual([])
    const one = view(1, 2)
    expect(one.top.map((c) => [c.id, c.partial ?? false, c.fix])).toEqual([['c0', true, '']])
    expect(JSON.stringify(one)).not.toContain('f c0')
    const two = view(2)
    expect(two.top.map((c) => [c.id, c.partial ?? false])).toEqual([['c0', false], ['c1', true]])
    expect(JSON.stringify(two)).not.toContain('f c1')
    const three = view(3)
    expect(three.top.map((c) => c.id)).toEqual(['c0', 'c1'])
    expect(JSON.stringify(three)).not.toMatch(/f c1|c2/)
    const four = view(4)
    expect(four.top.map((c) => [c.id, c.partial ?? false])).toEqual([['c0', false], ['c1', false], ['c2', false]])
    expect(JSON.stringify(four)).not.toContain('c3')
    expect(view(12).top).toHaveLength(3)
  })
})
