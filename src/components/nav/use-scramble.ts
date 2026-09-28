'use client'

import { useEffect, useRef } from 'react'
import { scrambleFrame } from '@/lib/scramble'

const DURATION_MS = 480
const FRAME_MS = 40

// Writes a decoding animation into the returned element whenever `text` changes.
export function useScramble<T extends HTMLElement>(text: string, enabled: boolean) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!enabled) {
      el.textContent = text
      return
    }
    const start = performance.now()
    let timer = 0
    const step = () => {
      const progress = (performance.now() - start) / DURATION_MS
      el.textContent = scrambleFrame(text, progress)
      if (progress < 1) timer = window.setTimeout(step, FRAME_MS)
    }
    step()
    return () => window.clearTimeout(timer)
  }, [text, enabled])
  return ref
}
