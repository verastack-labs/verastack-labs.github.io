'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { process } from '@/data/process'
import { SplitFlap } from '@/components/split-flap'
import { railProgress, stepsOn } from '@/lib/rail'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'
import type { MotionMode } from '@/lib/motion/mode'
import styles from '@/scenes/process/process.module.css'

gsap.registerPlugin(ScrollTrigger)

const pad = (n: number) => String(n).padStart(2, '0')

function Steps({ on, animate, withRail }: { on: boolean[]; animate: boolean; withRail: boolean }) {
  return (
    <ol className={styles.steps} data-rail={withRail}>
      {process.steps.map((s, i) => (
        <li key={s.name} className={styles.step} data-on={on[i]} data-step>
          <SplitFlap value={on[i] ? pad(i + 1) : '00'} on={on[i]} animate={animate} />
          <h3>{s.name}</h3>
          <p>{s.line}</p>
        </li>
      ))}
    </ol>
  )
}

function Head() {
  return (
    <>
      <p className={styles.label}>
        /process <em>{'//'}</em> how we work
      </p>
      <h2 className={styles.headline}>{process.headline}</h2>
    </>
  )
}

// Desktop (full): a short pin while the rail draws; each flap spins up as the tip reaches it.
function Rail() {
  const section = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(() => process.steps.map(() => false))

  // Layout effect: the pin must be reverted before React removes the pinned node.
  useLayoutEffect(() => {
    const el = section.current
    if (!el) return
    const line = el.querySelector<HTMLElement>('[data-line]')!
    const fill = el.querySelector<HTMLElement>('[data-fill]')!
    const apply = (p: number) => {
      const r = railProgress(p)
      fill.style.transform = `scaleX(${r.toFixed(4)})`
      // Measured every update, so the rule holds at any width (spec 5.2).
      const box = line.getBoundingClientRect()
      const lefts = [...el.querySelectorAll<HTMLElement>('[data-step] > span')].map((f) => f.getBoundingClientRect().left)
      const next = stepsOn({ left: box.left, width: box.width }, r, lefts)
      setOn((prev) => (prev.every((v, i) => v === next[i]) ? prev : next))
    }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: '+=150%',
        pin: true,
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="process">
      {/* The pin wraps this div, never the section, so every section stays a child of main. */}
      <div ref={section} className={styles.pinned}>
      <Head />
      <div className={styles.rail}>
        <div className={styles.line} data-line>
          <i data-fill />
        </div>
        <Steps on={on} animate withRail />
      </div>
    </div>
    </section>
  )
}

// Phones and reduced motion: a two-column grid; in lite each flap spins once as it enters view.
function Grid({ mode }: { mode: MotionMode }) {
  const section = useRef<HTMLElement>(null)
  const [on, setOn] = useState(() => process.steps.map(() => mode === 'static'))

  useEffect(() => {
    if (mode === 'static' || !section.current) return
    const items = [...section.current.querySelectorAll<HTMLElement>('[data-step]')]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const i = items.indexOf(e.target as HTMLElement)
          setOn((prev) => prev.map((v, k) => v || k === i))
          io.unobserve(e.target)
        }
      },
      { threshold: 0.6 },
    )
    items.forEach((item) => io.observe(item))
    return () => io.disconnect()
  }, [mode])

  return (
    <section id="process" ref={section} className={styles.grid}>
      <Head />
      <Steps on={on} animate={mode === 'lite'} withRail={false} />
    </section>
  )
}

export function Process() {
  const mode = useMotionPreference()
  // Keyed so a mode change starts the grid over (static renders every step on).
  return mode === 'full' ? <Rail /> : <Grid key={mode} mode={mode} />
}
