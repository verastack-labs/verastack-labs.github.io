import { describe, expect, it } from 'vitest'
import { homeGraph, jsonLd, llmsText } from '@/lib/structured-data'

type Node = Record<string, unknown>
const graph = homeGraph()['@graph'] as Node[]
const byType = (t: string) => graph.find((n) => n['@type'] === t)!

describe('structured data', () => {
  it('describes the studio as an Organization founded by the founder', () => {
    const org = byType('Organization')
    const person = byType('Person')
    expect(org.name).toBe('VeraStack Labs')
    expect(org.founder).toEqual({ '@id': person['@id'] })
  })

  it('offers every service, and only the live products, each with a link', () => {
    const offers = (byType('Organization').makesOffer as Array<{ itemOffered: Node }>).map((o) => o.itemOffered)
    const named = offers.filter((o) => o['@type'] === 'Service').map((o) => o.name)
    expect(named).toHaveLength(5)
    expect(named).toContain('Origan')
    const apps = offers.filter((o) => o['@type'] === 'SoftwareApplication')
    expect(apps.map((o) => o.name)).toEqual(['rigseed', 'Riggit'])
    for (const o of apps) expect(o.url).toMatch(/^https:\/\//)
  })

  it('escapes anything that could close the script tag', () => {
    expect(jsonLd({ a: '</script>' })).not.toContain('</script>')
  })
})

describe('llms.txt', () => {
  const text = llmsText()

  it('opens with the studio name and credits client work to the founder', () => {
    expect(text.startsWith('# VeraStack Labs\n')).toBe(true)
    expect(text).toContain('Done by the founder personally')
    expect(text).toContain('Ultraviolette')
  })

  it('never doubles a full stop and never uses an em dash', () => {
    expect(text).not.toMatch(/[^.]\.\.(?!\.)/)
    expect(text).not.toContain(String.fromCodePoint(0x2014))
  })
})
