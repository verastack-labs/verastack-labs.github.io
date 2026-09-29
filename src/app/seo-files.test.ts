import { describe, expect, it } from 'vitest'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { products } from '@/data/products'

describe('sitemap and robots.txt', () => {
  const urls = sitemap().map((e) => e.url)

  it('lists the home page first, then every product landing page', () => {
    expect(urls[0]).toBe('https://verastack-labs.github.io/')
    expect(urls[1]).toBe('https://verastack-labs.github.io/origan/')
    for (const path of ['/origan/', '/rigseed/', '/riggit/', '/mehfil/']) {
      expect(urls).toContain(`https://verastack-labs.github.io${path}`)
    }
  })

  it('covers every product that has a page', () => {
    for (const p of products.filter((p) => p.url)) expect(urls).toContain(p.url)
  })

  it('points robots.txt at the root sitemap and the landing pages that publish their own', () => {
    expect(robots().sitemap).toEqual([
      'https://verastack-labs.github.io/sitemap.xml',
      'https://verastack-labs.github.io/origan/sitemap.xml',
      'https://verastack-labs.github.io/riggit/sitemap.xml',
    ])
  })
})
