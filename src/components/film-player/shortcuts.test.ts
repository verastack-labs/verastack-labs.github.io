import { describe, expect, it } from 'vitest'
import { nextRate, shortcutFor, SHORTCUTS } from '@/components/film-player/shortcuts'

const idle = { inside: false, live: false, full: false }
const live = { inside: false, live: true, full: false }
const inside = { inside: true, live: false, full: false }

// Built from its code point so this file never contains the character itself.
const EM_DASH = String.fromCodePoint(0x2014)

describe('film player shortcuts', () => {
  it('keeps f, m, c and k working anywhere on the page, in either case', () => {
    expect(shortcutFor('f', idle)).toEqual({ type: 'full' })
    expect(shortcutFor('M', idle)).toEqual({ type: 'mute' })
    expect(shortcutFor('c', idle)).toEqual({ type: 'captions' })
    expect(shortcutFor('k', idle)).toEqual({ type: 'toggle' })
  })

  it('leaves space, the arrows and the numbers to the page until a film is live', () => {
    for (const key of [' ', 'ArrowLeft', 'ArrowRight', '5', 'j', 'Home']) expect(shortcutFor(key, idle), key).toBeNull()
  })

  it('seeks with the arrows, j and l once the film is live', () => {
    expect(shortcutFor('ArrowRight', live)).toEqual({ type: 'skip', by: 5 })
    expect(shortcutFor('ArrowLeft', live)).toEqual({ type: 'skip', by: -5 })
    expect(shortcutFor('L', live)).toEqual({ type: 'skip', by: 10 })
    expect(shortcutFor('j', inside)).toEqual({ type: 'skip', by: -10 })
    expect(shortcutFor(' ', live)).toEqual({ type: 'toggle' })
  })

  it('jumps by tenths with the numbers, and to the ends with Home and End', () => {
    expect(shortcutFor('0', live)).toEqual({ type: 'jump', to: 0 })
    expect(shortcutFor('7', live)).toEqual({ type: 'jump', to: 0.7 })
    expect(shortcutFor('End', live)).toEqual({ type: 'jump', to: 1 })
  })

  it('keeps up and down as page scroll keys unless focus is inside or in full screen', () => {
    expect(shortcutFor('ArrowUp', live)).toBeNull()
    expect(shortcutFor('ArrowUp', inside)).toEqual({ type: 'volume', by: 0.1 })
    expect(shortcutFor('ArrowDown', { ...live, full: true })).toEqual({ type: 'volume', by: -0.1 })
  })

  it('steps frames, speed, picture in picture and the list', () => {
    expect(shortcutFor('.', live)).toEqual({ type: 'frame', by: 1 })
    expect(shortcutFor('>', live)).toEqual({ type: 'speed', by: 1 })
    expect(shortcutFor('p', live)).toEqual({ type: 'pip' })
    expect(shortcutFor('?', inside)).toEqual({ type: 'help' })
  })

  it('steps speed within its range', () => {
    expect(nextRate(1, 1)).toBe(1.25)
    expect(nextRate(1, -1)).toBe(0.75)
    expect(nextRate(2, 1)).toBe(2)
    expect(nextRate(0.25, -1)).toBe(0.25)
  })

  it('never uses an em dash in the list', () => {
    expect(JSON.stringify(SHORTCUTS)).not.toContain(EM_DASH)
  })
})
