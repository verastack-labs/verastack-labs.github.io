import Link from 'next/link'
import { supporting } from '@/data/work'
import styles from '@/scenes/work/work.module.css'

// Supporting work (spec 6.03). With `marquee`, hovering a row slides up a signal band with the
// row's text scrolling across it (flowing menu). No links: these have no case studies yet. The
// list closes on the way into /work, set in the same column so it reads as the list's last word.
export function FlowingList({ marquee }: { marquee: boolean }) {
  return (
    <div className={styles.listWrap}>
      <p className={styles.label}>
        /work <em>{'//'}</em> also built by our founder
      </p>
      <ul className={styles.list}>
        {supporting.map((w) => {
          const text = `${w.client} · ${w.summary}${w.status === 'launching' ? ' · launching soon' : ''} · `
          return (
            <li key={w.id} className={styles.row}>
              <span className={styles.rowName}>{w.client}</span>
              <span className={styles.rowMeta}>
                {w.status === 'launching' && <b className={styles.soon}>launching soon</b>}
                {w.summary}
              </span>
              {marquee && (
                <span className={styles.band} aria-hidden="true">
                  <span className={styles.marquee}>
                    {text.repeat(4)}
                    {text.repeat(4)}
                  </span>
                </span>
              )}
            </li>
          )
        })}
      </ul>
      <Link href="/work/" className={styles.allWork}>
        <span className={styles.allWorkLabel}>clients, products and concepts</span>
        <span className={styles.allWorkTitle}>See all our work</span>
        <span className={styles.allWorkArrow} aria-hidden="true">
          →
        </span>
      </Link>
    </div>
  )
}
