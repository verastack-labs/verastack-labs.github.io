import Link from 'next/link'
import type { Metadata } from 'next'
import { shareImage, site } from '@/data/site'
import { gap } from '@/lib/scan-stats'
import { jsonLd, studioNode } from '@/lib/structured-data'
import { PageMotion } from '@/components/page-motion'
import { FaqBuilder } from '@/app/tools/faq-schema/faq-builder'
import { ToolBridge } from '@/app/tools/tool-bridge'
import styles from '@/app/tools/tool.module.css'

const path = '/tools/faq-schema'
const faq = gap('faq')

const title = 'Free FAQ schema generator: answer what buyers ask'
const description = `Write the questions buyers ask and get FAQPage structured data plus matching HTML, free. ${faq.nonePct}% of the ${faq.total} homepages we checked have none.`

export const metadata: Metadata = {
  title: 'Free FAQ schema generator · VeraStack Labs',
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: `${site.url}${path}/`, siteName: site.name, type: 'website', images: [shareImage] },
  twitter: { card: 'summary_large_image', title, description, images: [shareImage] },
}

const questions = [
  {
    q: 'What is FAQ schema?',
    a: 'FAQPage structured data: a few lines of JSON-LD that label each question and its answer on your page, so search engines and AI answers can read them as pairs instead of guessing.',
  },
  {
    q: 'Will FAQ schema get me cited by ChatGPT?',
    a: 'Not on its own, and we would rather say so. Google says AI answers need no special structured data, and a 2026 Ahrefs test of 1,885 pages found adding JSON-LD alone did not raise AI citations. What helps is the answers themselves: plain, specific replies to the questions buyers ask, on the page. The markup is good practice that labels those answers clearly and matches what Google expects, so write the answers first and add it in a minute.',
  },
  {
    q: 'Where do I put the code?',
    a: 'Paste the structured data into the page, in the head or the body, and put the same questions and answers on the page where visitors can read them. Marking up answers that are not visible goes against Google’s guidelines.',
  },
  {
    q: 'How many questions should I add?',
    a: 'Five to ten real questions buyers ask: price, who it is for, how it compares, how long it takes, what happens if it goes wrong. Keep each answer to one or two plain sentences.',
  },
  {
    q: 'Is this tool free?',
    a: 'Yes, with no sign-up. It runs in your browser and nothing you type is sent to us.',
  },
]

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    studioNode(),
    {
      '@type': 'WebApplication',
      name: 'FAQ schema generator',
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

export default function FaqSchemaPage() {
  return (
    <main id="main" className={styles.page}>
      <span id="top" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <p className={styles.label}>
        /tools/faq-schema <em>{'//'}</em> free, runs in your browser
      </p>
      <h1 className={styles.title} data-m="lines">
        <span className={styles.line}>Answer what</span>
        <span className={styles.line}>
          <em>buyers ask.</em>
        </span>
      </h1>
      <p className={styles.lede}>
        <b className={styles.big} data-m="count">
          {faq.nonePct}%
        </b>{' '}
        of the {faq.total} homepages we checked have no FAQ on the homepage. Write the answers to what your buyers ask here and
        get the HTML to show them, plus the structured data that labels them. Free, no sign-up.
      </p>

      <FaqBuilder />

      <section className={styles.section} aria-labelledby="why" data-m="stagger">
        <h2 id="why" className={styles.h2}>
          Why it is worth ten minutes
        </h2>
        <div className={styles.why}>
          <div>
            <b data-m="count">{faq.nonePct}%</b>
            <span>
              of {faq.total} homepages we scanned in October 2026 have no FAQ on the homepage: YC startups, SaaS, D2C stores, even software
              studios.
            </span>
          </div>
          <div>
            <b>21 of 25</b>
            <span>
              software studios, who build websites for a living, had none. <Link href="/blog/ai-search-software-studios">The study</Link>.
            </span>
          </div>
          <div>
            <b>8% vs 15%</b>
            <span>
              People clicked a normal search result on 8% of visits when Google showed an AI summary, and on 15% when it did not.{' '}
              <a href="https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/" target="_blank" rel="noopener">
                Pew Research, 2025
              </a>
              . The answer is the new front page.
            </span>
          </div>
        </div>
      </section>

      <ToolBridge
        fixes="This fixes one of the sixteen checks"
        detail="An FAQ answers what buyers ask, in words any reader, or crawler, can find. Whether ChatGPT names you over a competitor also depends on the other fifteen checks, the rest of your pages and what other sites say about you. That is what our AEO and GEO audit covers, and we make the fixes."
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
