import { describe, expect, it } from 'vitest'
import { resolveMotionMode, type MotionInputs } from '@/lib/motion/mode'

const desktop: MotionInputs = { reducedMotion: false, finePointer: true, wide: true, webgl: true, cores: 8, memoryGb: 8 }

describe('resolveMotionMode', () => {
  it('is full on a capable desktop', () => {
    expect(resolveMotionMode(desktop)).toBe('full')
  })

  it('is static whenever reduced motion is asked for, even on a capable desktop', () => {
    expect(resolveMotionMode({ ...desktop, reducedMotion: true })).toBe('static')
  })

  it('is lite on touch or narrow screens', () => {
    expect(resolveMotionMode({ ...desktop, finePointer: false })).toBe('lite')
    expect(resolveMotionMode({ ...desktop, wide: false })).toBe('lite')
  })

  it('is lite on weak devices or without WebGL', () => {
    expect(resolveMotionMode({ ...desktop, webgl: false })).toBe('lite')
    expect(resolveMotionMode({ ...desktop, cores: 2 })).toBe('lite')
    expect(resolveMotionMode({ ...desktop, memoryGb: 2 })).toBe('lite')
  })

  it('treats unknown cores and memory as capable', () => {
    expect(resolveMotionMode({ ...desktop, cores: undefined, memoryGb: undefined })).toBe('full')
  })
})
