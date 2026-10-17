import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { allPosts, formatDate, postBySlug, readingMinutes } from '@/lib/blog'
import { jsonLd } from '@/lib/structured-data'
import { site } from '@/data/site'
import styles from '@/app/blog/blog.module.css'

export const dynamicParams = false

export function generateStaticParams() {
  return allPosts().map((p) => ({ slug: p.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = postBySlug((await params).slug)
  if (!post) return {}
  const url = `${site.url}/blog/${post.slug}/`
  return {
    title: `${post.title} · VeraStack Labs`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.description, url, siteName: site.name, type: 'article', publishedTime: post.date },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
  }
}

export default async function PostPage({ params }: Props) {
  const post = postBySlug((await params).slug)
  if (!post) notFound()
  const article = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `${site.url}/blog/${post.slug}/`,
    keywords: post.tags.join(', '),
    author: { '@type': 'Organization', name: site.name, url: `${site.url}/` },
    publisher: { '@type': 'Organization', name: site.name, url: `${site.url}/`, logo: `${site.url}/icon.svg` },
  }
  return (
    <main id="main" className={styles.page}>
      <span id="top" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(article) }} />
      <Link className={styles.back} href="/blog">
        ← all notes
      </Link>
      <header className={styles.postHead}>
        <p className={styles.itemMeta}>
          {formatDate(post.date)} · {readingMinutes(post.words)} min read
          {post.tags.length > 0 && <> · {post.tags.join(' · ')}</>}
        </p>
        <h1 className={styles.postTitle}>{post.title}</h1>
        <p className={styles.lede}>{post.description}</p>
      </header>
      {/* Our own Markdown, rendered at build time. */}
      <article className={styles.prose} dangerouslySetInnerHTML={{ __html: post.html }} />
    </main>
  )
}
