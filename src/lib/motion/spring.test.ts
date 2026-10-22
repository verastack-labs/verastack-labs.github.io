import { describe, expect, it } from 'vitest'
import { spring, stepSpring } from '@/lib/motion/spring'

const run = (s: ReturnType<typeof spring>, target: number, seconds: number, cfg = { stiffness: 120, damping: 0.8 }) => {
  for (let t = 0; t < seconds; t += 1 / 60) stepSpring(s, target, cfg, 1 / 60)
}

describe('stepSpring', () => {
  it('settles on the target', () => {
    const s = spring(0)
    run(s, 100, 2)
    expect(s.x).toBeCloseTo(100, 1)
    expect(Math.abs(s.v)).toBeLessThan(0.5)
  })

  it('does not overshoot when critically damped', () => {
    const s = spring(0)
    let peak = 0
    for (let t = 0; t < 2; t += 1 / 60) {
      stepSpring(s, 100, { stiffness: 120, damping: 1 }, 1 / 60)
      peak = Math.max(peak, s.x)
    }
    expect(peak).toBeLessThanOrEqual(100.01)
  })

  it('keeps its velocity when the target changes mid-flight', () => {
    const s = spring(0)
    run(s, 100, 0.15)
    expect(s.v).toBeGreaterThan(0)
    stepSpring(s, -100, { stiffness: 120, damping: 0.8 }, 1 / 240)
    // Still carrying forward: it curves round to the new target rather than restarting from rest.
    expect(s.v).toBeGreaterThan(0)
  })

  it('stays stable through a long frame', () => {
    const s = spring(0)
    stepSpring(s, 100, { stiffness: 400, damping: 0.7 }, 5)
    expect(Number.isFinite(s.x)).toBe(true)
    expect(Math.abs(s.x)).toBeLessThan(200)
  })
})
