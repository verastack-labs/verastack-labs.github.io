import { describe, expect, it } from 'vitest'
import { configurator, priceOf, type Selection } from '@/data/configurator'

describe('configurator demo', () => {
  it('offers 12 combinations', () => {
    expect(configurator.groups.reduce((n, g) => n * g.choices.length, 1)).toBe(12)
  })

  it('starts at the base price with the defaults', () => {
    expect(priceOf(configurator.defaults, 'inr')).toBe(configurator.base.inr)
    expect(priceOf(configurator.defaults, 'usd')).toBe(configurator.base.usd)
  })

  it('adds each option on top of the base', () => {
    const all: Selection = { case: 'signal', keycaps: 'ink', switches: 'tactile' }
    expect(priceOf(all, 'inr')).toBe(12999 + 2500 + 2000 + 1200)
    expect(priceOf(all, 'usd')).toBe(149 + 29 + 24 + 15)
  })

  it('makes the defaults the free choices', () => {
    for (const g of configurator.groups) {
      const d = g.choices.find((c) => c.id === configurator.defaults[g.id])!
      expect(d.delta).toEqual({ inr: 0, usd: 0 })
    }
  })
})
