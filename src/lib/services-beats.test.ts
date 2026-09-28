import { describe, expect, it } from 'vitest'
import { activeService, demoOpenness, snapToHold } from '@/lib/services-beats'

describe('services beats (spec 6.02)', () => {
  it('keeps the demo shut before 0.08 and after 0.55', () => {
    expect(demoOpenness(0)).toBe(0)
    expect(demoOpenness(0.08)).toBe(0)
    expect(demoOpenness(0.55)).toBe(0)
    expect(demoOpenness(1)).toBe(0)
  })

  it('holds the demo fully open from 0.18 to 0.45', () => {
    expect(demoOpenness(0.18)).toBe(1)
    expect(demoOpenness(0.3)).toBe(1)
    expect(demoOpenness(0.45)).toBe(1)
  })

  it('opens and folds smoothly and symmetrically', () => {
    expect(demoOpenness(0.13)).toBeCloseTo(0.5)
    expect(demoOpenness(0.5)).toBeCloseTo(0.5)
    expect(demoOpenness(0.1)).toBeLessThan(demoOpenness(0.12))
    expect(demoOpenness(0.47)).toBeGreaterThan(demoOpenness(0.52))
  })

  it('lights each service in its own stretch', () => {
    expect(activeService(0)).toBe(0)
    expect(activeService(0.54)).toBe(0)
    expect(activeService(0.55)).toBe(1)
    expect(activeService(0.7)).toBe(2)
    expect(activeService(0.85)).toBe(3)
    expect(activeService(1)).toBe(3)
  })

  it('snaps half-open positions into the hold and leaves the rest alone', () => {
    expect(snapToHold(0.15)).toBe(0.18)
    expect(snapToHold(0.3)).toBe(0.3)
    expect(snapToHold(0.48)).toBe(0.45)
    expect(snapToHold(0.05)).toBe(0.05)
    expect(snapToHold(0.7)).toBe(0.7)
  })
})
