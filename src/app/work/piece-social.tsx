'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { SocialSet } from '@/data/pieces'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'
import styles from '@/app/work/social.module.css'

const clamp = (n: number) => Math.min(1, Math.max(0, n))

// One carousel. On larger screens the post pins with its caption beside it and the frames slide past
// as the page scrolls, the way a thumb would move them. Phones and reduced motion get a plain row that
// swipes sideways, so a vertical swipe always belongs to the page.
function Carousel({ set }: { set: SocialSet }) {
  const mode = useMotionPreference()
  const still = mode === 'static'
  const scene = useRef<HTMLDivElement>(null)
  const view = useRef<HTMLDivElement>(null)
  const row = useRef<HTMLUListElement>(null)
  const [pinned, setPinned] = useState(false)
  const [at, setAt] = useState(0)
  const count = set.frames.length

  useEffect(() => {
    const wide = matchMedia('(min-width: 900px)')
    const apply = () => setPinned(!still && wide.matches)
    apply()
    wide.addEventListener('change', apply)
    return () => wide.removeEventListener('change', apply)
  }, [still])

  useEffect(() => {
    const el = scene.current
    const box = view.current
    const r = row.current
    if (!el || !box || !r) return
    if (!pinned) {
      r.style.transform = ''
      return
    }
    let frame = 0
    const update = () => {
      frame = 0
      const b = el.getBoundingClientRect()
      const p = clamp(-b.top / Math.max(1, b.height - window.innerHeight))
      r.style.transform = `translate3d(${(-p * Math.max(0, r.offsetWidth - box.clientWidth)).toFixed(1)}px, 0, 0)`
      setAt(Math.round(p * (count - 1)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pinned, count])

  // The swiped row keeps the counter honest.
  const onSwipe = () => {
    const r = row.current
    if (!r || pinned) return
    setAt(Math.min(count - 1, Math.round(r.scrollLeft / (r.scrollWidth / count))))
  }

  return (
    <div ref={scene} className={styles.scene} style={{ '--n': count } as CSSProperties} data-pinned={pinned || undefined}>
      <div className={styles.stage}>
        <div className={styles.text}>
          <h3 className={styles.name}>{set.name}</h3>
          <p className={styles.setLine}>{set.line}</p>
          <p className={styles.caption}>
            <b>Caption</b>
            {set.caption}
          </p>
          <p className={styles.counter} aria-hidden="true">
            <span>
              {at + 1} / {count}
            </span>
            <i style={{ transform: `scaleX(${(at + 1) / count})` }} />
          </p>
        </div>
        <div ref={view} className={styles.view}>
          <ul ref={row} className={styles.row} onScroll={onSwipe} tabIndex={pinned ? undefined : 0} aria-label={`${set.name}, ${count} frames`}>
            {set.frames.map((f, i) => (
              <li key={f.src} className={styles.frame}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.src} alt={f.alt} width={1080} height={1350} loading={i < 2 ? 'eager' : 'lazy'} decoding="async" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Singles({ set }: { set: SocialSet }) {
  return (
    <div>
      <div className={styles.singlesHead}>
        <h3 className={styles.name}>{set.name}</h3>
        <p className={styles.setLine}>{set.line}</p>
      </div>
      <ul className={styles.grid}>
        {set.frames.map((f, i) => (
          <li key={f.src} style={{ '--i': i } as CSSProperties}>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.src} alt={f.alt} width={1080} height={1350} loading="lazy" decoding="async" />
              <figcaption className={styles.caption}>
                <b>Caption</b>
                {f.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PieceSocial({ sets }: { sets: SocialSet[] }) {
  return (
    <div className={styles.social}>
      {sets.map((s) => (s.singles ? <Singles key={s.name} set={s} /> : <Carousel key={s.name} set={s} />))}
    </div>
  )
}
