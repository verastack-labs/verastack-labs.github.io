'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'
import styles from '@/app/work/piece.module.css'

const clamp = (n: number) => Math.min(1, Math.max(0, n))

// A paragraph that brightens word by word as it scrolls up through the window: dim at first, each word
// coming to full strength in turn. Every word is readable before the script runs and stays at full
// strength when motion is reduced.
export function ScrollWords({ text }: { text: string }) {
  const still = useMotionPreference() === 'static'
  const ref = useRef<HTMLParagraphElement>(null)
  const words = text.split(' ')

  useEffect(() => {
    const el = ref.current
    if (!el || still) return
    const spans = [...el.querySelectorAll<HTMLElement>('span')]
    let frame = 0
    const update = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // From the paragraph's top at 85% of the window to its bottom at 45%.
      const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.4))
      const lit = p * (spans.length + 2)
      spans.forEach((s, i) => s.style.setProperty('--w', clamp(lit - i).toFixed(3)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    el.dataset.live = ''
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      delete el.dataset.live
      spans.forEach((s) => s.style.removeProperty('--w'))
    }
  }, [still, text])

  return (
    <p ref={ref} className={styles.words}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span>{w}</span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </p>
  )
}

// A fact whose value leads with a number counts up to it the first time it is seen.
export function CountUp({ value }: { value: string }) {
  const still = useMotionPreference() === 'static'
  const m = value.match(/^(\d+)(.*)$/)
  const target = m ? Number(m[1]) : 0
  const counts = !!m
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !counts || still) return
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const step = (t: number) => {
        const k = clamp((t - t0) / 1100)
        setN(Math.round(target * (1 - Math.pow(1 - k, 3))))
        if (k < 1) raf = requestAnimationFrame(step)
      }
      setN(0)
      raf = requestAnimationFrame(step)
    }, { threshold: 0.6 })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [counts, still, target])

  if (!m) return <>{value}</>
  return (
    <>
      <span ref={ref} className={styles.count}>
        {n ?? target}
      </span>
      {m[2]}
    </>
  )
}
