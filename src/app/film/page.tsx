import type { Metadata } from 'next'
import Link from 'next/link'
import { booking, site } from '@/data/site'
import { jsonLd, studioNode } from '@/lib/structured-data'
import styles from '@/app/founder/founder.module.css'

// The studio's launch film (90 s), on a page of its own so it can be shared as one link.
const film = {
  path: '/film',
  title: 'VeraStack Labs in 90 seconds',
  description:
    'The VeraStack Labs launch film: what we design and build, the AI search work, the films, our own products and the Launch Kit, in 90 seconds.',
  src: '/films/verastack-launch.mp4',
  poster: '/films/verastack-launch.jpg',
  captions: '/films/verastack-launch.vtt',
}

const shareImage = { url: film.poster, width: 1920, height: 1080, alt: film.title }

export const metadata: Metadata = {
  title: `${film.title} · ${site.name}`,
  description: film.description,
  alternates: { canonical: film.path },
  openGraph: { title: film.title, description: film.description, url: `${site.url}${film.path}/`, siteName: site.name, type: 'video.other', images: [shareImage] },
  twitter: { card: 'summary_large_image', title: film.title, description: film.description, images: [shareImage] },
}

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    studioNode(),
    {
      '@type': 'VideoObject',
      name: film.title,
      description: film.description,
      thumbnailUrl: `${site.url}${film.poster}`,
      contentUrl: `${site.url}${film.src}`,
      uploadDate: '2026-10-21',
      duration: 'PT1M30S',
      publisher: { '@id': `${site.url}/#organization` },
    },
  ],
}

export default function FilmPage() {
  return (
    <main id="main" className={styles.page}>
      <span id="top" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <p className={styles.label} data-reveal>
        /film <em>{'//'}</em> the studio in 90 seconds
      </p>
      <section className={styles.film} aria-labelledby="film-title" data-reveal>
        <h1 id="film-title" className={styles.h2}>
          {site.name} in <em>90 seconds</em>
        </h1>
        <video className={styles.video} controls playsInline preload="none" poster={film.poster} width={1920} height={1080}>
          <source src={film.src} type="video/mp4" />
          <track kind="captions" src={film.captions} srcLang="en" label="English" />
        </video>
        <p className={styles.filmNote}>
          The 70,000+ bookings are Ultraviolette&apos;s, through configurators our founder built there as an employee, before the
          studio. Music: &ldquo;Voyage&rdquo; by AudioClubz, via Pixabay.
        </p>
      </section>
      <div className={styles.ctas} data-reveal>
        <a className={styles.cta} href={booking.href} {...(booking.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
          Book a 30-min call
        </a>
        <Link className={styles.ghost} href="/launch-kit">
          See the Launch Kit
        </Link>
      </div>
    </main>
  )
}
