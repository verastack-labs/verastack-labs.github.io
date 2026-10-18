'use client'

import { useEffect } from 'react'

// Sends the visitor on, carrying ?url= and any #hash, without adding a history entry.
export function Forward({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(`${to}${window.location.search}${window.location.hash}`)
  }, [to])
  return null
}
