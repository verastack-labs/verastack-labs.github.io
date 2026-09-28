import { describe, expect, it } from 'vitest'
import { homeGraph, jsonLd } from '@/lib/structured-data'

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

  it('offers only live products, each with a link', () => {
    const offers = byType('Organization').makesOffer as Array<{ itemOffered: Node }>
    expect(offers.map((o) => o.itemOffered.name)).toEqual(['rigseed', 'Riggit'])
    for (const o of offers) expect(o.itemOffered.url).toMatch(/^https:\/\//)
  })

  it('escapes anything that could close the script tag', () => {
    expect(jsonLd({ a: '</script>' })).not.toContain('</script>')
  })
})
