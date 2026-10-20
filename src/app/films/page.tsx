import type { Metadata } from 'next'
import Link from 'next/link'
import { FilmsGallery } from '@/app/films/gallery'
import { allFilms, studioFilm } from '@/data/films'
import { booking, site } from '@/data/site'
import { jsonLd, studioNode } from '@/lib/structured-data'
import styles from '@/app/films/films.module.css'

const page = {
  path: '/films',
  title: 'Films by VeraStack Labs',
  description:
    'Launch films and explainers we make for products, ours and others: the studio in 90 seconds, then rigseed, Origan, the founder film and an independent Bruno film.',
}

const shareImage = { url: studioFilm.poster, width: 1920, height: 1080, alt: studioFilm.title }

export const metadata: Metadata = {
  title: `${page.title} · ${site.name}`,
  description: page.description,
  alternates: { canonical: page.path },
  openGraph: { title: page.title, description: page.description, url: `${site.url}${page.path}/`, siteName: site.name, type: 'website', images: [shareImage] },
  twitter: { card: 'summary_large_image', title: page.title, description: page.description, images: [shareImage] },
}

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    studioNode(),
    {
      '@type': 'ItemList',
      name: page.title,
      itemListElement: allFilms.map((f, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'VideoObject',
          name: f.title,
          description: f.line,
          thumbnailUrl: `${site.url}${f.poster}`,
          contentUrl: `${site.url}${f.src}`,
          uploadDate: f.uploaded,
          duration: f.duration,
          publisher: { '@id': `${site.url}/#organization` },
        },
      })),
    },
  ],
}

export default function FilmsPage() {
  return (
    <main id="main" className={styles.page}>
      <span id="top" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <p className={styles.label} data-reveal>
        /films <em>{'//'}</em> made by the studio
      </p>
      <h1 className={styles.title} data-reveal>
        Films that <em>launch things.</em>
      </h1>
      <p className={styles.lede} data-reveal>
        Launch films, explainers and cut-downs for every feed, in the product&apos;s own style. Start with ours.
      </p>

      <FilmsGallery />

      <section className={styles.ask} data-reveal>
        <div>
          <h2 className={styles.askTitle}>
            Want one for <em>your product?</em>
          </h2>
          <p>A launch film with cuts for LinkedIn, X and your launch post, from a short call. A few products we pick get one free.</p>
        </div>
        <div className={styles.askCtas}>
          <a className={styles.cta} href={booking.href} {...(booking.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
            Book a 30-min call
          </a>
          <Link className={styles.ghost} href="/#contact">
            Tell us about it
          </Link>
        </div>
      </section>
    </main>
  )
}
