'use client'

import { useEffect, useRef, useState } from 'react'
import styles from '@/components/footer/footer.module.css'

// A small chip beside the footer email: copies the address and says so for a moment.
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  return (
    <button
      type="button"
      className={styles.copy}
      data-copied={copied || undefined}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email)
        } catch {
          return
        }
        setCopied(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setCopied(false), 1600)
      }}
    >
      <span aria-live="polite">{copied ? 'copied ✓' : 'copy'}</span>
    </button>
  )
}
