'use client'

import { useEffect, useRef, useState } from 'react'
import styles from '@/components/split-flap.module.css'

const TICK_MS = 60

// A departure-board display (spec 6.05). When `value` changes each digit spins through random
// digits before settling, the right-hand one longer. Without `animate` it swaps instantly.
export function SplitFlap({ value, on, animate }: { value: string; on: boolean; animate: boolean }) {
  const cells = useRef<Array<HTMLSpanElement | null>>([])
  // React renders the first value only; after that the effect owns the digits, so the spin is not
  // pre-empted by React writing the new digit first.
  const [initial] = useState(value)

  useEffect(() => {
    const timers: number[] = []
    ;[...value].forEach((target, k) => {
      const cell = cells.current[k]
      if (!cell) return
      if (!animate || cell.textContent === target) {
        cell.textContent = target
        return
      }
      const spins = k === 0 ? 3 : 7
      let n = 0
      const tick = () => {
        cell.classList.remove(styles.flip)
        void cell.offsetWidth
        cell.classList.add(styles.flip)
        cell.textContent = n >= spins ? target : String(Math.floor(Math.random() * 10))
        n++
        if (n <= spins) timers.push(window.setTimeout(tick, TICK_MS))
      }
      tick()
    })
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [value, animate])

  return (
    <span className={styles.flap} data-on={on} aria-hidden="true">
      {[...initial].map((digit, k) => (
        <span
          key={k}
          ref={(el) => {
            cells.current[k] = el
          }}
        >
          {digit}
        </span>
      ))}
    </span>
  )
}
