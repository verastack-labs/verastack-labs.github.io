'use client'

import { useEffect, useRef, useState } from 'react'
import { capabilities } from '@/data/capabilities'
import styles from '@/scenes/about/about.module.css'

const BOOT_START_MS = 250
const BOOT_STEP_MS = 280
const FLICKER_MS = 520
const WALK_MS = 1600

type Phase = 'idle' | 'boot' | 'walk'

// The boot-up (spec 6.06): on entering view the lights flicker on one by one, with no lines. When
// the last flicker ends a single light starts walking across the five, with a signal underline
// under the lit one. Without `animate` all five are simply on.
export function CapabilitiesRow({ animate }: { animate: boolean }) {
  const row = useRef<HTMLUListElement>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [booted, setBooted] = useState(0)
  const [walker, setWalker] = useState(-1)
  const [flickering, setFlickering] = useState<number[]>([])

  useEffect(() => {
    const el = row.current
    if (!animate || !el) return
    const timers: number[] = []
    let walk = 0
    const start = () => {
      setPhase('boot')
      capabilities.forEach((_, i) => {
        const at = BOOT_START_MS + i * BOOT_STEP_MS
        timers.push(
          window.setTimeout(() => {
            setBooted(i + 1)
            setFlickering((f) => [...f, i])
          }, at),
        )
        timers.push(window.setTimeout(() => setFlickering((f) => f.filter((x) => x !== i)), at + FLICKER_MS))
      })
      const bootEnd = BOOT_START_MS + (capabilities.length - 1) * BOOT_STEP_MS + FLICKER_MS
      timers.push(
        window.setTimeout(() => {
          setPhase('walk')
          setWalker(0)
          walk = window.setInterval(() => setWalker((w) => (w + 1) % capabilities.length), WALK_MS)
        }, bootEnd),
      )
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        start()
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      timers.forEach((t) => window.clearTimeout(t))
      window.clearInterval(walk)
    }
  }, [animate])

  return (
    <ul ref={row} className={styles.caps} data-walking={phase === 'walk'}>
      {capabilities.map((c, i) => {
        const on = !animate || i < booted
        const lit = animate && phase === 'walk' && walker === i
        return (
          <li key={c.name} className={styles.cap} data-on={on} data-flicker={flickering.includes(i)} data-lit={lit}>
            <b>
              <i aria-hidden="true" />
              {c.name}
            </b>
            {c.descriptor}
          </li>
        )
      })}
    </ul>
  )
}
