'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { WORDMARK_CUT, clipHeight, fitFontSize } from '@/lib/fit'
import styles from '@/components/footer/footer.module.css'

const WORD = 'verastack/labs'

export function GiantWordmark() {
  const clipRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLSpanElement>(null)
  const [inView, setInView] = useState(false)

  // Fit the word edge to edge of its container, then hide the bottom 40% (spec 6.08).
  useEffect(() => {
    const clip = clipRef.current
    const word = wordRef.current
    if (!clip || !word) return
    const fit = () => {
      word.style.fontSize = '100px'
      const size = fitFontSize(clip.clientWidth, word.scrollWidth)
      word.style.fontSize = `${size}px`
      clip.style.height = `${clipHeight(size, WORDMARK_CUT)}px`
    }
    fit()
    document.fonts?.ready.then(fit)
    const resize = new ResizeObserver(fit)
    resize.observe(clip)
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.1 })
    io.observe(clip)
    return () => {
      resize.disconnect()
      io.disconnect()
    }
  }, [])

  return (
    <div ref={clipRef} className={`${styles.clip} ${inView ? styles.in : ''}`} aria-hidden="true">
      <span ref={wordRef} className={styles.giant}>
        {[...WORD].map((ch, i) => (
          <span
            key={i}
            className={`${styles.ch} ${ch === '/' ? styles.slash : ''} ${i > 9 ? styles.labs : ''}`}
            style={{ transitionDelay: `${i * 45}ms` } as CSSProperties}
          >
            {ch}
          </span>
        ))}
      </span>
    </div>
  )
}
