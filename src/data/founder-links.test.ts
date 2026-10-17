import { describe, expect, it } from 'vitest'
import sitemap from '@/app/sitemap'
import { homeGraph, llmsText } from '@/lib/structured-data'

describe('the founder page is linked for engines', () => {
  it('is in the sitemap and llms.txt', () => {
    expect(sitemap().map((e) => e.url)).toContain('https://verastack.dev/founder/')
    expect(llmsText()).toContain('https://verastack.dev/founder/')
  })

  it('makes the home graph founder the same person, with his profiles', () => {
    const person = (homeGraph()['@graph'] as Record<string, unknown>[]).find((n) => n['@type'] === 'Person')!
    expect(person['@id']).toBe('https://verastack.dev/#founder')
    expect(person.url).toBe('https://verastack.dev/founder/')
    expect(person.sameAs).toEqual(['https://riganb.github.io', 'https://github.com/riganb', 'https://www.linkedin.com/in/rigan-burnwal/'])
  })
})
