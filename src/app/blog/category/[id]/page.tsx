import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { categoryById } from '@/data/blog-categories'
import { shareImage, site } from '@/data/site'
import { postsIn, usedCategories } from '@/lib/blog'
import { jsonLd, studioNode } from '@/lib/structured-data'
import { CategoryBar, PostList } from '@/app/blog/post-list'
import styles from '@/app/blog/blog.module.css'

export const dynamicParams = false

export function generateStaticParams() {
  return usedCategories().map((c) => ({ id: c.id }))
}

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = categoryById((await params).id)
  if (!cat) return {}
  const title = `${cat.name}: ${cat.phrase} · VeraStack Labs blog`
  const description = `Posts from the VeraStack Labs blog on ${cat.name.toLowerCase()}: ${cat.phrase}.`
  const url = `${site.url}/blog/category/${cat.id}/`
  return {
    title,
    description,
    alternates: { canonical: `/blog/category/${cat.id}` },
    openGraph: { title, description, url, siteName: site.name, type: 'website', images: [shareImage] },
    twitter: { card: 'summary_large_image', title, description, images: [shareImage] },
  }
}

export default async function CategoryPage({ params }: Props) {
  const cat = categoryById((await params).id)
  if (!cat) notFound()
  const posts = postsIn(cat.id)
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      studioNode(),
      {
        '@type': 'CollectionPage',
        name: `${cat.name} posts`,
        url: `${site.url}/blog/category/${cat.id}/`,
        isPartOf: { '@type': 'Blog', name: `${site.name} blog`, url: `${site.url}/blog/` },
        hasPart: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${site.url}/blog/${p.slug}/`, datePublished: p.date })),
      },
    ],
  }
  return (
    <main id="main" className={styles.page}>
      <span id="top" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <p className={styles.label}>
        /blog/{cat.id} <em>{'//'}</em> {cat.phrase}
      </p>
      <h1 className={styles.indexTitle}>{cat.name}.</h1>
      <CategoryBar current={cat.id} />
      <PostList posts={posts} />
    </main>
  )
}
