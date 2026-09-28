'use client'

import { useEffect, useRef } from 'react'

const DURATION_MS = 700

// Counts the returned element's text from the last value to `value` (ease-out cubic, 700 ms).
// Without `enabled` the text jumps straight to the new value.
export function useCountUp<T extends HTMLElement>(value: number, format: (n: number) => string, enabled: boolean) {
  const ref = useRef<T>(null)
  const shown = useRef(value)
  const formatRef = useRef(format)

  useEffect(() => {
    formatRef.current = format
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const from = shown.current
    if (!enabled || from === value) {
      shown.current = value
      el.textContent = formatRef.current(value)
      return
    }
    const start = performance.now()
    let frame = 0
    const step = (now: number) => {
      const t = Math.min((now - start) / DURATION_MS, 1)
      shown.current = from + (value - from) * (1 - (1 - t) ** 3)
      el.textContent = formatRef.current(shown.current)
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [value, enabled])

  return ref
}
