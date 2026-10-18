import Link from 'next/link'
import type { Metadata } from 'next'
import { tools, toolsPage } from '@/data/tools'
import { shareImage, site } from '@/data/site'
import { jsonLd, studioNode } from '@/lib/structured-data'
import styles from '@/app/tools/tools.module.css'

export const metadata: Metadata = {
  title: 'Free tools · VeraStack Labs',
  description: toolsPage.description,
  alternates: { canonical: toolsPage.path },
  openGraph: { title: toolsPage.title, description: toolsPage.description, url: `${site.url}${toolsPage.path}/`, siteName: site.name, type: 'website', images: [shareImage] },
  twitter: { card: 'summary_large_image', title: toolsPage.title, description: toolsPage.description, images: [shareImage] },
}

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    studioNode(),
    {
      '@type': 'ItemList',
      name: toolsPage.title,
      itemListElement: tools.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, description: t.line, url: `${site.url}${t.href}/` })),
    },
  ],
}

export default function ToolsPage() {
  return (
    <main id="main" className={styles.page}>
      <span id="top" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <p className={styles.label}>
        /tools <em>{'//'}</em> free, no sign-up
      </p>
      <h1 className={styles.title}>
        Free tools for <em>launch day.</em>
      </h1>
      <p className={styles.lede}>Small, honest tools we built for our own launches, open to every founder.</p>
      <ul className={styles.list}>
        {tools.map((t, i) => (
          <li key={t.slug}>
            <Link className={styles.card} href={t.href}>
              <span className={styles.n}>
                {String(i + 1).padStart(2, '0')} / {t.tag}
              </span>
              <b>{t.name}</b>
              <span className={styles.line}>{t.line}</span>
              <span className={styles.go}>Open the tool →</span>
            </Link>
          </li>
        ))}
        <li className={styles.soon}>
          <span className={styles.n}>next</span>
          <b>More on the way</b>
          <span className={styles.line}>
            Want a tool for your launch? <Link href="/#contact">Tell us</Link>, or see the{' '}
            <Link href="/launch-kit">SaaS Launch Kit</Link> if you would rather we did the whole launch.
          </span>
        </li>
      </ul>
    </main>
  )
}
