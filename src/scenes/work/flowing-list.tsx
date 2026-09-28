import { supporting } from '@/data/work'
import styles from '@/scenes/work/work.module.css'

// Supporting work (spec 6.03). With `marquee`, hovering a row slides up a signal band with the
// row's text scrolling across it (flowing menu). No links: these have no case studies yet.
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
    </div>
  )
}
