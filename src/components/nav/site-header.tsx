'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useFramed } from '@/lib/use-framed'
import { PathPill } from '@/components/nav/path-pill'
import { sections } from '@/data/sections'
import { studioLinks } from '@/data/studio-links'
import styles from '@/components/nav/path-pill.module.css'

// The Launch Kit button, beside Start a project on desktop; hidden on its own page.
function KitButton() {
  const pathname = usePathname()
  if (pathname?.startsWith('/launch-kit')) return null
  return (
    <Link className={styles.kit} href="/launch-kit">
      Launch kit <span className={styles.newDot} aria-label="new" />
    </Link>
  )
}

// The page pill opens a menu: the home page's sections, then the studio pages. Hover opens it on
// desktop; a click or tap toggles it; Escape or a click elsewhere closes it.
function PageMenu({ path, short }: { path: string; short?: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const timer = useRef(0)
  const hover = () => window.matchMedia('(hover: hover) and (min-width: 641px)').matches

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const close = () => setOpen(false)
  return (
    <div
      ref={wrap}
      className={styles.menuWrap}
      onPointerEnter={() => {
        if (!hover()) return
        window.clearTimeout(timer.current)
        setOpen(true)
      }}
      onPointerLeave={() => {
        if (!hover()) return
        timer.current = window.setTimeout(close, 260)
      }}
      onKeyDown={(e) => e.key === 'Escape' && close()}
    >
      <button
        type="button"
        className={`${styles.pill} ${styles.pagePill} ${styles.pageMenuBtn}`}
        aria-expanded={open}
        aria-controls="page-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">Menu, on {path}. </span>
        <span className={styles.seg} aria-hidden="true">
          <span className={styles.segLong}>{path}</span>
          {short && <span className={styles.segShort}>{short}</span>}
        </span>
        <span className={styles.caret} aria-hidden="true">
          ▾
        </span>
      </button>
      <nav id="page-menu" aria-label="Site" className={`${styles.dropdown} ${open ? styles.panelOpen : ''}`}>
        <p className={styles.panelHead}>home</p>
        {sections.map((sec, i) => (
          <Link key={sec.id} href={sec.id === 'top' ? '/' : `/#${sec.id}`} tabIndex={open ? 0 : -1} onClick={close}>
            <small>{String(i).padStart(2, '0')}</small>
            {sec.label}
          </Link>
        ))}
        <p className={styles.panelHead}>studio</p>
        {studioLinks.map((l) => (
          <Link key={l.href} href={l.href} aria-current={!!pathname?.startsWith(l.href)} tabIndex={open ? 0 : -1} onClick={close}>
            {l.label}
            {l.isNew && <span className={styles.newTag}>new</span>}
          </Link>
        ))}
      </nav>
    </div>
  )
}

// Away from the one-page home (the blog, the tools, the founder page, the launch kit), there are no
// sections to track: the wordmark goes home, the pill names the page and opens the site menu, and
// the call to action jumps to the home page's contact section. A long page name can pass a short
// one for phones.
function PageHeader({ path, short }: { path: string; short?: string }) {
  return (
    <header className={styles.header} data-theme="dark">
      <Link className={styles.wordmark} href="/" aria-label="VeraStack Labs, home">
        verastack<em>/</em>
        <span>labs</span>
      </Link>
      <PageMenu path={path} short={short} />
      <KitButton />
      <Link className={styles.cta} href="/#contact" aria-label="Start a project">
        <span className={styles.ctaLong}>Start a project</span>
        <span className={styles.ctaShort} aria-hidden="true">
          Let&apos;s talk
        </span>
      </Link>
    </header>
  )
}

export function SiteHeader() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const pathname = usePathname()
  const framed = useFramed()
  if (framed) return null
  if (pathname?.startsWith('/blog')) return <PageHeader path="/blog" />
    if (pathname?.startsWith('/examples')) return <PageHeader path="/examples" />
  if (pathname?.startsWith('/founder')) return <PageHeader path="/founder" />
  if (pathname?.startsWith('/launch-kit')) return <PageHeader path="/launch-kit" short="/kit" />
  if (pathname?.startsWith('/tools/ai-search-check') || pathname?.startsWith('/ai-search-check'))
    return <PageHeader path="/tools/ai-search-check" short="/ai-check" />
  if (pathname?.startsWith('/tools/what-ai-sees')) return <PageHeader path="/tools/what-ai-sees" short="/ai-sees" />
  if (pathname?.startsWith('/tools/product-schema')) return <PageHeader path="/tools/product-schema" short="/product" />
  if (pathname?.startsWith('/tools/faq-schema')) return <PageHeader path="/tools/faq-schema" short="/faq" />
  if (pathname?.startsWith('/tools')) return <PageHeader path="/tools" />
  return (
    <header className={styles.header} data-theme={theme}>
      <a className={styles.wordmark} href="#top" aria-label="VeraStack Labs, back to top">
        verastack<em>/</em>
        <span>labs</span>
      </a>
      <PathPill onTheme={setTheme} />
      <KitButton />
      {/* Under 375 px the full label does not fit beside the pill, so a shorter one shows. */}
      <a className={styles.cta} href="#contact" aria-label="Start a project">
        <span className={styles.ctaLong}>Start a project</span>
        <span className={styles.ctaShort} aria-hidden="true">
          Let&apos;s talk
        </span>
      </a>
    </header>
  )
}
