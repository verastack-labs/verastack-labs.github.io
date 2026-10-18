import type { Metadata } from 'next'
import { allPosts } from '@/lib/blog'
import { CategoryBar, PostList } from '@/app/blog/post-list'
import { shareImage, site } from '@/data/site'
import { jsonLd, studioNode } from '@/lib/structured-data'
import styles from '@/app/blog/blog.module.css'

const title = 'Blog · VeraStack Labs'
const description = 'Notes on SaaS launches, AI search, open source and building for the web, from the studio that builds them.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/blog' },
  openGraph: { title, description, url: `${site.url}/blog/`, siteName: site.name, type: 'website', images: [shareImage] },
  twitter: { card: 'summary_large_image', title, description, images: [shareImage] },
}

export default function BlogIndex() {
  const posts = allPosts()
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      studioNode(),
      {
        '@type': 'Blog',
        name: `${site.name} blog`,
        url: `${site.url}/blog/`,
        publisher: { '@id': `${site.url}/#organization` },
        blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${site.url}/blog/${p.slug}/`, datePublished: p.date })),
      },
    ],
  }
  return (
    <main id="main" className={styles.page}>
      <span id="top" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <p className={styles.label}>
        /blog <em>{'//'}</em> launches, AI search, open source
      </p>
      <h1 className={styles.indexTitle}>
        Notes from the <span className={styles.hi}>studio.</span>
      </h1>
      <CategoryBar />
      <PostList posts={posts} />
    </main>
  )
}
