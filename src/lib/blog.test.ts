import { describe, expect, it } from 'vitest'
import { allPosts, parsePost, published, readingMinutes } from '@/lib/blog'
import sitemap from '@/app/sitemap'

describe('blog', () => {
  it('parses front matter, keeping colons inside the title', () => {
    const post = parsePost('x', '---\ntitle: AI search: a guide\ndescription: d\ndate: 2026-10-17\ncategory: studies\ntags: a, b\n---\n\n## Hello\n\nWorld.')
    expect(post.title).toBe('AI search: a guide')
    expect(post.tags).toEqual(['a', 'b'])
    expect(post.html).toContain('<h2>Hello</h2>')
  })

  it('refuses a post without a description', () => {
    expect(() => parsePost('x', '---\ntitle: t\ndate: 2026-10-17\ncategory: studies\n---\nbody')).toThrow(/description/)
  })

  it('refuses a post without a known category', () => {
    expect(() => parsePost('x', '---\ntitle: t\ndescription: d\ndate: 2026-10-17\n---\nbody')).toThrow(/category/)
    expect(() => parsePost('x', '---\ntitle: t\ndescription: d\ndate: 2026-10-17\ncategory: gossip\n---\nbody')).toThrow(/unknown category/)
  })

  it('gives every post a real date, a description sized for search results, and no em dashes', () => {
    const posts = allPosts()
    expect(posts.length).toBeGreaterThan(0)
    for (const p of posts) {
      expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      if (p.time) expect(p.time).toMatch(/^([01]\d|2[0-3]):[0-5]\d$/)
      expect(Number.isNaN(Date.parse(p.date))).toBe(false)
      expect(p.description.length).toBeGreaterThan(70)
      expect(p.description.length).toBeLessThanOrEqual(170)
      expect(`${p.title} ${p.description} ${p.html}`).not.toContain(String.fromCodePoint(0x2014))
      expect(readingMinutes(p.words)).toBeGreaterThan(0)
    }
  })

  it('lists the blog and every post in the sitemap, newest first', () => {
    const urls = sitemap().map((e) => e.url)
    expect(urls).toContain('https://verastack.dev/blog/')
    for (const p of allPosts()) expect(urls).toContain(`https://verastack.dev/blog/${p.slug}/`)
    const stamps = allPosts().map(published)
    expect([...stamps].sort().reverse()).toEqual(stamps)
    // Same-day posts: the newest leads.
    expect(allPosts()[0].slug).toBe('spot-the-slop')
  })
})
