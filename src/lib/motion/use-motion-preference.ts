'use client'

import { useSyncExternalStore } from 'react'
import { FINE_QUERY, REDUCED_QUERY, WIDE_QUERY, resolveMotionMode, type MotionMode } from '@/lib/motion/mode'

let webglCache: boolean | undefined
function hasWebGL(): boolean {
  if (webglCache === undefined) {
    try {
      webglCache = !!document.createElement('canvas').getContext('webgl')
    } catch {
      webglCache = false
    }
  }
  return webglCache
}

function read(): MotionMode {
  const nav = navigator as Navigator & { deviceMemory?: number }
  return resolveMotionMode({
    reducedMotion: matchMedia(REDUCED_QUERY).matches,
    finePointer: matchMedia(FINE_QUERY).matches,
    wide: matchMedia(WIDE_QUERY).matches,
    webgl: hasWebGL(),
    cores: nav.hardwareConcurrency || undefined,
    memoryGb: nav.deviceMemory,
  })
}

function subscribe(onChange: () => void): () => void {
  const lists = [REDUCED_QUERY, FINE_QUERY, WIDE_QUERY].map((q) => matchMedia(q))
  lists.forEach((l) => l.addEventListener('change', onChange))
  return () => lists.forEach((l) => l.removeEventListener('change', onChange))
}

// The server renders the static state; the client upgrades after hydration.
export function useMotionPreference(): MotionMode {
  return useSyncExternalStore(subscribe, read, () => 'static')
}
