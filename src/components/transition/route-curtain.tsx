'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'
import { CURTAIN_IN_MS, CURTAIN_OUT_MS, shouldCurtain } from '@/lib/transition'
import styles from '@/components/transition/transition.module.css'

const trail = (p: string) => (p.endsWith('/') ? p : `${p}/`)

// The ink curtain between pages: a click on a link to another page of the site is held while the
// curtain covers the screen, the route changes underneath, then the curtain lifts away with the
// slash from the wordmark. Back and forward, new tabs and other sites are left alone. None in
// static motion mode.
export function RouteCurtain() {
  const router = useRouter()
  const pathname = usePathname()
  const mode = useMotionPreference()
  const [phase, setPhase] = useState<'idle' | 'cover' | 'lift'>('idle')
  const target = useRef<string | null>(null)
  // A section to land on ("/#contact"), jumped to under the curtain once the page is in.
  const hash = useRef<string | null>(null)

  useEffect(() => {
    if (mode === 'static') return
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return
      const href = a.getAttribute('href') ?? ''
      if (!shouldCurtain(window.location.pathname, href, false)) return
      e.preventDefault()
      e.stopPropagation()
      const url = new URL(href, window.location.href)
      target.current = trail(url.pathname)
      hash.current = url.hash ? decodeURIComponent(url.hash.slice(1)) : null
      setPhase('cover')
      window.setTimeout(() => router.push(`${url.pathname}${url.search}${url.hash}`), CURTAIN_IN_MS)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [mode, router])

  // The new page is in: lift the curtain, then take it away.
  useEffect(() => {
    if (phase !== 'cover' || target.current !== trail(pathname)) return
    target.current = null
    const id = hash.current
    hash.current = null
    const lift = window.setTimeout(() => {
      if (id) {
        // The home scenes add their pinned height as they set up, so land again once they have.
        for (const delay of [0, 350, 900]) {
          window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), delay)
        }
      } else {
        window.scrollTo(0, 0)
      }
      setPhase('lift')
    }, 0)
    return () => window.clearTimeout(lift)
  }, [pathname, phase])

  // Lifted: remove it once the animation has played.
  useEffect(() => {
    if (phase !== 'lift') return
    const done = window.setTimeout(() => setPhase('idle'), CURTAIN_OUT_MS)
    return () => window.clearTimeout(done)
  }, [phase])

  // Never stuck: if the route does not change (a failed load), clear the curtain anyway.
  useEffect(() => {
    if (phase !== 'cover') return
    const t = window.setTimeout(() => {
      target.current = null
      setPhase('idle')
    }, 2500)
    return () => window.clearTimeout(t)
  }, [phase])

  if (phase === 'idle') return null
  return (
    <div className={styles.curtain} data-phase={phase} aria-hidden="true">
      <span className={styles.slash}>/</span>
    </div>
  )
}
