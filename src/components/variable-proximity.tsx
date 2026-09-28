'use client'

import { useEffect, useRef, type RefObject } from 'react'
import styles from '@/components/variable-proximity.module.css'

const RADIUS = 180
const MIN = 300
const MAX = 800
const HOT = 0.72

// Letters swell from weight 300 towards 800 near the pointer, and the nearest take signal
// (spec 6.07). The real text stays in the DOM for screen readers and search.
export function VariableProximity({
  text,
  host,
  active,
  className,
}: {
  text: string
  host: RefObject<HTMLElement | null>
  active: boolean
  className?: string
}) {
  const root = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const area = host.current
    const el = root.current
    if (!active || !area || !el) return
    const letters = [...el.querySelectorAll<HTMLSpanElement>('[data-l]')]
    let centres: Array<[number, number]> = []
    let frame = 0
    let pointer: [number, number] | null = null

    const measure = () => {
      centres = letters.map((l) => {
        const r = l.getBoundingClientRect()
        return [r.left + r.width / 2, r.top + r.height / 2]
      })
    }
    const paint = () => {
      frame = 0
      // A scroll or resize since the last move clears the cache; measure again before using it.
      if (centres.length !== letters.length) measure()
      letters.forEach((l, i) => {
        let k = 0
        if (pointer) {
          const d = Math.hypot(pointer[0] - centres[i][0], pointer[1] - centres[i][1])
          k = Math.max(0, 1 - d / RADIUS)
          k = k * k * (3 - 2 * k)
        }
        l.style.setProperty('--w', String(Math.round(MIN + (MAX - MIN) * k)))
        l.dataset.hot = String(k > HOT)
      })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }
    const onEnter = () => measure()
    const onMove = (e: PointerEvent) => {
      if (!centres.length) measure()
      pointer = [e.clientX, e.clientY]
      schedule()
    }
    const onLeave = () => {
      pointer = null
      schedule()
    }
    const onScroll = () => {
      centres = []
    }
    area.addEventListener('pointerenter', onEnter)
    area.addEventListener('pointermove', onMove)
    area.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      area.removeEventListener('pointerenter', onEnter)
      area.removeEventListener('pointermove', onMove)
      area.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
      letters.forEach((l) => {
        l.style.removeProperty('--w')
        delete l.dataset.hot
      })
    }
  }, [active, host])

  return (
    <span ref={root} className={`${styles.root} ${className ?? ''}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(' ').map((word, w, words) => (
          <span key={w} className={styles.word}>
            {[...word].map((ch, i) => (
              <span key={i} data-l className={styles.letter}>
                {ch}
              </span>
            ))}
            {w < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </span>
  )
}
