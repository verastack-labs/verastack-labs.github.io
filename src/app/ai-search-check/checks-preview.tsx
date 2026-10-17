'use client'

import { useState } from 'react'
import { checks } from '@/data/ai-search-check'
import styles from '@/app/ai-search-check/checker.module.css'

// Three in full, three fading out beneath them, the rest folded away.
const FULL = 3
const SHOWN = 6

// What the check looks at: the first few in full, the rest fading out beneath a line that says how
// many more we cover, until the visitor asks for all of them. Every check stays in the page's
// HTML either way, so engines read the full list.
export function ChecksPreview() {
  const [open, setOpen] = useState(false)
  const more = checks.length - FULL
  return (
    <div className={styles.preview} data-open={open}>
      <ol className={styles.explain} id="all-checks">
        {checks.map((c, i) => (
          <li
            key={c.id}
            data-hidden={!open && i >= SHOWN ? 'true' : undefined}
            data-fade={!open && i >= FULL && i < SHOWN ? i - FULL + 1 : undefined}
          >
            <b>{c.label}</b>
            <span>{c.why}</span>
          </li>
        ))}
      </ol>
      {!open && (
        <div className={styles.previewMore}>
          <p>
            <b>And {more} more checks we take care of,</b> from AI crawlers turned away at your CDN to freshness signals,
            headings that outline the page and the alt text on every image.
          </p>
          <button type="button" className={styles.again} aria-controls="all-checks" aria-expanded={open} onClick={() => setOpen(true)}>
            See all {checks.length} checks
          </button>
        </div>
      )}
    </div>
  )
}
