import { describe, expect, it } from 'vitest'
import { contrastRatio } from '@/lib/contrast'
import { tokens, tokensToCss } from '@/styles/tokens'

const AA = 4.5

describe('tokens', () => {
  it('are the spec values', () => {
    expect(tokens).toEqual({
      ink: '#0B0C0A',
      surface: '#1B1D18',
      line: '#2A2D25',
      text: '#F2F3EE',
      muted: '#A3A69B',
      dim: '#3B3E35',
      signal: '#D4FF3F',
      alert: '#FF6B4A',
    })
  })

  it.each([
    ['text', 'ink'],
    ['text', 'surface'],
    ['muted', 'ink'],
    ['muted', 'surface'],
    ['signal', 'ink'],
    ['signal', 'surface'],
    ['alert', 'ink'],
    ['ink', 'signal'],
  ] as const)('%s on %s meets AA', (fg, bg) => {
    expect(contrastRatio(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(AA)
  })

  it('writes every token as a CSS variable', () => {
    const css = tokensToCss()
    expect(css.startsWith(':root{')).toBe(true)
    for (const [name, value] of Object.entries(tokens)) expect(css).toContain(`--${name}:${value};`)
  })
})
