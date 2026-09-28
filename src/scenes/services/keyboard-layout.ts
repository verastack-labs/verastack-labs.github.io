// A 65% layout in key units (1u = one letter key). Shared by the 3D model and the flat fallback.
export type Key = { x: number; y: number; w: number; accent: boolean }

// Each row is 16u wide. Negative widths mark accent keys (Esc, Enter and the arrows).
const ROWS: number[][] = [
  [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 1],
  [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -2.25, 1],
  [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.75, -1, 1],
  [1.25, 1.25, 1.25, 6.25, 1, 1, 1, -1, -1, -1],
]

export const LAYOUT_WIDTH = 16
export const LAYOUT_DEPTH = ROWS.length

export const KEYS: Key[] = ROWS.flatMap((row, y) => {
  let x = 0
  return row.map((signed) => {
    const w = Math.abs(signed)
    const key = { x, y, w, accent: signed < 0 }
    x += w
    return key
  })
})
