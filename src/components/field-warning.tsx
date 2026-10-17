import type { ReactNode } from 'react'
import styles from '@/components/field-warning.module.css'

export function WarningIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className={styles.icon}>
      <path d="M8 1.5 15 14H1L8 1.5Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 6v3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.8" r="0.9" fill="currentColor" />
    </svg>
  )
}

// A field's problem, said plainly in the alert colour with a warning sign. Announced to screen
// readers as it appears.
export function FieldWarning({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className={styles.warn} role="alert">
      <WarningIcon />
      <span>{children}</span>
    </p>
  )
}

// The same warning inside a line of text, for forms whose hints sit inline.
export function InlineWarning({ children }: { children: ReactNode }) {
  return (
    <span className={styles.inline}>
      <WarningIcon />
      <span>{children}</span>
    </span>
  )
}
