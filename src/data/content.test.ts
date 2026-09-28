import { describe, expect, it } from 'vitest'
import { site } from '@/data/site'
import { sections } from '@/data/sections'
import { products } from '@/data/products'
import { hero } from '@/data/hero'
import { services } from '@/data/services'
import { configurator } from '@/data/configurator'
import { work, headliners } from '@/data/work'
import { process } from '@/data/process'
import { capabilities } from '@/data/capabilities'
import { team } from '@/data/team'

// Built from its code point so this file never contains the character itself.
const EM_DASH = String.fromCodePoint(0x2014)

// Add every data module here as it is created.
const modules: Record<string, unknown> = { site, sections, products, hero, services, configurator, work, process, capabilities, team }

function collectStrings(value: unknown, path: string): Array<[string, string]> {
  if (typeof value === 'string') return [[path, value]]
  if (Array.isArray(value)) return value.flatMap((item, i) => collectStrings(item, `${path}[${i}]`))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => collectStrings(item, `${path}.${key}`))
  }
  return []
}

const strings = Object.entries(modules).flatMap(([name, value]) => collectStrings(value, name))

describe('content', () => {
  it('has strings to check', () => {
    expect(strings.length).toBeGreaterThan(20)
  })

  it('never uses an em dash', () => {
    const offenders = strings.filter(([, s]) => s.includes(EM_DASH)).map(([p]) => p)
    expect(offenders).toEqual([])
  })

  it('lists the seven sections in page order, each path matching its id', () => {
    expect(sections.map((s) => s.id)).toEqual(['top', 'services', 'work', 'products', 'process', 'about', 'contact'])
    for (const s of sections) expect(s.path).toBe(s.id === 'top' ? '/' : `/${s.id}`)
  })

  it('links live products and leaves coming-soon products unlinked', () => {
    for (const p of products) {
      if (p.status === 'live') expect(p.url).toMatch(/^https:\/\//)
      else expect(p.url).toBeNull()
    }
  })

  it('points the hero calls to action at real sections', () => {
    const ids = sections.map((s) => `#${s.id}`)
    expect(ids).toContain(hero.primary.href)
    expect(ids).toContain(hero.secondary.href)
  })

  it('credits every piece of work to a role', () => {
    for (const w of work) expect(['employee', 'freelance']).toContain(w.role)
  })

  it('shows no visuals or live link for work that is still launching (spec 7.2)', () => {
    for (const w of work.filter((x) => x.status === 'launching')) {
      expect(w.media).toBeNull()
      expect(w.art).toBeUndefined()
      expect(w.liveUrl).toBeNull()
      expect(w.tier).toBe('supporting')
    }
  })

  it('gives every headliner a live link, a case study and artwork until its recording arrives', () => {
    expect(headliners.length).toBeGreaterThan(0)
    for (const w of headliners) {
      expect(w.liveUrl).toMatch(/^https:\/\//)
      expect(w.caseStudyUrl).toMatch(/^https:\/\//)
      expect(w.media ?? w.art).toBeTruthy()
    }
  })
})
