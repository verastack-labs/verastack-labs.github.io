import Link from 'next/link'
import { categoryById } from '@/data/blog-categories'
import { formatDate, readingMinutes, type Post, usedCategories } from '@/lib/blog'
import { PostTitle } from '@/app/blog/post-title'
import styles from '@/app/blog/blog.module.css'

// The category chips: All, then each category with posts, its count and its short phrase.
export function CategoryBar({ current }: { current?: string }) {
  const cats = usedCategories()
  return (
    <nav className={styles.cats} aria-label="Blog categories">
      <Link href="/blog" className={styles.cat} aria-current={current ? undefined : 'page'}>
        <b>All</b>
      </Link>
      {cats.map((c) => (
        <Link key={c.id} href={`/blog/category/${c.id}`} className={styles.cat} aria-current={current === c.id ? 'page' : undefined}>
          <b>
            {c.name} <span className={styles.count}>{c.count}</span>
          </b>
          <span className={styles.phrase}>{c.phrase}</span>
        </Link>
      ))}
    </nav>
  )
}

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className={styles.list}>
      {posts.map((p) => (
        <li key={p.slug}>
          <Link className={styles.item} href={`/blog/${p.slug}`}>
            <span className={styles.itemMeta}>
              {categoryById(p.category)?.name} · {formatDate(p.date)} · {readingMinutes(p.words)} min read
            </span>
            <b>
              <PostTitle parts={p.titleParts} />
            </b>
            <span className={styles.itemDesc}>{p.description}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
