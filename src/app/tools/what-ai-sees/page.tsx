import type { Metadata } from 'next'
import { shareImage, site } from '@/data/site'
import { gap } from '@/lib/scan-stats'
import { jsonLd, studioNode } from '@/lib/structured-data'
import { PageMotion } from '@/components/page-motion'
import { Viewer } from '@/app/tools/what-ai-sees/viewer'
import { ToolBridge } from '@/app/tools/tool-bridge'
import styles from '@/app/tools/tool.module.css'

const path = '/tools/what-ai-sees'
const text = gap('text')

const title = 'What ChatGPT sees: your page without JavaScript'
const description = `See your page the way AI crawlers read it, with no JavaScript run. Free. ${text.notPassingPct}% of ${text.total} homepages we checked send under 500 words.`

export const metadata: Metadata = {
  title: 'What ChatGPT sees on your page · VeraStack Labs',
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: `${site.url}${path}/`, siteName: site.name, type: 'website', images: [shareImage] },
  twitter: { card: 'summary_large_image', title, description, images: [shareImage] },
}

const questions = [
  {
    q: 'Why would ChatGPT see a different page from my visitors?',
    a: 'Browsers run your JavaScript; most AI crawlers do not. Vercel’s study of its network found none of the major AI crawlers rendered JavaScript, including OpenAI’s and Anthropic’s (December 2024). If your words are drawn by JavaScript, those crawlers get the empty shell.',
  },
  {
    q: 'Does Google see it the same way?',
    a: 'No. Googlebot runs JavaScript, and Gemini uses Google’s crawling. ChatGPT, Claude and Perplexity are the ones that read the raw HTML.',
  },
  {
    q: 'How do I fix a blank page?',
    a: 'Send the words in the HTML: render the page on the server or as static HTML (Next.js, Astro, Framer and Webflow all can), and put one plain paragraph near the top that says what you do, for whom and from what price.',
  },
  {
    q: 'Is this tool free?',
    a: 'Yes, with no sign-up. We fetch the one page you enter, keep the result for ten minutes and store nothing else.',
  },
]

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    studioNode(),
    {
      '@type': 'WebApplication',
      name: 'What ChatGPT sees',
      url: `${site.url}${path}/`,
      description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any (web browser)',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      provider: { '@id': `${site.url}/#organization` },
    },
    { '@type': 'FAQPage', mainEntity: questions.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ],
}

export default function WhatAiSeesPage() {
  return (
    <main id="main" className={styles.page}>
      <span id="top" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <p className={styles.label}>
        /tools/what-ai-sees <em>{'//'}</em> free, one page at a time
      </p>
      <h1 className={styles.title} data-m="lines">
        <span className={styles.line}>See your page</span>
        <span className={styles.line}>
          <em>the way ChatGPT does.</em>
        </span>
      </h1>
      <p className={styles.lede}>
        <b className={styles.big} data-m="count">
          {text.notPassingPct}%
        </b>{' '}
        of the {text.total} homepages we checked send fewer than 500 words before JavaScript runs, and {text.nonePct}% fewer than 200.
        Most AI crawlers never run it. Enter a page to see exactly what they get.
      </p>

      <Viewer />

      <section className={styles.section} aria-labelledby="why" data-m="stagger">
        <h2 id="why" className={styles.h2}>
          Why it matters
        </h2>
        <div className={styles.why}>
          <div>
            <b>0</b>
            <span>
              of the major AI crawlers rendered JavaScript in{' '}
              <a href="https://vercel.com/blog/the-rise-of-the-ai-crawler" target="_blank" rel="noopener">
                Vercel&apos;s study
              </a>{' '}
              (2024), OpenAI&apos;s and Anthropic&apos;s included.
            </span>
          </div>
          <div>
            <b data-m="count">900M</b>
            <span>
              people use ChatGPT every week.{' '}
              <a href="https://techcrunch.com/2026/02/27/chatgpt-reaches-900m-weekly-active-users" target="_blank" rel="noopener">
                OpenAI via TechCrunch, 2026
              </a>
              . Its crawler reads the raw HTML.
            </span>
          </div>
          <div>
            <b data-m="count">{text.nonePct}%</b>
            <span>
              of {text.total} homepages we scanned send under 200 words: close to blank for an AI answer, however good they look.
            </span>
          </div>
        </div>
      </section>

      <ToolBridge
        fixes="This shows one of the sixteen checks"
        detail="A readable page is where AI search starts. Whether ChatGPT names you over a competitor depends on the other fifteen checks, your other pages and what other sites say about you. That is what our AEO and GEO audit covers, and we make the fixes, including moving a JavaScript-only site to one that renders on the server."
      />

      <section className={styles.section} aria-labelledby="questions">
        <h2 id="questions" className={styles.h2}>
          Questions
        </h2>
        <div className={styles.faq} data-m="stagger">
          {questions.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
      <PageMotion />
    </main>
  )
}
