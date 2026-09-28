// The Work cinema reel (spec 6.03): each headliner owns an equal share of the pinned scroll. In its
// share it fades in, grows from a framed card to full bleed, holds, and hands over to the next.
export type ReelFrame = { alpha: number; grow: number }

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1)
const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2)

const FADE = 0.08
const GROW_START = 0.08
const GROW_END = 0.55

export function reelFrames(p: number, count: number): ReelFrame[] {
  return Array.from({ length: count }, (_, i) => {
    const t = p * count - i
    const first = i === 0
    const last = i === count - 1
    const fadeIn = first ? 1 : clamp01(t / FADE)
    const fadeOut = last ? 1 : 1 - clamp01((t - (1 - FADE)) / FADE)
    return {
      alpha: t < 0 || t > 1 ? (last && t > 1 ? 1 : 0) : fadeIn * fadeOut,
      grow: easeInOut(clamp01((t - GROW_START) / (GROW_END - GROW_START))),
    }
  })
}

// The intro headline gives way as the first card starts to grow.
export function introAlpha(p: number, count: number): number {
  return 1 - clamp01((p * count - GROW_START) / 0.2)
}

const WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six']

// "Two launches. Both still live." The count comes from the headliners (spec 6.03).
export function workHeadline(count: number): string {
  const word = WORDS[count] ?? String(count)
  if (count === 1) return 'One launch. Still live.'
  if (count === 2) return `${word} launches. Both still live.`
  return `${word} launches. All still live.`
}
