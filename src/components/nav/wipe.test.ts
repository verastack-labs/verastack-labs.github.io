import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { coverRadius } from '@/components/nav/wipe'

describe('menu wipe', () => {
  it('reaches exactly the farthest corner from the menu button', () => {
    // A 375 x 812 phone with the pill just left of the middle: the farthest corner is bottom right.
    expect(coverRadius(179, 35, 375, 812)).toBe(Math.ceil(Math.hypot(196, 777)) + 1)
    // From the top right corner, the farthest corner is bottom left.
    expect(coverRadius(375, 0, 375, 812)).toBe(Math.ceil(Math.hypot(375, 812)) + 1)
  })

  it('opens and closes the circle on that radius, not a percentage that overshoots the screen', () => {
    const css = readFileSync('src/components/nav/mobile-menu.module.css', 'utf8')
    const circles = css.match(/circle\([^)]*\)/g) ?? []
    expect(circles.length).toBeGreaterThan(0)
    expect(circles.filter((c) => /%/.test(c))).toEqual([])
    expect(css).toMatch(/\.menu\[open\][^{]*\{[^}]*circle\(var\(--r\)/)
  })
})
