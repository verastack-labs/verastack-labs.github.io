'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Worlds } from '@/data/pieces'
import styles from '@/app/work/play.module.css'

// The working prototype, in the page. A phone shows the chosen direction's home screen until someone asks
// for the real thing, so nothing heavy loads unasked. On a phone the prototype would trap the page's
// scroll, so there the button opens it full screen in a new tab instead.
export function PiecePlay({ slug, worlds: { worlds, play } }: { slug: string; worlds: Worlds }) {
  const [at, setAt] = useState(0)
  const [on, setOn] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const w = worlds[at]
  const url = `${play}?d=${w.key}`

  // The prototype is drawn at 390 by 844 and scaled to whatever the phone frame measures.
  useEffect(() => {
    const el = frame.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => el.style.setProperty('--s', String(e.contentRect.width / 390)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const start = () => {
    if (matchMedia('(max-width: 699px)').matches) window.open(url, '_blank', 'noopener')
    else setOn(true)
  }

  return (
    <div className={styles.play} style={{ '--k': w.accent, '--k-bg': w.bg, '--k-fg': w.fg } as CSSProperties}>
      <div className={styles.copy}>
        <p className={styles.kicker}>
          <span className={styles.live} aria-hidden="true" /> live prototype
        </p>
        <p className={styles.title}>
          Tap it <em>here.</em>
        </p>
        <p className={styles.text}>
          This is the real prototype, not a recording. Order a biryani, add milk from the grocer, upload a prescription and pay. Pick a
          direction and it starts on its home screen.
        </p>
        <div className={styles.pills} role="group" aria-label="Pick a direction">
          {worlds.map((x, i) => (
            <button key={x.key} type="button" aria-pressed={i === at} onClick={() => setAt(i)} style={{ '--dot': x.bg } as CSSProperties}>
              <i aria-hidden="true" />
              {x.name}
            </button>
          ))}
        </div>
        <a className={styles.out} href={url} target="_blank" rel="noreferrer">
          Open {w.name} full screen ↗
        </a>
      </div>
      <div className={styles.device}>
        <div ref={frame} className={styles.screen}>
          {on ? (
            <iframe key={w.key} src={url} title={`${w.name}, the working prototype`} loading="lazy" allow="fullscreen" />
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={w.key} src={`/work/${slug}/${w.key}-home.webp`} alt={`${w.name}, the home screen`} width={390} height={844} loading="lazy" />
              <button type="button" className={styles.start} onClick={start}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.2a5 5 0 0 1-4-2L4.6 15.6a1.6 1.6 0 0 1 2.4-2.1L9 15.5" />
                </svg>
                Start the prototype
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
