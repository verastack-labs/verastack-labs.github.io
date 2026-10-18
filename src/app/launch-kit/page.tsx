import Link from 'next/link'
import type { Metadata } from 'next'
import { discounted, kitIncluded, kitParts, kitProof, kitQuestions, kitWeeks, launchKit, siteKit, usd, yearEnd, yearEndActive } from '@/data/launch-kit'
import { shareImage, site } from '@/data/site'
import { jsonLd, studioNode } from '@/lib/structured-data'
import { IndiaBlock, IndiaChip, KitBar } from '@/app/launch-kit/india-pricing'
import { PageMotion } from '@/components/page-motion'
import styles from '@/app/launch-kit/launch-kit.module.css'

export const metadata: Metadata = {
  title: 'SaaS Launch Kit: launch-ready in 4 weeks · VeraStack Labs',
  description: launchKit.description,
  alternates: { canonical: launchKit.path },
  openGraph: { title: launchKit.title, description: launchKit.description, url: `${site.url}${launchKit.path}/`, siteName: site.name, type: 'website', images: [shareImage] },
  twitter: { card: 'summary_large_image', title: launchKit.title, description: launchKit.description, images: [shareImage] },
}

const sale = yearEndActive()

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    studioNode(),
    {
      '@type': 'Service',
      name: 'SaaS Launch Kit',
      url: `${site.url}${launchKit.path}/`,
      description: launchKit.description,
      serviceType: 'Product launch: brand, website, launch film, AEO and GEO',
      provider: { '@id': `${site.url}/#organization` },
      offers: [
        { '@type': 'Offer', name: 'Launch Kit', price: String(sale ? discounted(launchKit.price) : launchKit.price), priceCurrency: 'USD', url: `${site.url}${launchKit.path}/`, ...(sale ? { priceValidUntil: yearEnd.until } : {}) },
        { '@type': 'Offer', name: siteKit.name, price: String(sale ? discounted(siteKit.price) : siteKit.price), priceCurrency: 'USD', url: `${site.url}${launchKit.path}/`, ...(sale ? { priceValidUntil: yearEnd.until } : {}) },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: kitQuestions.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
}

const callHref = site.calLink ?? '/#contact'

export default function LaunchKitPage() {
  return (
    <main id="main" className={styles.page}>
      <span id="top" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />

      <div className={styles.layout}>
        <div className={styles.main}>
          <p className={styles.label}>
            /launch-kit <em>{'//'}</em> for SaaS founders
          </p>
          <h1 className={styles.title} data-m="lines">
            <span className={styles.line}>Launch-ready</span>
            <span className={styles.line}>
              in <em>4 weeks.</em>
            </span>
          </h1>
          <p className={styles.lede}>
            <b>Brand, launch site, launch film,</b> and built to be found by ChatGPT from day one. One team, one fixed fee.
          </p>
          <IndiaChip />

          <section className={styles.block} aria-labelledby="kit-parts" data-m="stagger">
            <h2 id="kit-parts" className={styles.h2}>
              What you get
            </h2>
            {kitParts.map((p) => (
              <div key={p.tag} className={styles.item}>
                <span>{p.tag}</span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </div>
            ))}
            <p className={styles.addons}>
              <b>Add-ons, quoted separately:</b> web and mobile app builds, 3D and configurators.
            </p>
          </section>

          <section className={styles.block} aria-labelledby="kit-weeks">
            <h2 id="kit-weeks" className={styles.h2}>
              Four weeks
            </h2>
            <ol className={styles.weeks} data-m="bar">
              {kitWeeks.map((w) => (
                <li key={w.week}>
                  <span>{w.week}</span>
                  <b>{w.title}</b>
                  <p>{w.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className={`${styles.block} ${styles.late}`} aria-label="The late-week guarantee">
            <p className={styles.lateBig} data-m="words">
              Late? <em>10% back</em> for every week we slip.
            </p>
            <div>
              <p>Up to 30% of the fee. The clock only pauses while we wait on your feedback.</p>
              <p>
                <b>And at handoff you own all of it:</b> the code, the repo, the docs and the film&apos;s source files. No docs and code you
                can&apos;t change are founders&apos; top two complaints about agencies; you get neither.
              </p>
            </div>
          </section>

          <section className={styles.block} aria-labelledby="kit-score">
            <h2 id="kit-score" className={styles.h2}>
              The score, before and after
            </h2>
            <p className={styles.ba}>
              <span data-tone="before" data-m="count">
                66
              </span>
              <span aria-hidden="true">→</span>
              <span data-tone="after" data-m="count">
                90+
              </span>
            </p>
            <p className={styles.note}>
              66 is the median{' '}
              <Link href="/blog/yc-summer-2026-ai-search">YC Summer 2026 homepage</Link> on our{' '}
              <Link href="/tools/ai-search-check">AEO and GEO check</Link>. Every kit launches at 90 or more.
            </p>
          </section>

          <section className={styles.block} aria-labelledby="kit-proof">
            <h2 id="kit-proof" className={styles.h2}>
              Proof, not promises
            </h2>
            <div className={styles.proof} data-m="stagger">
              {kitProof.map((p) => {
                const body = (
                  <>
                    <span className={styles.proofN} data-signal={p.signal} data-m="count">
                      {p.n}
                    </span>
                    <b>{p.title}</b>
                    <span className={styles.proofText}>{p.text}</span>
                  </>
                )
                return p.href ? (
                  <Link key={p.title} className={styles.proofCard} href={p.href} data-tilt>
                    {body}
                  </Link>
                ) : (
                  <div key={p.title} className={styles.proofCard} data-tilt>
                    {body}
                  </div>
                )
              })}
            </div>
          </section>

          <section className={styles.block} aria-labelledby="kit-questions">
            <h2 id="kit-questions" className={styles.h2}>
              Questions
            </h2>
            <div className={styles.faq} data-m="stagger">
              {kitQuestions.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className={styles.aside} id="pricing" aria-label="Price" data-m="slide">
          <div className={styles.card}>
            <p className={styles.tag}>the launch kit, fixed price</p>
            {sale && <p className={styles.sale}>{yearEnd.label}</p>}
            <p className={styles.amount} data-m="count">
              {usd(sale ? discounted(launchKit.price) : launchKit.price)}
            </p>
            {sale && <p className={styles.was}>was {launchKit.priceLabel}</p>}
            <p className={styles.terms}>Half now, half at launch.</p>
            <p className={styles.slots}>{launchKit.slots}</p>
            <IndiaBlock />
            <ul className={styles.included} data-m="stagger">
              {kitIncluded.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <a className={styles.cta} href={callHref} target="_blank" rel="noopener">
              Book a launch slot
            </a>
            <p className={styles.guarantee}>
              <b>Late?</b> 10% back for every week we slip, up to 30%.
            </p>
          </div>
          <div className={styles.plan}>
            <p className={styles.tag}>smaller kit</p>
            <p>
              <b>
                {siteKit.name}: {usd(sale ? discounted(siteKit.price) : siteKit.price)}
              </b>
              {sale && <s className={styles.wasInline}> {usd(siteKit.price)}</s>}, {siteKit.weeks}. {siteKit.includes.join(', ')}. {siteKit.note}
            </p>
          </div>
          <div className={styles.plan}>
            <p className={styles.tag}>after launch, optional</p>
            <p>
              <b>{launchKit.monthly}/mo</b>, 3-month minimum, then pause any time. Site changes and new pages, monthly AEO and GEO
              tracking, two short clips a month.
            </p>
          </div>
        </aside>
      </div>
      <KitBar />
      <PageMotion />
    </main>
  )
}
