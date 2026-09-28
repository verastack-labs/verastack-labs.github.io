'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { sections } from '@/data/sections'
import { site } from '@/data/site'
import { formatCounter } from '@/lib/counter'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'
import { useActiveSection } from '@/components/nav/use-active-section'
import { useScramble } from '@/components/use-scramble'
import styles from '@/components/nav/path-pill.module.css'

const IDS = sections.map((s) => s.id)
const LAST = sections.length - 1
const CLOSE_DELAY_MS = 260
// On desktop the pill starts as the full dock row so visitors see every section, then folds.
const INTRO_MS = 3000
// A beat after hydration, so the widening is seen as a morph rather than a jump.
const INTRO_DELAY_MS = 300

// The horizontal row needs about 900px beside the wordmark and button; below that, or without
// hover, the pill opens the vertical panel instead.
const PANEL_QUERY = '(hover: none), (max-width: 899px)'

function usePanelMode(): boolean {
  const [touch, setTouch] = useState(false)
  useEffect(() => {
    const list = matchMedia(PANEL_QUERY)
    const update = () => setTouch(list.matches)
    update()
    list.addEventListener('change', update)
    return () => list.removeEventListener('change', update)
  }, [])
  return touch
}

export function PathPill({ onTheme }: { onTheme: (theme: 'dark' | 'light') => void }) {
  const { index, theme } = useActiveSection(IDS)
  const mode = useMotionPreference()
  const touch = usePanelMode()
  const [open, setOpen] = useState(false)
  const closeTimer = useRef(0)
  const navRef = useRef<HTMLElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<HTMLButtonElement>(null)
  const rowRef = useRef<HTMLUListElement>(null)
  const highlightRef = useRef<HTMLLIElement>(null)
  const segRef = useScramble<HTMLSpanElement>(sections[index].path, mode !== 'static')

  useEffect(() => onTheme(theme), [theme, onTheme])

  // Widths are measured so the morph always fits its content (spec 6.00).
  useLayoutEffect(() => {
    const pill = pillRef.current
    const path = pathRef.current
    const row = rowRef.current
    if (!pill || !path || !row) return
    const wide = open && !touch
    pill.style.width = `${wide ? row.scrollWidth : path.scrollWidth}px`
    const current = row.querySelector<HTMLElement>('a[aria-current="true"]')
    const hi = highlightRef.current
    if (hi && current) {
      hi.style.left = `${current.offsetLeft}px`
      hi.style.width = `${current.offsetWidth}px`
    }
  }, [open, touch, index])

  const openNow = useCallback(() => {
    window.clearTimeout(closeTimer.current)
    setOpen(true)
  }, [])
  const closeSoon = useCallback(() => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      if (!navRef.current?.contains(document.activeElement)) setOpen(false)
    }, CLOSE_DELAY_MS)
  }, [])

  // Desktop intro: open into the dock row just after load, fold back after 3 s unless the
  // visitor is already on it. Once per page load; not on touch, narrow screens or reduced motion.
  const introDone = useRef(false)
  const introTimers = useRef({ open: 0, fold: 0 })
  useEffect(() => {
    if (introDone.current || mode === 'static') return
    introDone.current = true
    if (matchMedia(PANEL_QUERY).matches) return
    const timers = introTimers.current
    timers.open = window.setTimeout(() => setOpen(true), INTRO_DELAY_MS)
    timers.fold = window.setTimeout(() => {
      const nav = navRef.current
      if (nav && !nav.matches(':hover') && !nav.contains(document.activeElement)) setOpen(false)
    }, INTRO_DELAY_MS + INTRO_MS)
  }, [mode])
  useEffect(() => {
    const timers = introTimers.current
    return () => {
      window.clearTimeout(timers.open)
      window.clearTimeout(timers.fold)
    }
  }, [])

  // Touch: a tap outside closes the panel.
  useEffect(() => {
    if (!touch || !open) return
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (!navRef.current?.contains(target) && !document.getElementById('section-panel')?.contains(target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [touch, open])

  const pick = () => setOpen(false)

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Sections"
        className={`${styles.nav} ${open ? styles.open : ''} ${touch ? styles.touch : ''}`}
        onPointerEnter={touch ? undefined : openNow}
        onPointerLeave={touch ? undefined : closeSoon}
        onFocus={touch ? undefined : openNow}
        onBlur={(e) => {
          if (!touch && !navRef.current?.contains(e.relatedTarget as Node)) closeSoon()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setOpen(false)
            pathRef.current?.focus()
          }
        }}
      >
        <div ref={pillRef} className={styles.pill}>
          <button
            ref={pathRef}
            type="button"
            className={styles.path}
            aria-expanded={open}
            aria-controls={touch ? 'section-panel' : 'section-row'}
            onClick={() => (touch ? setOpen((v) => !v) : openNow())}
          >
            <span className="sr-only">Current section: {sections[index].label}. Show all sections</span>
            <span ref={segRef} className={styles.seg} aria-hidden="true">
              {sections[index].path}
            </span>
            <span className={styles.count} aria-hidden="true">
              {formatCounter(index, LAST)}
            </span>
            <span className={styles.caret} aria-hidden="true">
              ▾
            </span>
          </button>
          <ul id="section-row" ref={rowRef} className={styles.row}>
            <li ref={highlightRef} className={styles.highlight} aria-hidden="true" />
            {sections.slice(1).map((s, i) => (
              <li key={s.id} style={{ display: 'contents' }}>
                <a
                  href={`#${s.id}`}
                  aria-current={i + 1 === index}
                  tabIndex={open && !touch ? 0 : -1}
                  style={{ '--i': i } as CSSProperties}
                  onClick={pick}
                >
                  <small>{String(i + 1).padStart(2, '0')}</small>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {touch && (
        <div id="section-panel" className={`${styles.panel} ${open ? styles.panelOpen : ''}`}>
          {sections.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={i === index}
              style={{ '--i': i } as CSSProperties}
              onClick={pick}
            >
              <small>{String(i).padStart(2, '0')}</small>
              {s.label}
            </a>
          ))}
          {site.calLink && (
            <a className={styles.panelFoot} href={site.calLink} target="_blank" rel="noreferrer">
              book a 20-min call <b>↗</b>
            </a>
          )}
        </div>
      )}
    </>
  )
}
