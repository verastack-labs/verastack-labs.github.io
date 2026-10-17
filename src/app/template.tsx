'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'

// Set once the first page has shown: from then on, each page rises in as it arrives.
let firstShown = false

const motionOff = () =>
  document.documentElement.dataset.motion === 'static' || window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Remounts on every navigation (an App Router template). The first load shows the page as it is;
// later pages rise in, their top-level blocks staggered. The home page keeps its own scenes, so it
// only fades. Sections marked data-reveal below the fold fade and rise once as they scroll in.
export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [enter] = useState(() => firstShown)

  useEffect(() => {
    firstShown = true
  }, [])

  useEffect(() => {
    if (motionOff()) return
    const pending = [...document.querySelectorAll<HTMLElement>('[data-reveal]')].filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight * 0.92,
    )
    if (pending.length === 0) return
    for (const el of pending) el.classList.add('reveal-pending')
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.remove('reveal-pending')
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    for (const el of pending) io.observe(el)
    return () => {
      io.disconnect()
      for (const el of pending) el.classList.remove('reveal-pending')
    }
  }, [pathname])

  return (
    <div className="route" data-enter={enter ? (pathname === '/' ? 'fade' : 'rise') : undefined}>
      {children}
    </div>
  )
}
