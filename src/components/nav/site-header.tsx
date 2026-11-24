'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useFramed } from '@/lib/use-framed'
import { PathPill } from '@/components/nav/path-pill'
import { FullMenu, useFullMenu } from '@/components/nav/full-menu'
import { MobileMenu } from '@/components/nav/mobile-menu'
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

// The page pill opens the site menu: the desktop full-screen menu from 900 px up, the phone menu
// below. Either way it is a modal dialog; Escape closes it and focus returns to the pill.
function PageMenu({ path, short }: { path: string; short?: string }) {
  const wide = useFullMenu()
  const [full, setFull] = useState(false)
  const [phone, setPhone] = useState(false)
  const btn = useRef<HTMLButtonElement>(null)
  const close = () => {
    setFull(false)
    setPhone(false)
    btn.current?.focus({ preventScroll: true })
  }
  return (
    <div className={styles.menuWrap}>
      <button
        type="button"
        ref={btn}
        className={`${styles.pill} ${styles.pagePill} ${styles.pageMenuBtn}`}
        aria-expanded={wide ? full : phone}
        aria-haspopup="dialog"
        onClick={() => (wide ? setFull(true) : setPhone(true))}
      >
        <span className="sr-only">Menu, on {path}. </span>
        <span className={styles.seg} aria-hidden="true">
          <span className={styles.segLong}>{path}</span>
          {short && <span className={styles.segShort}>{short}</span>}
        </span>
        <span className={styles.caret} aria-hidden="true">
          <i />
          <i />
        </span>
      </button>
      {wide ? <FullMenu open={full} onClose={close} /> : <MobileMenu open={phone} onClose={close} from={btn} on={short ?? path} />}
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
  if (pathname?.startsWith('/blog')) return <PageHeader key={pathname} path="/blog" />
  if (pathname?.startsWith('/examples')) return <PageHeader key={pathname} path="/examples" />
  if (pathname?.startsWith('/work')) return <PageHeader key={pathname} path={pathname.replace(/\/$/, '') || '/work'} short="/work" />
  if (pathname?.startsWith('/founder')) return <PageHeader key={pathname} path="/founder" />
  if (pathname?.startsWith('/film')) return <PageHeader key={pathname} path="/films" />
  if (pathname?.startsWith('/launch-kit')) return <PageHeader key={pathname} path="/launch-kit" short="/kit" />
  if (pathname?.startsWith('/tools/ai-search-check') || pathname?.startsWith('/ai-search-check'))
    return <PageHeader key={pathname} path="/tools/ai-search-check" short="/ai-check" />
  if (pathname?.startsWith('/tools/organization-schema')) return <PageHeader key={pathname} path="/tools/organization-schema" short="/org" />
  if (pathname?.startsWith('/tools/what-ai-sees')) return <PageHeader key={pathname} path="/tools/what-ai-sees" short="/ai-sees" />
  if (pathname?.startsWith('/tools/product-schema')) return <PageHeader key={pathname} path="/tools/product-schema" short="/product" />
  if (pathname?.startsWith('/tools/faq-schema')) return <PageHeader key={pathname} path="/tools/faq-schema" short="/faq" />
  if (pathname?.startsWith('/tools')) return <PageHeader key={pathname} path="/tools" />
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
