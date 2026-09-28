import type { MotionMode } from '@/lib/motion/mode'

export type HeroSettings = { dprCap: number; cellDivisor: number; fps: number; cursor: boolean }

// Spec 6.01. Static mode has no field at all; the CSS pattern stands in.
export function heroSettings(mode: MotionMode): HeroSettings | null {
  if (mode === 'full') return { dprCap: 1.5, cellDivisor: 46, fps: 60, cursor: true }
  if (mode === 'lite') return { dprCap: 1, cellDivisor: 34, fps: 30, cursor: false }
  return null
}

// Dot cell size in device pixels.
export function cellSize(heightPx: number, divisor: number): number {
  return Math.max(9, heightPx / divisor)
}

// Frame-rate cap: allow a frame once a full frame interval has passed (1 ms of slack for jitter).
export function shouldDraw(now: number, last: number, fps: number): boolean {
  return now - last >= 1000 / fps - 1
}

// Without a cursor the ripple drifts on its own, in field coordinates (-0.5 to 0.5).
export function autoPointer(seconds: number): [number, number] {
  return [0.32 * Math.sin(seconds * 0.23) + 0.08 * Math.sin(seconds * 0.71), 0.22 * Math.cos(seconds * 0.17)]
}
