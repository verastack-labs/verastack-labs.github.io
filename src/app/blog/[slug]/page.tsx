import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { categoryById } from '@/data/blog-categories'
import { HOOK_MARKER, allPosts, formatDate, postBySlug, published, readingMinutes } from '@/lib/blog'
import { PostCheck, PostHook } from '@/app/blog/post-extras'
import { jsonLd, studioNode } from '@/lib/structured-data'
import { shareImage, site } from '@/data/site'
import { PostTitle } from '@/app/blog/post-title'
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
    // The studio name only when it still fits a results page.
    title: post.title.length <= 46 ? `${post.title} · VeraStack Labs` : post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.description, url, siteName: site.name, type: 'article', publishedTime: post.date, images: [shareImage] },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description, images: [shareImage] },
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
    datePublished: published(post),
    url: `${site.url}/blog/${post.slug}/`,
    keywords: post.tags.join(', '),
    author: { '@type': 'Person', '@id': `${site.url}/#founder`, name: site.founderName, url: `${site.url}/founder/` },
    publisher: studioNode(),
  }
  const category = categoryById(post.category)
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
        </p>
        <ul className={styles.tags} aria-label="Category and tags">
          {category && (
            <li>
              <Link className={styles.tagCat} href={`/blog/category/${category.id}`}>
                {category.name}
              </Link>
            </li>
          )}
          {/* A tag that repeats the category is dropped; each starts with a capital. */}
          {post.tags
            .filter((t) => t.toLowerCase() !== category?.name.toLowerCase())
            .map((t) => (
              <li key={t} className={styles.tag}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </li>
            ))}
        </ul>
        <p className={styles.byline}>
          by <Link href="/founder">{site.founderName}</Link>
        </p>
        <h1 className={styles.postTitle}>
          <PostTitle parts={post.titleParts} />
        </h1>
        <p className={styles.lede}>{post.description}</p>
      </header>
      {/* Our own Markdown, rendered at build time, split where the highlighted hook goes. */}
      {(() => {
        const [before, after] = splitAtHook(post.html)
        return (
          <>
            <article className={styles.prose} dangerouslySetInnerHTML={{ __html: before }} />
            {post.hook && <PostHook hook={post.hook} />}
            {after && <div className={styles.prose} dangerouslySetInnerHTML={{ __html: after }} />}
          </>
        )
      })()}
      <PostCheck compare={post.checkCompare} />
    </main>
  )
}

// Before and after the hook: at the marker if the post has one, else after the second paragraph.
function splitAtHook(html: string): [string, string] {
  const at = html.indexOf(HOOK_MARKER)
  if (at >= 0) return [html.slice(0, at), html.slice(at + HOOK_MARKER.length)]
  let end = -1
  for (let i = 0; i < 2; i++) {
    const next = html.indexOf('</p>', end + 1)
    if (next < 0) break
    end = next
  }
  return end < 0 ? [html, ''] : [html.slice(0, end + 4), html.slice(end + 4)]
}
