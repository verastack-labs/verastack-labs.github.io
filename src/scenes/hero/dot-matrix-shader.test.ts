import { describe, expect, it } from 'vitest'
import { VERTEX_SHADER } from '@/lib/webgl/quad-renderer'
import { DOT_MATRIX_SHADER } from '@/scenes/hero/dot-matrix-shader'

describe('dot matrix shader source', () => {
  it('declares the uniforms the renderer sets', () => {
    for (const u of ['uniform vec2 r;', 'uniform float t;', 'uniform vec2 m;', 'uniform float cs;']) {
      expect(DOT_MATRIX_SHADER).toContain(u)
    }
  })

  it('uses the signal colour for crests and the ink base', () => {
    expect(DOT_MATRIX_SHADER).toContain('vec3(.831,1.,.247)')
    expect(DOT_MATRIX_SHADER).toContain('vec3(.043,.047,.039)')
  })

  it('has a position attribute in the vertex shader', () => {
    expect(VERTEX_SHADER).toContain('attribute vec2 p;')
  })
})
