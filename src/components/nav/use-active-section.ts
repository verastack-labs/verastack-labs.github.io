'use client'

import { useEffect, useState } from 'react'
import { PROBE_Y, activeIndex } from '@/lib/active-section'

export type NavTheme = 'dark' | 'light'

export function useActiveSection(ids: readonly string[]): { index: number; theme: NavTheme } {
  const [state, setState] = useState<{ index: number; theme: NavTheme }>({ index: 0, theme: 'dark' })

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const els = ids.map((id) => document.getElementById(id))
      const tops = els.map((el) => (el ? el.getBoundingClientRect().top : Number.POSITIVE_INFINITY))
      const index = activeIndex(tops, PROBE_Y)
      const theme: NavTheme = els[index]?.dataset.navTheme === 'light' ? 'light' : 'dark'
      setState((prev) => (prev.index === index && prev.theme === theme ? prev : { index, theme }))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // Scenes change their own data-nav-theme (the Products hand-over); watch for it.
    const observer = new MutationObserver(schedule)
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el, { attributes: true, attributeFilter: ['data-nav-theme'] })
    })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ids])

  return state
}
