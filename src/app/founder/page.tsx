import type { Metadata } from 'next'
import { founder, founderQuestions, pressOutlets } from '@/data/founder'
import { booking, shareImage, site } from '@/data/site'
import { jsonLd, studioNode } from '@/lib/structured-data'
import { PageMotion } from '@/components/page-motion'
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
      '@type': 'VideoObject',
      name: `${site.founderName}, founder of ${site.name}`,
      description: 'A 51-second film about the founder: launch work, numbers from client projects, and the products the studio makes.',
      thumbnailUrl: `${site.url}/founder/founder-film-poster.jpg`,
      contentUrl: `${site.url}/founder/founder-film.mp4`,
      uploadDate: '2026-10-19',
      duration: 'PT51S',
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
          <h1 className={styles.title} data-m="lines">
            <span className={styles.line}>Hi, I&apos;m <em>Rigan</em>.</span>
          </h1>
          <p className={styles.byline}>
            <b>{site.founderName}</b> · founder, {site.name}
          </p>
          {founder.letter.map((para) => (
            <p key={para.slice(0, 24)} className={styles.para}>
              {para}
            </p>
          ))}
          <p className={styles.signature} aria-hidden="true" data-m="wipe">
            Rigan
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimiser */}
        <img
          data-m="mask"
          className={styles.photo}
          src={founder.photo.src}
          width={founder.photo.width}
          height={founder.photo.height}
          alt={founder.photo.alt}
          fetchPriority="high"
        />
      </section>

      {/* The founder film: click to play, no autoplay, captions on request. */}
      <section className={styles.film} aria-labelledby="film-title" data-reveal>
        <h2 id="film-title" className={styles.h2}>
          The founder, in <em>51 seconds</em>
        </h2>
        <video
          className={styles.video}
          controls
          playsInline
          preload="none"
          poster="/founder/founder-film-poster.jpg"
          width={1920}
          height={1080}
        >
          <source src="/founder/founder-film.mp4" type="video/mp4" />
          <track kind="captions" src="/founder/founder-film.vtt" srcLang="en" label="English" />
        </video>
        <p className={styles.filmNote}>
          The client work in the film is {site.founderName}&apos;s own, from before the studio; the 70,000+ bookings are
          Ultraviolette&apos;s, through configurators {site.founderName.split(' ')[0]} built. Music: &ldquo;Fresh&rdquo; by Bransboynd, via Pixabay.
        </p>
      </section>

      <section className={styles.proof} aria-labelledby="proof-title" data-reveal>
        <h2 id="proof-title" className="sr-only">
          The numbers
        </h2>
        <ul className={styles.cards} data-m="stagger">
          {founder.metrics.map((m) => (
            <li key={m.value} className={styles.card} data-tilt>
              <strong data-m="count">{m.value}</strong>
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
        <ol className={styles.rail} data-m="rail">
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
        <dl className={styles.faq} data-m="stagger">
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
      <PageMotion />
    </main>
  )
}
