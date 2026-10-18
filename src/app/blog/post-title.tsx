import type { TitlePart } from '@/lib/blog'
import styles from '@/app/blog/blog.module.css'

// A post title with its highlighted words in signal green.
export function PostTitle({ parts }: { parts: TitlePart[] }) {
  return (
    <>
      {parts.map((p, i) =>
        p.hi ? (
          <em key={i} className={styles.hi}>
            {p.text}
          </em>
        ) : (
          p.text
        ),
      )}
    </>
  )
}
