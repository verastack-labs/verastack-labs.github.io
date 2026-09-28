// The Products hand-over (spec 6.04): the stage starts in the studio's ink, then takes each
// product's palette in turn. Stop 0 is the intro; stop i + 1 is product i.
export type Rgb = [number, number, number]
export type HandoverFrame = { stop: number; bg: Rgb; fg: Rgb; panels: number[] }

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1)
const INTRO = 0.12
const BLEND = 0.06

export function hexToRgb(hex: string): Rgb {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const mix = (a: Rgb, b: Rgb, k: number): Rgb => a.map((v, i) => Math.round(v + (b[i] - v) * k)) as Rgb

// Where each stop begins: the intro, then equal shares for the products.
export function stopStarts(products: number): number[] {
  const share = (1 - INTRO) / products
  return [0, ...Array.from({ length: products }, (_, i) => INTRO + share * i)]
}

export function handoverFrame(p: number, palettes: Array<{ bg: Rgb; fg: Rgb }>): HandoverFrame {
  const starts = stopStarts(palettes.length - 1)
  let stop = 0
  starts.forEach((s, i) => {
    if (p >= s) stop = i
  })
  const next = Math.min(stop + 1, starts.length - 1)
  const into = next === stop ? 0 : clamp01((p - (starts[next] - BLEND)) / BLEND)
  const panels = starts.slice(1).map((start, i) => {
    const end = starts[i + 2] ?? 2
    return clamp01((p - start + 0.02) / 0.05) * (1 - clamp01((p - end + 0.05) / 0.04))
  })
  return {
    stop,
    bg: mix(palettes[stop].bg, palettes[next].bg, into),
    fg: mix(palettes[stop].fg, palettes[next].fg, into),
    panels,
  }
}
