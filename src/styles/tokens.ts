// The Signal palette (spec 4.2). Dark only. `dim` is for inactive states and is below AA on
// purpose; `static` motion mode swaps it for `muted`.
export const tokens = {
  ink: '#0B0C0A',
  surface: '#1B1D18',
  line: '#2A2D25',
  text: '#F2F3EE',
  muted: '#A3A69B',
  dim: '#3B3E35',
  signal: '#D4FF3F',
  alert: '#FF6B4A',
} as const

export type TokenName = keyof typeof tokens

export function tokensToCss(): string {
  const vars = Object.entries(tokens)
    .map(([name, value]) => `--${name}:${value};`)
    .join('')
  return `:root{${vars}}`
}
