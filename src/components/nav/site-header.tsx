'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useFramed } from '@/lib/use-framed'
import { PathPill } from '@/components/nav/path-pill'
import styles from '@/components/nav/path-pill.module.css'

// Away from the one-page home (the blog, the AI search check, the founder page), there are no sections to track: the
// wordmark goes home, the pill names the page, and the call to action jumps to the home page's
// contact section. A long page name can pass a short one for phones.
function PageHeader({ path, short, href = path }: { path: string; short?: string; href?: string }) {
  return (
    <header className={styles.header} data-theme="dark">
      <Link className={styles.wordmark} href="/" aria-label="VeraStack Labs, home">
        verastack<em>/</em>
        <span>labs</span>
      </Link>
      <Link className={`${styles.pill} ${styles.pagePill}`} href={href} aria-label={path}>
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
  const framed = useFramed()
  if (framed) return null
  if (pathname?.startsWith('/blog')) return <PageHeader path="/blog" />
  // There is no /examples index; the pill points at the example being viewed.
  if (pathname?.startsWith('/examples')) return <PageHeader path="/examples" href={pathname} />
  if (pathname?.startsWith('/founder')) return <PageHeader path="/founder" />
  if (pathname?.startsWith('/launch-kit')) return <PageHeader path="/launch-kit" />
  if (pathname?.startsWith('/tools/ai-search-check') || pathname?.startsWith('/ai-search-check'))
    return <PageHeader path="/tools/ai-search-check" short="/ai-check" href="/tools/ai-search-check" />
  if (pathname?.startsWith('/tools')) return <PageHeader path="/tools" />
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
