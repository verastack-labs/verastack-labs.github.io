'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, type CSSProperties, type RefObject } from 'react'
import { sections } from '@/data/sections'
import { booking } from '@/data/site'
import { studioLinks } from '@/data/studio-links'
import { lenisRef } from '@/lib/motion/smooth-scroll'
import styles from '@/components/nav/mobile-menu.module.css'

// Matches the closing wipe in mobile-menu.module.css.
const CLOSE_MS = 400

type Props = {
  open: boolean
  onClose: () => void
  // The menu button: the wipe opens from its centre.
  from: RefObject<HTMLElement | null>
  // What the label says the visitor is on: "home" or the page path.
  on: string
  // On the home page: which section is in view, and section links scroll in place.
  current?: number
  onHome?: boolean
}

// The phone and tablet menu (under 900 px): a modal dialog over the whole screen. It wipes open in a
// circle from the menu button, the home sections rise in two columns right above the studio pages,
// and Start a project and a close button sit in the thumb zone at the bottom. Focus stays inside,
// and Escape, either close button or the back gesture closes it.
export function MobileMenu({ open, onClose, from, on, current, onHome }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const dialog = useRef<HTMLDialogElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const closeTimer = useRef(0)
  // Whether the history entry pushed on open (so the back gesture closes the menu) is still on top.
  const pushed = useRef(false)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    window.clearTimeout(closeTimer.current)
    if (open) {
      const b = from.current?.getBoundingClientRect()
      if (b) {
        d.style.setProperty('--ox', `${b.left + b.width / 2}px`)
        d.style.setProperty('--oy', `${b.top + b.height / 2}px`)
      }
      d.removeAttribute('data-closing')
      if (!d.open) d.showModal()
      lenisRef.current?.stop()
      document.documentElement.style.overflow = 'hidden'
      if (!pushed.current) {
        history.pushState(history.state, '', location.href)
        pushed.current = true
      }
      return
    }
    lenisRef.current?.start()
    document.documentElement.style.overflow = ''
    if (!d.open) return
    d.setAttribute('data-closing', '')
    closeTimer.current = window.setTimeout(() => {
      d.removeAttribute('data-closing')
      d.close()
    }, CLOSE_MS)
  }, [open, from])

  // The back gesture pops the entry pushed on open, which closes the menu.
  useEffect(() => {
    const onPop = () => {
      if (!pushed.current) return
      pushed.current = false
      onCloseRef.current()
    }
    addEventListener('popstate', onPop)
    return () => removeEventListener('popstate', onPop)
  }, [])

  useEffect(
    () => () => {
      window.clearTimeout(closeTimer.current)
      lenisRef.current?.start()
      document.documentElement.style.overflow = ''
    },
    [],
  )

  // A fade at the edges of the section list, only when it really scrolls.
  useEffect(() => {
    const el = body.current
    if (!el) return
    const fit = () => el.toggleAttribute('data-scroll', el.scrollHeight > el.clientHeight + 1)
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    fit()
    return () => ro.disconnect()
  }, [])

  // Closing without leaving the page (a close button, Escape, a link that opens elsewhere) also
  // drops the pushed entry, so the next back press leaves the page as it should.
  const dismiss = () => {
    if (pushed.current) {
      pushed.current = false
      history.back()
    }
    onClose()
  }

  // Going to another page replaces the pushed entry, so history holds no stray copy of this page.
  const go = (href: string) => (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    if (pushed.current) {
      pushed.current = false
      router.replace(href)
    } else router.push(href)
    onClose()
  }

  // On the home page a section link scrolls there once the page is free to move. The hash replaces
  // the pushed entry, as following an in-page link would.
  const goTo = (id: string) => (e: React.MouseEvent) => {
    if (!onHome) return go(id === 'top' ? '/' : `/#${id}`)(e)
    e.preventDefault()
    pushed.current = false
    onClose()
    window.setTimeout(() => {
      const el = id === 'top' ? document.body : document.getElementById(id)
      history.replaceState(history.state, '', id === 'top' ? location.pathname : `#${id}`)
      if (!el) return
      if (lenisRef.current) lenisRef.current.scrollTo(id === 'top' ? 0 : el, { offset: 0 })
      else el.scrollIntoView({ behavior: 'smooth' })
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
        dismiss()
      }}
    >
      <div className={styles.top}>
        <p className={styles.label}>
          menu <em>{'//'}</em> on {on}
        </p>
        <button type="button" className={styles.xs} onClick={dismiss} aria-label="Close menu" autoFocus />
      </div>

      <div ref={body} className={styles.body}>
        <p className={styles.head}>home page</p>
        <nav aria-label="Home page sections">
          <ol className={styles.sections}>
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={onHome ? `#${s.id === 'top' ? '' : s.id}` : s.id === 'top' ? '/' : `/#${s.id}`}
                  aria-current={onHome && current === i ? 'location' : undefined}
                  style={{ '--i': i } as CSSProperties}
                  onClick={goTo(s.id)}
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
      </div>

      <div className={styles.pinned}>
        <p className={styles.head}>studio pages</p>
        <nav aria-label="Studio pages">
          <ul className={styles.studio}>
            {studioLinks.map((l, i) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={pathname?.startsWith(l.href) ? 'page' : undefined}
                  style={{ '--i': i } as CSSProperties}
                  onClick={go(l.href)}
                >
                  {l.menuLabel ?? l.label}
                  {l.isNew && <span className={styles.new}>new</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={styles.dock}>
        <a className={styles.start} href={onHome ? '#contact' : '/#contact'} onClick={goTo('contact')}>
          Start a project
        </a>
        <button type="button" className={styles.xl} onClick={dismiss} aria-label="Close menu" />
      </div>
      <p className={styles.book}>
        or{' '}
        <a href={booking.href} onClick={dismiss} {...(booking.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
          book a 30-min call
        </a>
      </p>
    </dialog>
  )
}
