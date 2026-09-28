import { describe, expect, it } from 'vitest'
import { railProgress, stepsOn } from '@/lib/rail'

const rail = { left: 40, width: 1200 }
// Four columns: the flaps sit at each column's left edge.
const flaps = [40, 350, 660, 970]

describe('railProgress', () => {
  it('stays still for the first and last 10% of the hold', () => {
    expect(railProgress(0)).toBe(0)
    expect(railProgress(0.1)).toBe(0)
    expect(railProgress(0.9)).toBe(1)
    expect(railProgress(1)).toBe(1)
    expect(railProgress(0.5)).toBeCloseTo(0.5)
  })
})

describe('stepsOn', () => {
  it('keeps every step off before the rail starts', () => {
    expect(stepsOn(rail, 0, flaps)).toEqual([false, false, false, false])
  })

  it('turns the first step on as soon as the rail moves', () => {
    expect(stepsOn(rail, 0.001, flaps)).toEqual([true, false, false, false])
  })

  it('turns a step on exactly when the tip reaches its flap', () => {
    const atThird = (660 - 40) / 1200
    expect(stepsOn(rail, atThird - 0.001, flaps)).toEqual([true, true, false, false])
    expect(stepsOn(rail, atThird, flaps)).toEqual([true, true, true, false])
  })

  it('has every step on once the rail is drawn', () => {
    expect(stepsOn(rail, 1, flaps)).toEqual([true, true, true, true])
  })
})
