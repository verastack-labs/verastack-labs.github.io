import Link from 'next/link'
import type { Metadata } from 'next'
import { checker, faqs } from '@/data/ai-search-check'
import { shareImage, site } from '@/data/site'
import { jsonLd, studioNode } from '@/lib/structured-data'
import { Checker } from '@/app/tools/ai-search-check/checker'
import { ChecksPreview } from '@/app/tools/ai-search-check/checks-preview'
import styles from '@/app/tools/ai-search-check/checker.module.css'

export const metadata: Metadata = {
  // Short enough for results pages; the share card keeps the full question.
  title: 'Free AEO and GEO check · VeraStack Labs',
  description: checker.description,
  alternates: { canonical: checker.path },
  openGraph: { title: checker.title, description: checker.description, url: `${site.url}${checker.path}/`, siteName: site.name, type: 'website', images: [shareImage] },
  twitter: { card: 'summary_large_image', title: checker.title, description: checker.description, images: [shareImage] },
}

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    studioNode(),
    {
      '@type': 'WebApplication',
      name: 'AI search check (AEO and GEO)',
      url: `${site.url}${checker.path}/`,
      description: checker.description,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Any (web browser)',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      provider: { '@id': `${site.url}/#organization` },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
}

export default function AiSearchCheckPage() {
  return (
    <main id="main" className={styles.page}>
      <span id="top" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <p className={styles.label}>
        /tools/ai-search-check <em>{'//'}</em> AEO + GEO, free, no sign-up
      </p>
      <h1 className={styles.title}>Does ChatGPT know your site?</h1>
      <p className={styles.lede}>
        A free AEO and GEO check: see how a page reads to ChatGPT, Perplexity, Claude and Google&apos;s AI answers. Sixteen checks, a
        score out of 100 and the three fixes that matter most.
      </p>

      <Checker />

      <section className={styles.section} aria-labelledby="what-we-check" data-reveal>
        <h2 id="what-we-check" className={styles.h2}>
          What the check looks at
        </h2>
        <ChecksPreview />
        <p className={styles.more}>
          Why these matter, in more depth: <Link href="/blog/ai-search-for-saas">what ChatGPT reads before it recommends you</Link>.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="questions" data-reveal>
        <h2 id="questions" className={styles.h2}>
          Questions
        </h2>
        <dl className={styles.faq}>
          {faqs.map((f) => (
            <div key={f.q}>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  )
}
