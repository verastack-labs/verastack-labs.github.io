'use client'

import { useState } from 'react'
import { PathPill } from '@/components/nav/path-pill'
import styles from '@/components/nav/path-pill.module.css'

export function SiteHeader() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  return (
    <header className={styles.header} data-theme={theme}>
      <a className={styles.wordmark} href="#top" aria-label="VeraStack Labs, back to top">
        verastack<em>/</em>
        <span>labs</span>
      </a>
      <PathPill onTheme={setTheme} />
      <a className={styles.cta} href="#contact">
        Start a project
      </a>
    </header>
  )
}
