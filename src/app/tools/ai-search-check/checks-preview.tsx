import { checks } from '@/data/ai-search-check'
import styles from '@/app/tools/ai-search-check/checker.module.css'

// Two checks in full; the third with its description fading out halfway; the fourth's name nearly
// readable behind a light blur (a row you can almost read pulls people in more than an unreadable
// one); then two blurred rows that hold no real text.
const FULL = 2
const FADED = 2

// What the check looks at: a taste, not the playbook. Only these checks reach the page (this
// renders on the server, so the rest are not in the HTML or the JavaScript either); the full list,
// with what each found and how to fix it, is what the audit sells.
export function ChecksPreview() {
  const half = checks[FULL]
  const tease = checks[FULL + 1]
  const more = checks.length - (FULL + 1)
  return (
    <div className={styles.preview}>
      <ol className={styles.explain}>
        {checks.slice(0, FULL).map((c) => (
          <li key={c.id}>
            <b>{c.label}</b>
            <span>{c.why}</span>
          </li>
        ))}
        <li key={half.id} data-half>
          <b>{half.label}</b>
          <span>{half.why}</span>
        </li>
        <li key={tease.id} data-tease aria-hidden="true">
          <b>{tease.label}</b>
          <span>What it takes to get this right on your page, which the audit covers in full.</span>
        </li>
        {Array.from({ length: FADED }, (_, i) => (
          <li key={i} data-fade={i + 2} aria-hidden="true">
            <b>One more thing an AI answer looks for</b>
            <span>And what it takes to get it right on your page, which the audit covers in full.</span>
          </li>
        ))}
      </ol>
      <div className={styles.previewMore}>
        <p>
          <b>And {more} more checks we take care of,</b> from AI crawlers turned away at your CDN to freshness signals,
          headings that outline the page and the alt text on every image.
        </p>
      </div>
    </div>
  )
}
