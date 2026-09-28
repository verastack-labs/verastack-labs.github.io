import { describe, expect, it } from 'vitest'
import { contrastRatio, parseHex, relativeLuminance } from '@/lib/contrast'

describe('parseHex', () => {
  it('parses #RRGGBB in any case', () => {
    expect(parseHex('#d4FF3f')).toEqual({ r: 212, g: 255, b: 63 })
  })

  it('rejects anything that is not #RRGGBB', () => {
    expect(() => parseHex('red')).toThrow('Expected #RRGGBB')
    expect(() => parseHex('#FFF')).toThrow('Expected #RRGGBB')
  })
})

describe('relativeLuminance', () => {
  it('is 0 for black and 1 for white', () => {
    expect(relativeLuminance('#000000')).toBe(0)
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 5)
  })
})

describe('contrastRatio', () => {
  it('is 21 for black on white and symmetric', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5)
    expect(contrastRatio('#0B0C0A', '#F2F3EE')).toBeCloseTo(contrastRatio('#F2F3EE', '#0B0C0A'), 10)
  })

  it('matches a known WCAG value', () => {
    expect(contrastRatio('#767676', '#FFFFFF')).toBeCloseTo(4.54, 2)
  })
})
