'use client'

import { useSyncExternalStore } from 'react'
import { site } from '@/data/site'
import styles from '@/app/launch-kit/launch-kit.module.css'

// Regional pricing, offered only to visitors whose browser is set to India's time zone. It is added
// after the page loads (the server snapshot is false), so search engines, AI crawlers and the
// structured data see only the dollar price, and no rupee figure is ever published
// (docs/launch-kit.md).
const noSubscribe = () => () => {}
function inIndia() {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return zone === 'Asia/Kolkata' || zone === 'Asia/Calcutta'
  } catch {
    return false
  }
}
function useInIndia() {
  return useSyncExternalStore(noSubscribe, inIndia, () => false)
}

const callHref = site.calLink ?? '/#contact'

export function IndiaChip() {
  const india = useInIndia()
  if (!india) return null
  return (
    <a className={styles.indiaChip} href="#pricing">
      <span aria-hidden="true">₹</span> Building from India? Regional pricing →
    </a>
  )
}

export function IndiaBlock() {
  const india = useInIndia()
  if (!india) return null
  return (
    <div className={styles.india}>
      <p className={styles.indiaTitle}>
        <span aria-hidden="true">₹</span> Building from India?
      </p>
      <p className={styles.indiaText}>We offer regional pricing. Book a 30-minute call and we&apos;ll quote in rupees, for your scope.</p>
      <a className={styles.indiaCta} href={callHref} target="_blank" rel="noopener">
        Get India pricing
      </a>
    </div>
  )
}

// The phone version of the pinned price card: a bar along the bottom of the screen.
export function KitBar() {
  const india = useInIndia()
  return (
    <div className={styles.bar}>
      <p>
        <b>$9,500</b>
        <span>{india ? 'regional pricing in India' : 'fixed, 4 weeks'}</span>
      </p>
      <a className={styles.barCta} href={callHref} target="_blank" rel="noopener">
        {india ? 'Get India pricing' : 'Book a launch slot'}
      </a>
    </div>
  )
}
