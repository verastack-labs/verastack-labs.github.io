import { describe, expect, it } from 'vitest'
import { checker, checks, faqs } from '@/data/ai-search-check'
import { contact } from '@/data/contact'
import sitemap from '@/app/sitemap'
import { llmsText } from '@/lib/structured-data'
import { runChecks } from '../../workers/aeo-check/src/score'
import { readPage } from '../../workers/aeo-check/src/html'

describe('AI search check page', () => {
  it('explains exactly the checks the Worker runs, in the same order', () => {
    const ran = runChecks({ finalUrl: 'https://a.example.com/', headers: { xRobotsTag: null }, page: readPage(''), robots: null, llmsTxt: false, sitemap: false, botStatus: null })
    expect(checks.map((c) => c.id)).toEqual(ran.map((c) => c.id))
    expect(checks.map((c) => c.label)).toEqual(ran.map((c) => c.label))
  })

  it('is in the sitemap and llms.txt, and its audit link prefills the contact form', () => {
    expect(sitemap().map((e) => e.url)).toContain(`https://verastack.dev${checker.path}/`)
    expect(llmsText()).toContain(`https://verastack.dev${checker.path}/`)
    expect(contact.services).toContain(contact.prefillService['ai-search'])
  })

  it('keeps its copy free of em dashes and its description sized for search results', () => {
    const copy = [checker.title, checker.description, ...checks.flatMap((c) => [c.label, c.why]), ...faqs.flatMap((f) => [f.q, f.a])].join(' ')
    expect(copy).not.toContain(String.fromCodePoint(0x2014))
    expect(checker.description.length).toBeLessThan(170)
  })
})
