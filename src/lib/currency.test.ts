import { describe, expect, it } from 'vitest'
import { detectCurrency, formatMoney } from '@/lib/currency'

describe('detectCurrency (spec 6.07)', () => {
  it('picks rupees for an Indian time zone', () => {
    expect(detectCurrency({ timeZone: 'Asia/Kolkata', languages: ['en-US'] })).toBe('inr')
    expect(detectCurrency({ timeZone: 'Asia/Calcutta', languages: [] })).toBe('inr')
  })

  it('picks rupees for any -IN language', () => {
    expect(detectCurrency({ timeZone: 'Europe/London', languages: ['en-GB', 'hi-IN'] })).toBe('inr')
  })

  it('picks dollars for everyone else, and when nothing is known', () => {
    expect(detectCurrency({ timeZone: 'America/New_York', languages: ['en-US'] })).toBe('usd')
    expect(detectCurrency({ timeZone: undefined, languages: [] })).toBe('usd')
  })
})

describe('formatMoney', () => {
  it('groups rupees the Indian way', () => {
    expect(formatMoney(124999, 'inr')).toBe('₹1,24,999')
    expect(formatMoney(999, 'inr')).toBe('₹999')
  })

  it('groups dollars in thousands', () => {
    expect(formatMoney(1499, 'usd')).toBe('$1,499')
    expect(formatMoney(149, 'usd')).toBe('$149')
  })

  it('rounds counting-up values to whole units', () => {
    expect(formatMoney(149.6, 'usd')).toBe('$150')
  })
})
