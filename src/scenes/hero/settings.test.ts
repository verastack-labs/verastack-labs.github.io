import { describe, expect, it } from 'vitest'
import { autoPointer, cellSize, heroSettings, shouldDraw } from '@/scenes/hero/settings'

describe('heroSettings', () => {
  it('runs the full field on a capable desktop', () => {
    expect(heroSettings('full')).toEqual({ dprCap: 1.5, cellDivisor: 46, fps: 60, cursor: true })
  })

  it('runs a lighter field on phones and weak devices', () => {
    expect(heroSettings('lite')).toEqual({ dprCap: 1, cellDivisor: 34, fps: 30, cursor: false })
  })

  it('runs no field for reduced motion', () => {
    expect(heroSettings('static')).toBeNull()
  })
})

describe('cellSize', () => {
  it('divides the viewport height, never below 9 device pixels', () => {
    expect(cellSize(920, 46)).toBeCloseTo(20, 5)
    expect(cellSize(300, 46)).toBe(9)
  })
})

describe('shouldDraw', () => {
  it('draws every frame at 60 fps', () => {
    expect(shouldDraw(1016, 1000, 60)).toBe(true)
  })

  it('skips frames that come too soon at 30 fps', () => {
    expect(shouldDraw(1016, 1000, 30)).toBe(false)
    expect(shouldDraw(1033, 1000, 30)).toBe(true)
  })
})

describe('autoPointer', () => {
  it('stays inside the field', () => {
    for (let s = 0; s < 120; s += 0.7) {
      const [x, y] = autoPointer(s)
      expect(Math.abs(x)).toBeLessThanOrEqual(0.5)
      expect(Math.abs(y)).toBeLessThanOrEqual(0.5)
    }
  })

  it('moves over time', () => {
    expect(autoPointer(0)).not.toEqual(autoPointer(3))
  })
})
