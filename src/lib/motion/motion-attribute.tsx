'use client'

import { useEffect } from 'react'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'

// Exposes the mode to CSS as html[data-motion] (globals.css swaps dim for muted in static).
export function MotionAttribute() {
  const mode = useMotionPreference()
  useEffect(() => {
    document.documentElement.dataset.motion = mode
  }, [mode])
  return null
}
