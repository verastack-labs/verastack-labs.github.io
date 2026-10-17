'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { PathPill } from '@/components/nav/path-pill'
import styles from '@/components/nav/path-pill.module.css'

// Away from the one-page home (the blog, the AI search check), there are no sections to track: the
// wordmark goes home, the pill names the page, and the call to action jumps to the home page's
// contact section. A long page name can pass a short one for phones.
function PageHeader({ path, short }: { path: string; short?: string }) {
  return (
    <header className={styles.header} data-theme="dark">
      <Link className={styles.wordmark} href="/" aria-label="VeraStack Labs, home">
        verastack<em>/</em>
        <span>labs</span>
      </Link>
      <Link className={`${styles.pill} ${styles.pagePill}`} href={path} aria-label={path}>
        <span className={styles.seg}>
          <span className={styles.segLong}>{path}</span>
          {short && (
            <span className={styles.segShort}>{short}</span>
          )}
        </span>
      </Link>
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
  if (pathname?.startsWith('/blog')) return <PageHeader path="/blog" />
  if (pathname?.startsWith('/ai-search-check')) return <PageHeader path="/ai-search-check" short="/ai-check" />
  return (
    <header className={styles.header} data-theme={theme}>
      <a className={styles.wordmark} href="#top" aria-label="VeraStack Labs, back to top">
        verastack<em>/</em>
        <span>labs</span>
      </a>
      <PathPill onTheme={setTheme} />
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
