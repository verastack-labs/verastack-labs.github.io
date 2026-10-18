import { checks } from '@/data/ai-search-check'
import styles from '@/app/tools/ai-search-check/checker.module.css'

// Three in full, then three blurred rows that hold no real text.
const FULL = 3
const FADED = 3

// What the check looks at: a taste, not the playbook. Only the first few checks reach the page
// (this renders on the server, so the rest are not in the HTML or the JavaScript either); the full
// list, with what each found and how to fix it, is what the audit sells.
export function ChecksPreview() {
  const more = checks.length - FULL
  return (
    <div className={styles.preview}>
      <ol className={styles.explain}>
        {checks.slice(0, FULL).map((c) => (
          <li key={c.id}>
            <b>{c.label}</b>
            <span>{c.why}</span>
          </li>
        ))}
        {Array.from({ length: FADED }, (_, i) => (
          <li key={i} data-fade={i + 1} aria-hidden="true">
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
