import { describe, expect, it } from 'vitest'
import { contrastRatio } from '@/lib/contrast'
import { facets, liveFacets, pagePieces, pieces, RESERVED } from '@/data/pieces'

// Built from its code point so this file never contains the character itself.
const EM_DASH = String.fromCodePoint(0x2014)

describe('pieces', () => {
  it('has unique slugs and none reserved', () => {
    const slugs = pieces.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const s of slugs) expect(RESERVED).not.toContain(s)
    for (const f of facets) expect(RESERVED).toContain(f.slug)
    expect(RESERVED).toContain('lab')
    expect(RESERVED).toContain('concepts')
  })

  it('labels every concept as a concept', () => {
    const concepts = pieces.filter((p) => p.kind === 'concept')
    expect(concepts.length).toBeGreaterThan(0)
    for (const p of concepts) {
      expect(p.concept).toBeDefined()
      expect(p.title).toMatch(/\(concept\)$/)
      expect(p.credit).toMatch(/^Concept/)
    }
    for (const p of pieces.filter((x) => x.kind !== 'concept')) expect(p.concept).toBeUndefined()
  })

  it('keeps private and excluded work out', () => {
    for (const p of pieces) expect(`${p.slug} ${p.title} ${p.line}`).not.toMatch(/ginkvora|farm advisors|farm-advisors|cold stone|cold-stone/i)
  })

  it('credits client work to Rigan and links it out', () => {
    const clients = pieces.filter((p) => p.kind === 'client')
    expect(clients.length).toBeGreaterThan(0)
    for (const p of clients) {
      expect(p.page).toBe(false)
      expect(p.external?.url).toMatch(/^https:\/\/riganb\.github\.io\/work\//)
      expect(p.credit).toMatch(/^Rigan Burnwal, (as an employee|freelance)$/)
    }
  })

  it('keeps every theme readable and soft', () => {
    for (const { slug, theme } of pieces) {
      expect(contrastRatio(theme.fg, theme.bg), `${slug} fg`).toBeGreaterThanOrEqual(7)
      expect(contrastRatio(theme.muted, theme.bg), `${slug} muted`).toBeGreaterThanOrEqual(4.5)
      expect(contrastRatio(theme.onAccent, theme.accent), `${slug} accent`).toBeGreaterThanOrEqual(4.5)
      for (const c of [theme.bg, theme.fg, theme.muted, theme.accent, theme.onAccent]) expect(c.toUpperCase()).not.toMatch(/^#(000000|FFFFFF)$/)
    }
  })

  it('only gives sections for the disciplines a piece claims', () => {
    for (const p of pieces) for (const d of Object.keys(p.sections ?? {})) expect(p.disciplines).toContain(d)
  })

  it('gives every page piece a cover and at least one section', () => {
    for (const p of pagePieces) {
      expect(p.cover, p.slug).toBeTruthy()
      expect(Object.keys(p.sections ?? {}).length, p.slug).toBeGreaterThan(0)
    }
  })

  it('gives every page piece a brief, facts, small things and a motif', () => {
    for (const p of pagePieces) {
      expect(p.brief, p.slug).toBeTruthy()
      expect(p.facts?.length, p.slug).toBeGreaterThanOrEqual(3)
      expect(p.details?.length, p.slug).toBeGreaterThanOrEqual(3)
      expect(p.theme.motif, p.slug).toBeDefined()
    }
  })

  it('keeps prices off concept pages', () => {
    for (const p of pieces.filter((x) => x.kind === 'concept')) expect(JSON.stringify(p), p.slug).not.toMatch(/[₹$€£]\s?\d/)
  })

  it('orders pieces newest first', () => {
    for (let i = 1; i < pieces.length; i++) expect(pieces[i - 1].date >= pieces[i].date).toBe(true)
  })

  it('drops facets with no pieces', () => {
    for (const f of liveFacets) expect(pieces.some(f.filter)).toBe(true)
    for (const f of facets.filter((x) => !liveFacets.includes(x))) expect(pieces.some(f.filter)).toBe(false)
  })

  it('never uses an em dash', () => {
    expect(JSON.stringify(pieces)).not.toContain(EM_DASH)
  })
})
