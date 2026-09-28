import { describe, expect, it } from 'vitest'
import { KEYS, LAYOUT_DEPTH, LAYOUT_WIDTH } from '@/scenes/services/keyboard-layout'

describe('keyboard layout', () => {
  it('fills every row to the full width', () => {
    for (let y = 0; y < LAYOUT_DEPTH; y++) {
      const row = KEYS.filter((k) => k.y === y)
      const last = row[row.length - 1]
      expect(last.x + last.w).toBe(LAYOUT_WIDTH)
    }
  })

  it('marks Esc, Enter and the four arrows as accents', () => {
    expect(KEYS.filter((k) => k.accent)).toHaveLength(6)
  })
})
