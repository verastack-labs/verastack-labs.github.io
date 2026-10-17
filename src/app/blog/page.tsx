import Link from 'next/link'
import type { Metadata } from 'next'
import { allPosts, formatDate, readingMinutes } from '@/lib/blog'
import { site } from '@/data/site'
import styles from '@/app/blog/blog.module.css'

const title = 'Blog · VeraStack Labs'
const description = 'Notes on SaaS launches, AI search, open source and building for the web, from the studio that builds them.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/blog' },
  openGraph: { title, description, url: `${site.url}/blog/`, siteName: site.name, type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

export default function BlogIndex() {
  const posts = allPosts()
  return (
    <main id="main" className={styles.page}>
      <span id="top" />
      <p className={styles.label}>
        /blog <em>{'//'}</em> launches, AI search, open source
      </p>
      <h1 className={styles.indexTitle}>Notes from the studio.</h1>
      <ul className={styles.list}>
        {posts.map((p) => (
          <li key={p.slug}>
            <Link className={styles.item} href={`/blog/${p.slug}`}>
              <span className={styles.itemMeta}>
                {formatDate(p.date)} · {readingMinutes(p.words)} min read
              </span>
              <b>{p.title}</b>
              <span className={styles.itemDesc}>{p.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
