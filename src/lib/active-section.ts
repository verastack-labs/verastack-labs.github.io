// The nav decides the current section with a probe line this far below the top (spec 6.00).
export const PROBE_Y = 60

// `tops` are each section's top edge relative to the viewport, in page order.
export function activeIndex(tops: number[], probe: number): number {
  let index = 0
  tops.forEach((top, i) => {
    if (top <= probe) index = i
  })
  return index
}
