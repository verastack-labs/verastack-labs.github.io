// A damped spring for values that chase a moving target. Changing the target mid-flight keeps the
// current velocity, so the path bends towards the new target instead of restarting the way a CSS
// transition does.
export type Spring = { x: number; v: number }

export type SpringConfig = {
  // How hard the spring pulls (per second squared).
  stiffness: number
  // 1 settles without overshoot; below 1 overshoots a little.
  damping: number
}

export const spring = (x = 0): Spring => ({ x, v: 0 })

// Small fixed steps keep the spring stable however long a frame takes.
const STEP = 1 / 240

// Advances the spring by dt seconds towards target. Long gaps (a background tab) are capped.
export function stepSpring(s: Spring, target: number, { stiffness, damping }: SpringConfig, dt: number): void {
  const c = 2 * damping * Math.sqrt(stiffness)
  let left = Math.min(dt, 0.064)
  while (left > 0) {
    const h = Math.min(STEP, left)
    s.v += (stiffness * (target - s.x) - c * s.v) * h
    s.x += s.v * h
    left -= h
  }
}
