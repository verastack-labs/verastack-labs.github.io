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
    ScrollTrigger.config({ ignoreMobileResize: true })
    if (mode === 'static') return

    const lenis = new Lenis({ anchors: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [mode])

  return null
}
