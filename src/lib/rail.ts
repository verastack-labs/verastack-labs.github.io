// The process rail (spec 6.05). It draws over the middle 80% of the pinned hold, still at both ends.
const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1)

export function railProgress(p: number): number {
  return clamp01((p - 0.1) / 0.8)
}

// A step switches on the moment the rail's tip reaches its flap's left edge. Positions are
// measured from layout (spec 5.2), so this takes pixels, not fractions.
export function stepsOn(rail: { left: number; width: number }, progress: number, flapLefts: number[]): boolean[] {
  const tip = rail.left + rail.width * progress
  return flapLefts.map((left) => progress > 0 && tip >= left)
}
