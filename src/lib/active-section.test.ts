import { describe, expect, it } from 'vitest'
import { activeIndex } from '@/lib/active-section'

describe('activeIndex', () => {
  const tops = [0, 800, 1600, 2400]

  it('is the last section whose top is at or above the probe', () => {
    expect(activeIndex(tops.map((t) => t - 0), 60)).toBe(0)
    expect(activeIndex(tops.map((t) => t - 800), 60)).toBe(1)
    expect(activeIndex(tops.map((t) => t - 1700), 60)).toBe(2)
  })

  it('switches exactly when a top crosses the probe', () => {
    expect(activeIndex(tops.map((t) => t - 740), 60)).toBe(1)
    expect(activeIndex(tops.map((t) => t - 739), 60)).toBe(0)
  })

  it('is 0 above the first section and for an empty list', () => {
    expect(activeIndex([100, 900], 60)).toBe(0)
    expect(activeIndex([], 60)).toBe(0)
  })
})
