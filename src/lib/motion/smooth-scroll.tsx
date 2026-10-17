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
    // No refresh on resize: that Chrome fires a resize as its toolbar slides, and a refresh then
    // re-measures every pin against the new height, so the page shifts. Pins are refreshed on load
    // and when the width changes (a rotation or a resized window), never on height alone.
    ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' })
    let width = window.innerWidth
    const onResize = () => {
      // A rotation or a resized window, not the pixel the toolbar nudges the width by.
      if (Math.abs(window.innerWidth - width) < 50) return
      width = window.innerWidth
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)
    if (mode === 'static') return () => window.removeEventListener('resize', onResize)

    const lenis = new Lenis({ anchors: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      window.removeEventListener('resize', onResize)
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [mode])

  return null
}
