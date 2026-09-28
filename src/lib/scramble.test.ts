import { describe, expect, it } from 'vitest'
import { SCRAMBLE_CHARS, scrambleFrame } from '@/lib/scramble'

const zero = () => 0

describe('scrambleFrame', () => {
  it('is fully scrambled at the start and keeps the length', () => {
    const frame = scrambleFrame('/services', 0, zero)
    expect(frame).toHaveLength('/services'.length)
    expect(frame.slice(1)).not.toContain('s')
  })

  it('is the real text at the end', () => {
    expect(scrambleFrame('/services', 1, zero)).toBe('/services')
  })

  it('resolves left to right', () => {
    expect(scrambleFrame('abcd', 0.5, zero).slice(0, 2)).toBe('ab')
    expect(scrambleFrame('abcd', 0.5, zero).slice(2)).not.toContain('c')
  })

  it('never scrambles slashes, spaces or punctuation', () => {
    const frame = scrambleFrame('/a b', 0, zero)
    expect(frame[0]).toBe('/')
    expect(frame[2]).toBe(' ')
  })

  it('draws scrambled characters from the charset', () => {
    for (const char of scrambleFrame('abc', 0, () => 0.999)) expect(SCRAMBLE_CHARS).toContain(char)
  })
})
