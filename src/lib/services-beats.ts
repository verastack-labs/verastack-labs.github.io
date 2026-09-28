// Beats of the pinned Services scene as fractions of its scroll progress (spec 6.02).
export const OPEN_START = 0.08
export const HOLD_START = 0.18
export const HOLD_END = 0.45
export const CLOSE_END = 0.55
const SERVICE_STARTS = [0, 0.55, 0.7, 0.85]

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1)
const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2)

// 0 when the index fills the stage, 1 when the demo is fully in.
export function demoOpenness(p: number): number {
  if (p <= OPEN_START || p >= CLOSE_END) return 0
  if (p < HOLD_START) return easeInOut(clamp01((p - OPEN_START) / (HOLD_START - OPEN_START)))
  if (p <= HOLD_END) return 1
  return 1 - easeInOut(clamp01((p - HOLD_END) / (CLOSE_END - HOLD_END)))
}

export function activeService(p: number): number {
  let index = 0
  SERVICE_STARTS.forEach((start, i) => {
    if (p >= start) index = i
  })
  return index
}

// Scrolling that stops with the demo half open settles into the hold instead.
export function snapToHold(p: number): number {
  if (p > OPEN_START + 0.04 && p < HOLD_START) return HOLD_START
  if (p > HOLD_END && p < CLOSE_END - 0.04) return HOLD_END
  return p
}
