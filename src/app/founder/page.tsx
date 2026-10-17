import type { Metadata } from 'next'
import { founder, founderQuestions, pressOutlets } from '@/data/founder'
import { booking, shareImage, site } from '@/data/site'
import { jsonLd, studioNode } from '@/lib/structured-data'
import styles from '@/app/founder/founder.module.css'

export const metadata: Metadata = {
  title: `${founder.title} · VeraStack Labs`,
  description: founder.description,
  alternates: { canonical: founder.path },
  openGraph: { title: founder.title, description: founder.description, url: `${site.url}${founder.path}/`, siteName: site.name, type: 'profile', images: [shareImage] },
  twitter: { card: 'summary_large_image', title: founder.title, description: founder.description, images: [shareImage] },
}

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    studioNode(),
    {
      '@type': 'Person',
      '@id': `${site.url}/#founder`,
      name: site.founderName,
      url: `${site.url}${founder.path}/`,
      image: `${site.url}${founder.photo.src}`,
      jobTitle: 'Founder',
      worksFor: { '@id': `${site.url}/#organization` },
      sameAs: founder.sameAs,
    },
    {
      '@type': 'ItemList',
      name: 'Launches by the founder',
      itemListElement: founder.rail
        .filter((r) => !r.you)
        .map((r, i) => ({ '@type': 'ListItem', position: i + 1, name: r.name, description: r.line })),
    },
    {
      '@type': 'FAQPage',
      mainEntity: founderQuestions.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
}

export default function FounderPage() {
  return (
    <main id="main" className={styles.page}>
      <span id="top" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />

      <p className={styles.label} data-reveal>
        /founder <em>{'//'}</em> a note before you book
      </p>

      <section className={styles.intro} data-reveal>
        <div className={styles.letter}>
          <h1 className={styles.title}>
            Hi, I&apos;m <em>Rigan</em>.
          </h1>
          <p className={styles.byline}>
            <b>{site.founderName}</b> · founder, {site.name}
          </p>
          {founder.letter.map((para) => (
            <p key={para.slice(0, 24)} className={styles.para}>
              {para}
            </p>
          ))}
          <p className={styles.signature} aria-hidden="true">
            Rigan
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimiser */}
        <img
          className={styles.photo}
          src={founder.photo.src}
          width={founder.photo.width}
          height={founder.photo.height}
          alt={founder.photo.alt}
          fetchPriority="high"
        />
      </section>

      <section className={styles.proof} aria-labelledby="proof-title" data-reveal>
        <h2 id="proof-title" className="sr-only">
          The numbers
        </h2>
        <ul className={styles.cards}>
          {founder.metrics.map((m) => (
            <li key={m.value} className={styles.card}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </li>
          ))}
        </ul>
        <p className={styles.press}>
          <span>As covered by</span>{' '}
          {pressOutlets().map((p, i) => (
            <span key={p.outlet}>
              {i > 0 && ' · '}
              <a href={p.url} target="_blank" rel="noopener">
                {p.outlet}
              </a>
            </span>
          ))}
        </p>
      </section>

      <section className={styles.section} aria-labelledby="rail-title" data-reveal>
        <h2 id="rail-title" className={styles.h2}>
          The launches so far
        </h2>
        <ol className={styles.rail}>
          {founder.rail.map((r) => (
            <li key={r.name} className={styles.stop} data-you={r.you ? 'true' : undefined}>
              <b>{r.name}</b>
              <span>{r.line}</span>
              {r.detail && <p>{r.detail}</p>}
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section} aria-labelledby="questions-title" data-reveal>
        <h2 id="questions-title" className={styles.h2}>
          Questions
        </h2>
        <dl className={styles.faq}>
          {founderQuestions.map((f) => (
            <div key={f.q}>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className={styles.ctas} data-reveal>
        <a className={styles.cta} href={booking.href} {...(booking.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
          Book a 30-min call
        </a>
        <a className={styles.ghost} href={site.founderUrl} target="_blank" rel="noopener">
          Founder&apos;s portfolio ↗
        </a>
      </div>
    </main>
  )
}
