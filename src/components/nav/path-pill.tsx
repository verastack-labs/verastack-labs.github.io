'use client'

import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { sections } from '@/data/sections'
import { booking } from '@/data/site'
import { studioLinks } from '@/data/studio-links'
import { formatCounter } from '@/lib/counter'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'
import { useActiveSection } from '@/components/nav/use-active-section'
import { useScramble } from '@/components/use-scramble'
import { FullMenu, useFullMenu } from '@/components/nav/full-menu'
import styles from '@/components/nav/path-pill.module.css'

const IDS = sections.map((s) => s.id)
const LAST = sections.length - 1

export function PathPill({ onTheme }: { onTheme: (theme: 'dark' | 'light') => void }) {
  const { index, theme } = useActiveSection(IDS)
  const mode = useMotionPreference()
  // From 900 px up the pill opens the full-screen menu on click; below that it opens the panel.
  // Nothing opens on hover (Rigan, 2026-10-23: one menu per screen size, never a hover row).
  const wide = useFullMenu()
  const [full, setFull] = useState(false)
  const [panel, setOpen] = useState(false)
  // The panel only counts as open below 900 px, so widening the window closes it.
  const open = panel && !wide
  const navRef = useRef<HTMLElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<HTMLButtonElement>(null)
  const segRef = useScramble<HTMLSpanElement>(sections[index].path, mode !== 'static')

  useEffect(() => onTheme(theme), [theme, onTheme])

  // The pill's width follows the section path, so it morphs as the name changes (spec 6.00).
  useLayoutEffect(() => {
    const pill = pillRef.current
    const path = pathRef.current
    if (pill && path) pill.style.width = `${path.scrollWidth}px`
  }, [index])

  // A tap outside closes the panel.
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (!navRef.current?.contains(target) && !document.getElementById('section-panel')?.contains(target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  const pick = () => setOpen(false)

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Sections"
        className={styles.nav}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && open) {
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
            aria-expanded={wide ? full : open}
            aria-controls={wide ? undefined : 'section-panel'}
            aria-haspopup={wide ? 'dialog' : undefined}
            onClick={() => (wide ? setFull(true) : setOpen(!open))}
          >
            <span className="sr-only">Current section: {sections[index].label}. Show all sections</span>
            <span ref={segRef} className={styles.seg} aria-hidden="true">
              {sections[index].path}
            </span>
            <span className={styles.count} aria-hidden="true">
              {formatCounter(index, LAST)}
            </span>
            <span className={styles.caret} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </nav>
      {wide ? (
        <FullMenu
          open={full}
          onClose={() => {
            setFull(false)
            pathRef.current?.focus({ preventScroll: true })
          }}
          current={index}
          onHome
        />
      ) : (
        <div id="section-panel" className={`${styles.panel} ${open ? styles.panelOpen : ''}`} data-lenis-prevent>
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
          <StudioGroup start={sections.length} onPick={pick} />
          <a
            className={styles.panelFoot}
            href={booking.href}
            onClick={pick}
            {...(booking.external ? { target: '_blank', rel: 'noreferrer' } : {})}
          >
            book a 30-min call <b>↗</b>
          </a>
        </div>
      )}
    </>
  )
}

// The studio pages as the panel's second group: the launch kit first, flagged while it is new.
export function StudioGroup({ start, onPick }: { start: number; onPick: () => void }) {
  return (
    <>
      <p className={styles.panelHead} style={{ '--i': start } as CSSProperties}>
        studio
      </p>
      {studioLinks.map((l, i) => (
        <Link key={l.href} href={l.href} style={{ '--i': start + 1 + i } as CSSProperties} onClick={onPick}>
          {l.label}
          {l.isNew && <span className={styles.newTag}>new</span>}
        </Link>
      ))}
    </>
  )
}
