import { describe, expect, it } from 'vitest'
import { services } from '@/data/services'
import { LEAD, activeService, demoOpenness, snapToHold } from '@/lib/services-beats'

describe('services beats (spec 6.02)', () => {
  it('keeps the demo shut before 0.17 and after 0.64', () => {
    expect(demoOpenness(0)).toBe(0)
    expect(demoOpenness(0.17)).toBe(0)
    expect(demoOpenness(0.64)).toBe(0)
    expect(demoOpenness(1)).toBe(0)
  })

  it('holds the demo fully open from 0.27 to 0.54', () => {
    expect(demoOpenness(0.27)).toBe(1)
    expect(demoOpenness(0.4)).toBe(1)
    expect(demoOpenness(0.54)).toBe(1)
  })

  it('opens and folds smoothly and symmetrically', () => {
    expect(demoOpenness(0.22)).toBeCloseTo(0.5)
    expect(demoOpenness(0.59)).toBeCloseTo(0.5)
    expect(demoOpenness(0.19)).toBeLessThan(demoOpenness(0.21))
    expect(demoOpenness(0.56)).toBeGreaterThan(demoOpenness(0.61))
  })

  it('lights each service in its own stretch, the lead through the demo', () => {
    expect(activeService(0)).toBe(0)
    expect(activeService(0.08)).toBe(0)
    expect(activeService(0.09)).toBe(LEAD)
    expect(activeService(0.63)).toBe(LEAD)
    expect(activeService(0.64)).toBe(2)
    expect(activeService(0.73)).toBe(3)
    expect(activeService(0.82)).toBe(4)
    expect(activeService(0.91)).toBe(5)
    expect(activeService(1)).toBe(5)
  })

  it('puts the demo on the lead service', () => {
    expect(services[LEAD].lead).toBe(true)
    expect(services.filter((s) => s.lead)).toHaveLength(1)
  })

  it('snaps half-open positions into the hold and leaves the rest alone', () => {
    expect(snapToHold(0.24)).toBe(0.27)
    expect(snapToHold(0.4)).toBe(0.4)
    expect(snapToHold(0.57)).toBe(0.54)
    expect(snapToHold(0.05)).toBe(0.05)
    expect(snapToHold(0.8)).toBe(0.8)
  })
})
