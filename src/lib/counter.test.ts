import { describe, expect, it } from 'vitest'
import { formatCounter } from '@/lib/counter'

describe('formatCounter', () => {
  it('pads both numbers to two digits', () => {
    expect(formatCounter(2, 6)).toBe('02/06')
    expect(formatCounter(0, 6)).toBe('00/06')
  })

  it('clamps out-of-range indices', () => {
    expect(formatCounter(-1, 6)).toBe('00/06')
    expect(formatCounter(9, 6)).toBe('06/06')
  })
})
