'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'

gsap.registerPlugin(ScrollTrigger)

// The live instance, so a modal can hold the page still while it is open.
export const lenisRef: { current: Lenis | null } = { current: null }

// One Lenis instance drives ScrollTrigger (spec 5.2). None in static mode.
export function SmoothScroll() {
  const mode = useMotionPreference()

  useEffect(() => {
    // No automatic refresh on resize: that Chrome fires a resize as its toolbar slides, and a
    // refresh then re-measures every pin against the new height, so the page shifts. On touch
    // screens pins are refreshed on load and when the width changes (a rotation), never on height
    // alone. With a mouse any resize refreshes them once it settles, so a window that grows taller
    // after load gets full-height pins (src/lib/screen-lock.ts re-measures the height first).
    ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' })
    const touch = window.matchMedia('(pointer: coarse)').matches
    let width = window.innerWidth
    let timer = 0
    const onResize = () => {
      // On touch, a rotation, not the pixel the toolbar nudges the width by.
      if (touch && Math.abs(window.innerWidth - width) < 50) return
      width = window.innerWidth
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    }
    const stop = () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(timer)
    }
    window.addEventListener('resize', onResize)
    if (mode === 'static') return stop

    const lenis = new Lenis({ anchors: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      stop()
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [mode])

  return null
}
