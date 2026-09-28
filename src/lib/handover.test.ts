import { describe, expect, it } from 'vitest'
import { handoverFrame, hexToRgb, stopStarts, type Rgb } from '@/lib/handover'

const ink: Rgb = [11, 12, 10]
const white: Rgb = [242, 243, 238]
const palettes = [
  { bg: ink, fg: white },
  { bg: hexToRgb('#0E1318'), fg: white },
  { bg: hexToRgb('#08120E'), fg: white },
  { bg: hexToRgb('#F4EBDA'), fg: hexToRgb('#1A1410') },
]

describe('handover', () => {
  it('reads hex colours', () => {
    expect(hexToRgb('#0E1318')).toEqual([14, 19, 24])
  })

  it('gives the intro 12% and the products equal shares', () => {
    const s = stopStarts(3)
    expect(s[0]).toBe(0)
    expect(s[1]).toBeCloseTo(0.12)
    expect(s[3]).toBeCloseTo(0.12 + (0.88 / 3) * 2)
  })

  it('starts in ink with no product showing', () => {
    const f = handoverFrame(0, palettes)
    expect(f.stop).toBe(0)
    expect(f.bg).toEqual(ink)
    expect(f.panels.every((o) => o === 0)).toBe(true)
  })

  it('settles on each product palette inside its share', () => {
    const f = handoverFrame(0.25, palettes)
    expect(f.stop).toBe(1)
    expect(f.bg).toEqual([14, 19, 24])
    expect(f.panels[0]).toBe(1)
  })

  it('ends on the last product with its own text colour', () => {
    const f = handoverFrame(1, palettes)
    expect(f.stop).toBe(3)
    expect(f.fg).toEqual([26, 20, 16])
    expect(f.panels[2]).toBe(1)
  })

  it('blends colours just before a new stop', () => {
    const start = stopStarts(3)[2]
    const f = handoverFrame(start - 0.03, palettes)
    expect(f.bg).not.toEqual(palettes[1].bg)
    expect(f.bg).not.toEqual(palettes[2].bg)
  })
})
