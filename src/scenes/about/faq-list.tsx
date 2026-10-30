'use client'

import { useId, useState } from 'react'
import { faq } from '@/data/faq'
import styles from '@/scenes/about/about.module.css'

// The questions as accordions, all closed at first. Two columns from 768px: each column stacks on
// its own, so opening an answer never pushes the other column's rows apart. Answers stay in the
// DOM (closed ones are inert) so the copy matches the FAQPage markup.
export function FaqList() {
  const [open, setOpen] = useState<Set<number>>(() => new Set())
  const id = useId()
  const half = Math.ceil(faq.length / 2)
  const columns = [faq.slice(0, half), faq.slice(half)]

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <div className={styles.faqGrid}>
      {columns.map((items, c) => (
        <ul key={c} className={styles.faqColumn}>
          {items.map((f, j) => {
            const i = c * half + j
            const isOpen = open.has(i)
            return (
              <li key={f.q} className={styles.faqItem} data-open={isOpen || undefined}>
                <h4 className={styles.faqQ}>
                  <button type="button" aria-expanded={isOpen} aria-controls={`${id}-${i}`} onClick={() => toggle(i)}>
                    <span className={styles.faqNum}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.faqText}>{f.q}</span>
                    <span className={styles.faqIcon} aria-hidden="true" />
                  </button>
                </h4>
                <div id={`${id}-${i}`} className={styles.faqPanel} role="region" aria-label={f.q} inert={!isOpen}>
                  <div>
                    <p>{f.a}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      ))}
    </div>
  )
}
