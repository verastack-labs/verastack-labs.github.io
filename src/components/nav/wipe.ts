// The radius a circle centred on (x, y) needs to just cover a w x h screen: the distance to the
// farthest corner, plus a pixel so no anti-aliased edge shows. A bigger circle wastes the first part
// of the closing wipe shrinking off screen, which reads as a lag after the tap.
export function coverRadius(x: number, y: number, w: number, h: number): number {
  return Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y))) + 1
}
