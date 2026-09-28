export type MotionMode = 'full' | 'lite' | 'static'

export type MotionInputs = {
  reducedMotion: boolean
  finePointer: boolean
  wide: boolean
  webgl: boolean
  cores?: number
  memoryGb?: number
}

export const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'
export const FINE_QUERY = '(hover: hover) and (pointer: fine)'
export const WIDE_QUERY = '(min-width: 1024px)'

// Spec 5.1: static for reduced motion; full only for a capable desktop; lite for everything else.
export function resolveMotionMode(i: MotionInputs): MotionMode {
  if (i.reducedMotion) return 'static'
  const weak = !i.webgl || (i.cores !== undefined && i.cores < 4) || (i.memoryGb !== undefined && i.memoryGb < 4)
  return i.finePointer && i.wide && !weak ? 'full' : 'lite'
}
