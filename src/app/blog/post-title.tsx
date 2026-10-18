import type { TitlePart } from '@/lib/blog'
import styles from '@/app/blog/blog.module.css'

// A post title with its highlighted words in signal green.
export function PostTitle({ parts }: { parts: TitlePart[] }) {
  return (
    <>
      {parts.map((p, i) =>
        p.hi ? (
          <span key={i} className={styles.hi}>
            {p.text}
          </span>
        ) : (
          p.text
        ),
      )}
    </>
  )
}
