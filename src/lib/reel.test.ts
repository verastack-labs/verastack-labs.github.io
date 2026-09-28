import { describe, expect, it } from 'vitest'
import { introAlpha, reelFrames, workHeadline } from '@/lib/reel'

describe('workHeadline', () => {
  it('counts the headliners in words', () => {
    expect(workHeadline(1)).toBe('One launch. Still live.')
    expect(workHeadline(2)).toBe('Two launches. Both still live.')
    expect(workHeadline(3)).toBe('Three launches. All still live.')
  })
})

describe('reelFrames', () => {
  it('shows the first card framed at the start', () => {
    const [a, b] = reelFrames(0, 2)
    expect(a).toEqual({ alpha: 1, grow: 0 })
    expect(b.alpha).toBe(0)
  })

  it('grows each card to full bleed inside its own share', () => {
    expect(reelFrames(0.3, 2)[0].grow).toBe(1)
    expect(reelFrames(0.8, 2)[1].grow).toBe(1)
    expect(reelFrames(0.1, 2)[0].grow).toBeGreaterThan(0)
    expect(reelFrames(0.1, 2)[0].grow).toBeLessThan(1)
  })

  it('hands over from one card to the next', () => {
    const [a, b] = reelFrames(0.52, 2)
    expect(a.alpha).toBe(0)
    expect(b.alpha).toBeGreaterThan(0)
  })

  it('keeps the last card on screen at the end', () => {
    expect(reelFrames(1, 2)[1].alpha).toBe(1)
    expect(reelFrames(1, 3)[2].alpha).toBe(1)
  })
})

describe('introAlpha', () => {
  it('shows the intro until the first card grows', () => {
    expect(introAlpha(0, 2)).toBe(1)
    expect(introAlpha(0.3, 2)).toBe(0)
  })
})
