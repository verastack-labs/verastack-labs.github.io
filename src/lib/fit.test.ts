import { describe, expect, it } from 'vitest'
import { WORDMARK_CUT, clipHeight, fitFontSize } from '@/lib/fit'

describe('fitFontSize', () => {
  it('scales the 100px measurement to fill the box, with a hair of slack', () => {
    expect(fitFontSize(1129, 586)).toBeCloseTo((100 * 1129) / 586 * 0.995, 5)
  })

  it('returns 0 for an unmeasured word', () => {
    expect(fitFontSize(1000, 0)).toBe(0)
  })
})

describe('clipHeight', () => {
  it('keeps the uncut share of the letter height plus a small top margin', () => {
    expect(clipHeight(200, 0.4)).toBeCloseTo(200 * 0.74 * 0.6 + 200 * 0.06, 5)
  })

  it('shows the whole letter height at no cut', () => {
    expect(clipHeight(100, 0)).toBeCloseTo(80, 5)
  })

  it('uses a 40% cut for the footer (spec 6.08)', () => {
    expect(WORDMARK_CUT).toBe(0.4)
  })
})
