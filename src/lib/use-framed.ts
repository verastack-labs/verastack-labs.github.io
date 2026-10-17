'use client'

import { useSyncExternalStore } from 'react'

const noSubscribe = () => () => {}

// True when this page is shown inside another page's iframe (a post embedding an example page).
// The site's own chrome, the header and the offer, steps aside there. False on the server.
export function useFramed(): boolean {
  return useSyncExternalStore(
    noSubscribe,
    () => {
      try {
        return window.self !== window.top
      } catch {
        return true
      }
    },
    () => false,
  )
}
