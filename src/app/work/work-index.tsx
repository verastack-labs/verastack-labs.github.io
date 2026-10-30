import Link from 'next/link'
import type { CSSProperties } from 'react'
import { conceptsGallery, disciplineLabel, kindLabel, liveFacets, peekOf, pillTitle, type Piece } from '@/data/pieces'
import { CardGlow } from '@/app/work/card-glow'
import { jsonLd, studioNode } from '@/lib/structured-data'
import { site } from '@/data/site'
import styles from '@/app/work/work.module.css'

type Props = { title: React.ReactNode; name: string; lede: string; path: string; items: Piece[]; active: string | null }

const href = (p: Piece) => (p.page ? `/work/${p.slug}/` : (p.external?.url ?? '/work/'))
const year = (p: Piece) => p.date.slice(0, 4)

// The grid behind /work and every filtered view. Filters are links between static pages.
export function WorkIndex({ title, name, lede, path, items, active }: Props) {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      studioNode(),
      {
        '@type': 'ItemList',
        name,
        itemListElement: items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title, description: p.line, url: p.page ? `${site.url}/work/${p.slug}/` : p.external?.url })),
      },
    ],
  }
  return (
    <main id="main" className={styles.page}>
      <span id="top" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <p className={styles.label}>
        {path} <em>{'//'}</em> clients, products and concepts
      </p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.lede}>{lede}</p>
      <nav className={styles.filters} aria-label="Filter the work">
        <Link href="/work/" aria-current={active === null ? 'page' : undefined}>
          All
        </Link>
        {liveFacets.map((f) => (
          <Link key={f.slug} href={`/work/${f.slug}/`} aria-current={active === f.slug ? 'page' : undefined}>
            {f.label}
          </Link>
        ))}
        <a href={conceptsGallery} target="_blank" rel="noreferrer">
          Lab ↗
        </a>
      </nav>
      <CardGlow />
      <ul className={styles.grid}>
        {items.map((p, i) => {
          const theme = { '--c-bg': p.theme.bg, '--c-fg': p.theme.fg, '--c-accent': p.theme.accent } as CSSProperties
          const peek = peekOf(p)
          const outside = !p.page
          return (
            <li key={p.slug} style={{ '--i': i } as CSSProperties}>
              <Link className={styles.card} href={href(p)} style={theme} data-glow {...(outside ? { target: '_blank', rel: 'noreferrer' } : {})}>
                <span className={styles.cover}>
                  {p.cover && peek ? (
                    // The card scrolls from the cover to a second screen on hover.
                    <span className={styles.track}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.cover} alt="" loading="lazy" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={peek} alt="" loading="lazy" />
                    </span>
                  ) : p.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.cover} alt="" loading="lazy" />
                  ) : (
                    <span className={styles.word} aria-hidden="true">
                      {p.title.split(':')[0]}
                    </span>
                  )}
                </span>
                <span className={styles.meta}>
                  <span className={p.kind === 'concept' ? `${styles.kind} ${styles.concept}` : styles.kind}>{kindLabel[p.kind]}</span>
                  <span className={styles.when}>{year(p)}</span>
                </span>
                <b>{pillTitle(p)}</b>
                <span className={styles.line}>{p.line}</span>
                <span className={styles.chips}>
                  {p.disciplines.map((d) => (
                    <span key={d}>{disciplineLabel[d]}</span>
                  ))}
                </span>
                <span className={styles.go}>
                  {outside ? (p.external?.label ?? 'Open') : 'See the work'} <span className={styles.arrow}>{outside ? '↗' : '→'}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
