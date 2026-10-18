import type { Metadata } from 'next'
import { shareImage, site } from '@/data/site'
import { gap } from '@/lib/scan-stats'
import { jsonLd, studioNode } from '@/lib/structured-data'
import { PageMotion } from '@/components/page-motion'
import { OfferBuilder } from '@/app/tools/product-schema/offer-builder'
import { ToolBridge } from '@/app/tools/tool-bridge'
import styles from '@/app/tools/tool.module.css'

const path = '/tools/product-schema'
const sells = gap('structured')

const title = 'Free product and service schema generator'
const description = `Say what you sell in one sentence AI answers can quote, and get the matching SoftwareApplication, Service or Product structured data, free. ${sells.nonePct}% of ${sells.total} homepages we checked describe nothing they sell.`

export const metadata: Metadata = {
  title: 'Free product and service schema generator · VeraStack Labs',
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: `${site.url}${path}/`, siteName: site.name, type: 'website', images: [shareImage] },
  twitter: { card: 'summary_large_image', title, description, images: [shareImage] },
}

const questions = [
  {
    q: 'What does this generate?',
    a: 'Two things. A plain sentence for your page that says what you sell, for whom and from what price, and the structured data (SoftwareApplication, Service or Product, with your prices as offers) that labels the same facts for machines.',
  },
  {
    q: 'Will the structured data get me cited by ChatGPT?',
    a: 'Not on its own. Google says AI answers need no special markup, and a 2026 Ahrefs test found adding JSON-LD alone did not raise AI citations. The sentence on the page is what an answer can quote. The markup is good practice that keeps your prices and category unambiguous.',
  },
  {
    q: 'Should I publish my prices?',
    a: 'Price is one of the first things buyers ask an AI assistant. If you can publish a starting price, do; an answer can only repeat a number your page states.',
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
      name: 'Product and service schema generator',
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

export default function ProductSchemaPage() {
  return (
    <main id="main" className={styles.page}>
      <span id="top" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <p className={styles.label}>
        /tools/product-schema <em>{'//'}</em> free, runs in your browser
      </p>
      <h1 className={styles.title} data-m="lines">
        <span className={styles.line}>Say what you sell.</span>
        <span className={styles.line}>
          <em>In one sentence.</em>
        </span>
      </h1>
      <p className={styles.lede}>
        <b className={styles.big} data-m="count">
          {sells.nonePct}%
        </b>{' '}
        of the {sells.total} homepages we checked never describe what they sell in a form machines can read. Fill this in to get the sentence for your page and the structured data that labels it.
      </p>

      <OfferBuilder />

      <section className={styles.section} aria-labelledby="why" data-m="stagger">
        <h2 id="why" className={styles.h2}>
          Why it is worth five minutes
        </h2>
        <div className={styles.why}>
          <div>
            <b data-m="count">{sells.nonePct}%</b>
            <span>
              of {sells.total} homepages we scanned in October 2026 describe nothing they sell to machines: YC startups, SaaS, D2C stores
              and studios.
            </span>
          </div>
          <div>
            <b data-m="count">94%</b>
            <span>
              of B2B buyers use AI in their buying process, and twice as many as before call it their most important source.{' '}
              <a href="https://www.forrester.com/blogs/b2b_buyers_make_zero_click_buying_number_one/" target="_blank" rel="noopener">
                Forrester, 2026
              </a>
              .
            </span>
          </div>
          <div>
            <b data-m="count">31%</b>
            <span>
              more conversions from shoppers sent by AI assistants than from other traffic, over the 2025 holidays.{' '}
              <a href="https://www.marketingdive.com/news/ai-has-changed-holiday-shopping-heres-what-the-numbers-say/810265/" target="_blank" rel="noopener">
                Adobe via Marketing Dive
              </a>
              .
            </span>
          </div>
        </div>
      </section>

      <ToolBridge
        fixes="This fixes one of the sixteen checks"
        detail="Saying what you sell clearly is a start. Whether ChatGPT recommends you or a competitor depends on the other fifteen checks, the rest of your pages, and what review sites, directories and the press say about you. That is what our AEO and GEO audit covers, and we make the fixes."
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
