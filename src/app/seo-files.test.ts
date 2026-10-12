import { describe, expect, it } from 'vitest'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'

describe('sitemap and robots.txt', () => {
  it('lists only URLs on the studio host', () => {
    const urls = sitemap().map((e) => e.url)
    expect(urls[0]).toBe('https://verastack.dev/')
    for (const url of urls) expect(new URL(url).host).toBe('verastack.dev')
  })

  it('points robots.txt at the studio sitemap', () => {
    expect(robots().sitemap).toBe('https://verastack.dev/sitemap.xml')
    expect(robots().host).toBe('https://verastack.dev')
  })
})
