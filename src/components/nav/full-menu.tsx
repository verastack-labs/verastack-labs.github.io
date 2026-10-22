'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { studioFilm } from '@/data/films'
import { sections } from '@/data/sections'
import { booking, site } from '@/data/site'
import { studioLinks } from '@/data/studio-links'
import { lenisRef } from '@/lib/motion/smooth-scroll'
import { MenuGlyphs, type GlyphHandle } from '@/components/nav/menu-glyphs'
import styles from '@/components/nav/full-menu.module.css'

// Matches the closing transition in full-menu.module.css.
const CLOSE_MS = 420

// The menu goes full screen from this width up; narrower screens keep the compact panel.
export const FULL_MENU_QUERY = '(min-width: 900px)'

// Whether the full-screen menu applies at the current width.
export function useFullMenu(): boolean {
  const [wide, setWide] = useState(false)
  useEffect(() => {
    const list = matchMedia(FULL_MENU_QUERY)
    const update = () => setWide(list.matches)
    update()
    list.addEventListener('change', update)
    return () => list.removeEventListener('change', update)
  }, [])
  return wide
}

type Props = {
  open: boolean
  onClose: () => void
  // On the home page: which section is in view, and section links scroll in place.
  current?: number
  onHome?: boolean
}

// The desktop menu: a modal dialog over the whole screen. It wipes open in a circle from the menu
// button, the sections rise in one by one in big type, and hovering one dims the rest. The studio
// pages, the film and the ways to get in touch sit in a column beside them. The page behind holds
// still (Lenis stops and the wheel stays inside), Escape closes, focus stays inside while it is open.
export function FullMenu({ open, onClose, current, onHome }: Props) {
  const pathname = usePathname()
  const dialog = useRef<HTMLDialogElement>(null)
  const closeTimer = useRef(0)
  const glyphs = useRef<GlyphHandle>(null)

  // The floating glyphs snap towards the link in focus or under the pointer; away from the links
  // they go back to drifting where they were.
  const aim = useCallback((a: HTMLElement | null, section: string | null) => glyphs.current?.aim(a, section), [])
  const rest = useCallback(() => aim(null, null), [aim])

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    window.clearTimeout(closeTimer.current)
    if (open) {
      d.removeAttribute('data-closing')
      if (!d.open) d.showModal()
      rest()
      lenisRef.current?.stop()
      document.documentElement.style.overflow = 'hidden'
      return
    }
    // Let the page move again at once; the overlay plays its exit on top, then closes.
    lenisRef.current?.start()
    document.documentElement.style.overflow = ''
    if (!d.open) return
    d.setAttribute('data-closing', '')
    closeTimer.current = window.setTimeout(() => {
      d.removeAttribute('data-closing')
      d.close()
    }, CLOSE_MS)
  }, [open, rest])

  useEffect(
    () => () => {
      window.clearTimeout(closeTimer.current)
      lenisRef.current?.start()
      document.documentElement.style.overflow = ''
    },
    [],
  )

  // On the home page a section link scrolls there once the page is free to move.
  const goTo = (id: string) => (e: React.MouseEvent) => {
    if (!onHome) {
      onClose()
      return
    }
    e.preventDefault()
    onClose()
    window.setTimeout(() => {
      const el = id === 'top' ? document.body : document.getElementById(id)
      if (!el) return
      if (lenisRef.current) lenisRef.current.scrollTo(id === 'top' ? 0 : el, { offset: 0 })
      else el.scrollIntoView({ behavior: 'smooth' })
      history.replaceState(null, '', id === 'top' ? '#' : `#${id}`)
    }, 40)
  }

  return (
    <dialog
      ref={dialog}
      className={styles.menu}
      aria-label="Menu"
      data-lenis-prevent
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
    >
      <div className={styles.top}>
        <p className={styles.label}>
          /menu <em>{'//'}</em> {site.name.toLowerCase()}
        </p>
        <button type="button" className={styles.close} onClick={onClose} autoFocus>
          close <kbd>esc</kbd>
          <span className={styles.closeX} aria-hidden="true" />
        </button>
      </div>

      <MenuGlyphs ref={glyphs} />
      <div className={styles.body}>
        <nav aria-label="Home sections" onPointerLeave={rest}>
          <ol className={styles.sections}>
            {sections.map((s, i) => (
              <li key={s.id} style={{ '--i': i } as CSSProperties}>
                <a
                  href={onHome ? `#${s.id === 'top' ? '' : s.id}` : s.id === 'top' ? '/' : `/#${s.id}`}
                  aria-current={onHome && current === i ? 'true' : undefined}
                  onClick={goTo(s.id)}
                  onPointerEnter={(e) => aim(e.currentTarget, s.id)}
                  onFocus={(e) => aim(e.currentTarget, s.id)}
                >
                  <small>{String(i).padStart(2, '0')}</small>
                  <span className={styles.word}>
                    <span>{s.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <aside className={styles.side}>
          <p className={styles.head} style={{ '--i': 0 } as CSSProperties}>
            studio
          </p>
          <ul className={styles.studio}>
            {studioLinks.map((l, i) => (
              <li key={l.href} style={{ '--i': i + 1 } as CSSProperties}>
                <Link href={l.href} onClick={onClose} aria-current={pathname?.startsWith(l.href) ? 'page' : undefined}>
                  {l.label}
                  {l.isNew && <span className={styles.newTag}>new</span>}
                  <b aria-hidden="true">→</b>
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/films" className={styles.film} onClick={onClose} style={{ '--i': studioLinks.length + 1 } as CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimiser */}
            <img src={studioFilm.poster} alt="" width={1920} height={1080} loading="lazy" decoding="async" />
            <span className={styles.filmPlay} aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M8 5.5v13l10.5-6.5z" />
              </svg>
            </span>
            <span className={styles.filmText}>
              <b>The studio in 90 seconds</b>
              <span>Watch our film</span>
            </span>
          </Link>

          <div className={styles.contact} style={{ '--i': studioLinks.length + 2 } as CSSProperties}>
            <Link href={onHome ? '#contact' : '/#contact'} className={styles.cta} onClick={onHome ? goTo('contact') : onClose}>
              Start a project
            </Link>
            <a href={booking.href} className={styles.ghost} onClick={onClose} {...(booking.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
              Book a 30-min call ↗
            </a>
            {site.email && (
              <a href={`mailto:${site.email}`} className={styles.mail}>
                {site.email}
              </a>
            )}
          </div>
        </aside>
      </div>

      <p className={styles.foot}>
        verastack.dev <em>{'//'}</em> design and engineering studio
      </p>
    </dialog>
  )
}
