import { describe, expect, it } from 'vitest'
import { formatIndiaTime } from '@/lib/india-time'

describe('formatIndiaTime', () => {
  it('shows India time in 12-hour lowercase form', () => {
    expect(formatIndiaTime(new Date('2026-09-28T02:05:00Z'))).toBe('7:35 am')
    expect(formatIndiaTime(new Date('2026-09-28T15:45:00Z'))).toBe('9:15 pm')
  })
})
