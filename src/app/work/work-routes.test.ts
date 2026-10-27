import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { liveFacets, pagePieces, pieces, workSlugs } from '@/data/pieces'
import { site } from '@/data/site'
import sitemap from '@/app/sitemap'

describe('/work routes', () => {
  const slugs = workSlugs()

  it('builds every live facet and piece page once, and no client page', () => {
    for (const f of liveFacets) expect(slugs).toContain(f.slug)
    for (const p of pagePieces) expect(slugs).toContain(p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const p of pieces.filter((x) => x.kind === 'client')) expect(slugs).not.toContain(p.slug)
  })

  it('lists the index and every page in the sitemap', () => {
    const urls = sitemap().map((e) => e.url)
    expect(urls).toContain(`${site.url}/work/`)
    for (const s of slugs) expect(urls).toContain(`${site.url}/work/${s}/`)
  })

  it('has every cover and shot on disk', () => {
    for (const p of pagePieces) {
      const files = [p.cover, ...Object.values(p.sections ?? {}).flatMap((s) => s?.shots.map((x) => x.src) ?? [])]
      for (const f of files) expect(existsSync(join(process.cwd(), 'public', f ?? 'missing')), `${p.slug}: ${f}`).toBe(true)
    }
  })
})
