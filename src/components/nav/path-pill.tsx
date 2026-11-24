'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { sections } from '@/data/sections'
import { formatCounter } from '@/lib/counter'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'
import { useActiveSection } from '@/components/nav/use-active-section'
import { useScramble } from '@/components/use-scramble'
import { FullMenu, useFullMenu } from '@/components/nav/full-menu'
import { MobileMenu } from '@/components/nav/mobile-menu'
import styles from '@/components/nav/path-pill.module.css'

const IDS = sections.map((s) => s.id)
const LAST = sections.length - 1

export function PathPill({ onTheme }: { onTheme: (theme: 'dark' | 'light') => void }) {
  const { index, theme } = useActiveSection(IDS)
  const mode = useMotionPreference()
  // From 900 px up the pill opens the desktop full-screen menu; below that, the phone menu. Nothing
  // opens on hover (Rigan, 2026-10-23: one menu per screen size, never a hover row).
  const wide = useFullMenu()
  const [full, setFull] = useState(false)
  const [phone, setPhone] = useState(false)
  // The phone menu only counts as open below 900 px, so widening the window closes it.
  const open = phone && !wide
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

  return (
    <>
      <nav aria-label="Sections" className={styles.nav}>
        <div ref={pillRef} className={styles.pill}>
          <button
            ref={pathRef}
            type="button"
            className={styles.path}
            aria-expanded={wide ? full : open}
            aria-haspopup="dialog"
            onClick={() => (wide ? setFull(true) : setPhone(true))}
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
        <MobileMenu
          open={open}
          onClose={() => {
            setPhone(false)
            pathRef.current?.focus({ preventScroll: true })
          }}
          from={pathRef}
          on="home"
          current={index}
          onHome
        />
      )}
    </>
  )
}

