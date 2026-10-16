'use client'

import { useEffect, useRef } from 'react'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'
import styles from '@/components/book-call.module.css'

// The book-a-call card (spec 6.07). Hover or keyboard focus traces a signal line round the border
// (0.8 s), then the words pop in as chips one by one, the last in signal. Touch screens have no
// hover, so there it plays each time the card comes into view, and resets when it leaves.
export function BookCall({
  href,
  external,
  title,
  sub,
  words,
  onClick,
}: {
  href: string
  // Opens in a new tab only for the booking page, not for the email fallback.
  external: boolean
  title: string
  sub: string
  words: string[]
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}) {
  const card = useRef<HTMLAnchorElement>(null)
  // Starts as 'static' on the server and settles after hydration, so the effect waits for it.
  const mode = useMotionPreference()

  useEffect(() => {
    const el = card.current
    if (!el || mode === 'static' || !window.matchMedia('(hover: none)').matches) return
    const io = new IntersectionObserver(([e]) => (el.dataset.inview = String(e.isIntersecting)), { threshold: 0.6 })
    io.observe(el)
    return () => {
      io.disconnect()
      delete el.dataset.inview
    }
  }, [mode])

  return (
    <a
      ref={card}
      className={styles.card}
      href={href}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
    >
      <svg className={styles.trace} aria-hidden="true">
        <rect width="100%" height="100%" pathLength={1} rx={11} ry={11} />
      </svg>
      <span className={styles.text}>
        <b>{title}</b>
        <span className={styles.sub}>{sub}</span>
        <span className={styles.words} aria-hidden="true">
          {words.map((w, i) => (
            <i key={w} style={{ '--i': i } as React.CSSProperties}>
              {w}
            </i>
          ))}
        </span>
      </span>
      <span className={styles.arrow} aria-hidden="true">
        ↗
      </span>
    </a>
  )
}
