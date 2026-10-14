'use client'

import { useState } from 'react'
import { mods, modsLicense, type Mod } from '@/data/mods'
import styles from '@/scenes/products/products.module.css'

function Install({ mod }: { mod: Mod }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(mod.install)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // No clipboard access: the command stays visible to select by hand.
    }
  }
  return (
    <div className={styles.modInstall}>
      <code>{mod.install}</code>
      <button type="button" onClick={copy} aria-label={`Copy the install command for ${mod.name}`}>
        {copied ? 'copied' : 'copy'}
      </button>
    </div>
  )
}

// After the products: the small, open-source tools we publish for Claude Code.
export function ModShelf() {
  return (
    <div className={styles.mods}>
      <p className={styles.label}>
        /products/mods <em>{'//'}</em> open source, for Claude Code
      </p>
      <ul className={styles.modGrid}>
        {mods.map((m) => (
          <li key={m.id} className={styles.mod}>
            <p className={styles.modSample} aria-hidden="true">
              <i>›</i> {m.sample}
            </p>
            <h3 className={styles.modName}>{m.name}</h3>
            <p className={styles.modLine}>{m.line}</p>
            <Install mod={m} />
            <a className={styles.modRepo} href={m.repo} target="_blank" rel="noopener">
              GitHub ↗ <span>{modsLicense}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
