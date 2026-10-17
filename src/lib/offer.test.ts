import { describe, expect, it } from 'vitest'
import { OFFER_EVERY_MS, offerDue, offerMoment, type OfferMoment } from '@/lib/offer'

describe('how often the offer may open', () => {
  const now = 1_800_000_000_000

  it('is due on a first visit or with an unreadable timestamp', () => {
    expect(offerDue(null, now)).toBe(true)
    expect(offerDue(Number('junk'), now)).toBe(true)
  })

  it('waits 14 days after it was shown', () => {
    expect(OFFER_EVERY_MS).toBe(14 * 24 * 60 * 60 * 1000)
    expect(offerDue(now - 7 * 24 * 60 * 60 * 1000, now)).toBe(false)
    expect(offerDue(now - OFFER_EVERY_MS + 1, now)).toBe(false)
    expect(offerDue(now - OFFER_EVERY_MS, now)).toBe(true)
  })

  it('never opens again once they applied or ran the check', () => {
    expect(offerDue(null, now, true)).toBe(false)
  })

  it('ignores a timestamp from the future', () => {
    expect(offerDue(now + 60_000, now)).toBe(true)
  })
})

describe('when the offer may open', () => {
  const calm: OfferMoment = { exitIntent: false, idleMs: 3000, onHome: false, pastWork: false, readMs: 0, pagesThisVisit: 1 }

  it('opens when a laptop pointer heads for the tabs, even mid-scroll', () => {
    expect(offerMoment({ ...calm, exitIntent: true, idleMs: 0 })).toBe(true)
  })

  it('never opens mid-scroll', () => {
    expect(offerMoment({ ...calm, onHome: true, pastWork: true, idleMs: 400 })).toBe(false)
    expect(offerMoment({ ...calm, pagesThisVisit: 3, readMs: 90_000, idleMs: 400 })).toBe(false)
  })

  it('opens on the home page once the Work section has been read, at a pause', () => {
    expect(offerMoment({ ...calm, onHome: true, pastWork: false })).toBe(false)
    expect(offerMoment({ ...calm, onHome: true, pastWork: true })).toBe(true)
  })

  it('leaves the landing page alone, and waits 45 seconds on later pages', () => {
    expect(offerMoment({ ...calm, readMs: 120_000, pagesThisVisit: 1 })).toBe(false)
    expect(offerMoment({ ...calm, readMs: 44_000, pagesThisVisit: 2 })).toBe(false)
    expect(offerMoment({ ...calm, readMs: 45_000, pagesThisVisit: 2 })).toBe(true)
  })
})
