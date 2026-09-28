// The footer's giant wordmark (spec 6.08).
export const WORDMARK_CUT = 0.4

// Font size that makes a word measured at 100px fill `boxWidth`.
export function fitFontSize(boxWidth: number, widthAt100: number): number {
  if (widthAt100 <= 0) return 0
  return ((100 * boxWidth) / widthAt100) * 0.995
}

// Height of the box that shows the wordmark with its bottom `cut` share hidden. Letters sit in a
// 0.74em band (Bricolage at line-height 0.8), plus a 0.06em margin above.
export function clipHeight(fontSize: number, cut: number): number {
  return fontSize * 0.74 * (1 - cut) + fontSize * 0.06
}
