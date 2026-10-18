import type { Metadata } from 'next'
import { shareImage, site } from '@/data/site'
import { gap } from '@/lib/scan-stats'
import { jsonLd, studioNode } from '@/lib/structured-data'
import { PageMotion } from '@/components/page-motion'
import { OrgBuilder } from '@/app/tools/organization-schema/org-builder'
import { ToolBridge } from '@/app/tools/tool-bridge'
import styles from '@/app/tools/tool.module.css'

const path = '/tools/organization-schema'
const identity = gap('identity')

const title = 'Free Organization schema generator: say who you are'
const description = `Write the line that says who your company is and link your real profiles, then copy the Organization structured data. Free. ${identity.notPassingPct}% of ${identity.total} homepages we checked have it missing or unlinked.`

export const metadata: Metadata = {
  title: 'Free Organization schema generator · VeraStack Labs',
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: `${site.url}${path}/`, siteName: site.name, type: 'website', images: [shareImage] },
  twitter: { card: 'summary_large_image', title, description, images: [shareImage] },
}

const questions = [
  {
    q: 'What is Organization schema?',
    a: 'A few lines of JSON-LD on your homepage that state your company’s name, website, logo and the other profiles that belong to it (the sameAs links), so search engines can connect them.',
  },
  {
    q: 'Why do the profile links matter?',
    a: 'Many company names are shared. Links from your site to your LinkedIn, X, GitHub or Crunchbase pages, and back, help an engine work out which of several companies with your name a page is about.',
  },
  {
    q: 'Will this get me cited by ChatGPT?',
    a: 'Not on its own. Google says AI answers need no special markup, and a 2026 Ahrefs test found adding JSON-LD alone did not raise AI citations. It is good practice that keeps the facts about your company unambiguous. Say who you are in plain words on the page too.',
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
      name: 'Organization schema generator',
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

export default function OrganizationSchemaPage() {
  return (
    <main id="main" className={styles.page}>
      <span id="top" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <p className={styles.label}>
        /tools/organization-schema <em>{'//'}</em> free, runs in your browser
      </p>
      <h1 className={styles.title} data-m="lines">
        <span className={styles.line}>Say who you are.</span>
        <span className={styles.line}>
          <em>Not a namesake.</em>
        </span>
      </h1>
      <p className={styles.lede}>
        <b className={styles.big} data-m="count">
          {identity.notPassingPct}%
        </b>{' '}
        of the {identity.total} homepages we checked have no Organization data, or have it without links to their other profiles
        ({identity.nonePct}% have none at all). Fill this in for the line that says who you are and the structured data that ties your
        accounts together.
      </p>

      <OrgBuilder />

      <section className={styles.section} aria-labelledby="why" data-m="stagger">
        <h2 id="why" className={styles.h2}>
          Why it is worth five minutes
        </h2>
        <div className={styles.why}>
          <div>
            <b data-m="count">{identity.notPassingPct}%</b>
            <span>
              of {identity.total} homepages we scanned in October 2026 leave engines guessing who is behind them: YC startups, SaaS, D2C
              stores and studios.
            </span>
          </div>
          <div>
            <b data-m="count">2.5B</b>
            <span>
              people a month use Google&apos;s AI Overviews.{' '}
              <a href="https://blog.google/innovation-and-ai/sundar-pichai-io-2026/" target="_blank" rel="noopener">
                Google, May 2026
              </a>
              . An answer about your company is only as clear as what it can tell apart.
            </span>
          </div>
          <div>
            <b data-m="count">94%</b>
            <span>
              of B2B buyers use AI in their buying process.{' '}
              <a href="https://www.forrester.com/blogs/b2b_buyers_make_zero_click_buying_number_one/" target="_blank" rel="noopener">
                Forrester, 2026
              </a>
              . Make sure the company they read about is you.
            </span>
          </div>
        </div>
      </section>

      <ToolBridge
        fixes="This fixes one of the sixteen checks"
        detail="Saying who you are is the foundation. Whether ChatGPT recommends you over a competitor depends on the other fifteen checks, your other pages and what review sites, directories and the press say about you. That is what our AEO and GEO audit covers, and we make the fixes."
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
