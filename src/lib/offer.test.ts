import { describe, expect, it } from 'vitest'
import { OFFER_EVERY_MS, offerDue, scrollDepth } from '@/lib/offer'

describe('offer timing', () => {
  const now = 1_800_000_000_000

  it('is due on a first visit or with an unreadable timestamp', () => {
    expect(offerDue(null, now)).toBe(true)
    expect(offerDue(Number('junk'), now)).toBe(true)
  })

  it('waits 7 days after it was shown', () => {
    expect(offerDue(now - 1000, now)).toBe(false)
    expect(offerDue(now - OFFER_EVERY_MS + 1, now)).toBe(false)
    expect(offerDue(now - OFFER_EVERY_MS, now)).toBe(true)
  })

  it('ignores a timestamp from the future', () => {
    expect(offerDue(now + 60_000, now)).toBe(true)
  })

  it('measures scroll depth against the scrollable room', () => {
    expect(scrollDepth(0, 800, 2800)).toBe(0)
    expect(scrollDepth(1000, 800, 2800)).toBe(0.5)
    expect(scrollDepth(5000, 800, 2800)).toBe(1)
    expect(scrollDepth(0, 800, 600)).toBe(0)
  })
})
