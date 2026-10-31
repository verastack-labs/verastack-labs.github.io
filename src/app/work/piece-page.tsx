import Link from 'next/link'
import type { CSSProperties } from 'react'
import { FilmPair } from '@/components/film-player/film-pair'
import { FilmPlayer } from '@/components/film-player/film-player'
import { allFilms } from '@/data/films'
import { detailText, disciplineLabel, kindLabel, pagePieces, pillTitle, type Piece } from '@/data/pieces'
import { jsonLd, studioNode } from '@/lib/structured-data'
import { site } from '@/data/site'
import { pieceFont } from '@/app/work/fonts'
import { DetailGlyphArt } from '@/app/work/piece-glyphs'
import { PieceMotifArt } from '@/app/work/piece-motif'
import { CountUp, ScrollWords } from '@/app/work/piece-motion'
import { PieceWorlds } from '@/app/work/piece-worlds'
import styles from '@/app/work/piece.module.css'

// An idea's ==phrase== becomes a highlight that sweeps in as it scrolls into view.
const marked = (text: string) => text.split(/==(.+?)==/).map((t, i) => (i % 2 ? <mark key={i} className={styles.mark}>{t}</mark> : t))

const month = (date: string) => new Date(`${date}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })

// One piece of work, dressed in its own theme: its palette, its faces, its shape and a drawing from
// its own world.
export function PiecePage({ piece }: { piece: Piece }) {
  const { theme } = piece
  const vars = {
    '--p-bg': theme.bg,
    '--p-fg': theme.fg,
    '--p-muted': theme.muted,
    '--p-accent': theme.accent,
    '--p-on-accent': theme.onAccent,
  } as CSSProperties
  const siblings = pagePieces.filter((p) => p.kind === piece.kind)
  const at = siblings.findIndex((p) => p.slug === piece.slug)
  const prev = siblings.length > 1 ? siblings[(at - 1 + siblings.length) % siblings.length] : null
  const next = siblings.length > 1 ? siblings[(at + 1) % siblings.length] : null
  const url = `${site.url}/work/${piece.slug}/`
  const external = piece.external?.url
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      studioNode(),
      {
        '@type': 'CreativeWork',
        name: piece.title,
        description: piece.line,
        url,
        dateCreated: piece.date,
        ...(piece.cover ? { image: `${site.url}${piece.cover}` } : {}),
        creator: { '@id': studioNode()['@id'] },
        ...(piece.external ? { sameAs: piece.external.url.startsWith('/') ? `${site.url}${piece.external.url}` : piece.external.url } : {}),
      },
    ],
  }
  // The cover already shows above, so a section never repeats it.
  const sections = piece.disciplines.flatMap((d) => {
    const s = piece.sections?.[d]
    return s ? [{ d, idea: s.idea, strip: s.strip, film: allFilms.find((f) => f.id === s.film), shots: s.shots.filter((x) => x.src !== piece.cover) }] : []
  })

  return (
    <main
      id="main"
      className={`${styles.page} ${pieceFont(theme.font, theme.mono)}`}
      style={vars}
      data-font={theme.font}
      data-mono={theme.mono ?? 'house'}
      data-shape={theme.shape ?? 'soft'}
    >
      <span id="top" />
      {/* How far down the piece the reader is, in its accent, along the top edge. */}
      <div className={styles.progress} aria-hidden="true" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <div className={styles.inner}>
        <p className={styles.crumb}>
          <Link href="/work/">/work</Link> <em>{'//'}</em> {piece.disciplines.map((d) => disciplineLabel[d]).join(' · ')}
        </p>
        <div className={styles.hero}>
          <header className={styles.head}>
            <span className={piece.kind === 'concept' ? `${styles.kind} ${styles.concept}` : styles.kind}>{kindLabel[piece.kind]}</span>
            <h1 className={styles.title}>{pillTitle(piece)}</h1>
            <p className={styles.line}>{piece.line}</p>
            <p className={styles.credit}>
              {piece.credit}
              {piece.concept && piece.concept.visibility !== 'named' ? ` · for ${piece.concept.for}` : ''} · {month(piece.date)}
            </p>
            {piece.external && external && (
              <a className={styles.button} href={external} {...(external.startsWith('/') ? {} : { target: '_blank', rel: 'noreferrer' })}>
                {piece.external.label} {external.startsWith('/') ? '→' : '↗'}
              </a>
            )}
          </header>
          {theme.motif && <PieceMotifArt motif={theme.motif} />}
        </div>
        {piece.facts && (
          <dl className={styles.facts}>
            {piece.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>
                  <CountUp value={f.value} />
                </dd>
              </div>
            ))}
          </dl>
        )}
        {piece.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.cover} src={piece.cover} alt={`${piece.title}, cover`} />
        )}
        {piece.brief && (
          <section className={styles.brief} aria-labelledby="s-brief">
            <h2 id="s-brief" className={styles.h2}>
              /the brief
            </h2>
            <ScrollWords text={piece.brief} />
          </section>
        )}
        {sections.map((s, i) => (
          <section key={s.d} className={styles.section} aria-labelledby={`s-${s.d}`}>
            <h2 id={`s-${s.d}`} className={`${styles.h2} ${styles.pin}`}>
              <em>{String(i + 1).padStart(2, '0')}</em> /{disciplineLabel[s.d]}
            </h2>
            <p className={styles.idea}>{marked(s.idea)}</p>
            {s.d === 'design' && piece.worlds && <PieceWorlds slug={piece.slug} worlds={piece.worlds} />}
            {s.film && (
              <div className={styles.film}>
                {s.film.versions ? (
                  <FilmPair versions={s.film.versions} captions={s.film.captions} title={s.film.title} />
                ) : (
                  <FilmPlayer src={s.film.src} poster={s.film.poster} captions={s.film.captions} title={s.film.title} portrait={s.film.portrait} />
                )}
                {s.film.note && <p className={styles.filmNote}>{s.film.note}</p>}
              </div>
            )}
            {s.shots.length > 0 && (
              <div className={s.strip ? styles.strip : styles.shots} data-count={s.shots.length}>
                {s.shots.map((sh) => (
                  <figure key={sh.src} className={styles.shot}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sh.src} alt={sh.alt} loading="lazy" />
                    <figcaption>
                      {sh.alt}
                      {sh.note && <span>{sh.note}</span>}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </section>
        ))}
        {piece.details && (
          <section className={styles.details} aria-labelledby="s-details">
            <h2 id="s-details" className={`${styles.h2} ${styles.pin}`}>
              /small things
            </h2>
            <ol>
              {piece.details.map((d, i) => (
                <li key={detailText(d)} style={{ '--i': i } as CSSProperties} data-glyph={typeof d === 'string' ? undefined : ''}>
                  {typeof d !== 'string' && <DetailGlyphArt glyph={d.glyph} />}
                  {detailText(d)}
                </li>
              ))}
            </ol>
          </section>
        )}
        {piece.concept && (
          <aside className={styles.takes} aria-label="What the full version takes">
            <p className={styles.h2}>/what the full version takes</p>
            <p>{piece.concept.takes}</p>
            <p className={styles.note}>
              {piece.concept.visibility === 'own'
                ? 'A concept for a brand we made up, to show what we would ship. Not a client project.'
                : piece.concept.visibility === 'anonymised'
                  ? `A concept by VeraStack Labs for ${piece.concept.for}, made as a sample, not a commissioned project. The name and every figure in it are made up.`
                  : `A concept by VeraStack Labs, not commissioned by or affiliated with ${piece.concept.for}. ${piece.concept.for} and its marks belong to ${piece.concept.owner ?? piece.concept.for}.`}
            </p>
            <Link className={styles.button} href="/#contact">
              Want one for your launch? →
            </Link>
          </aside>
        )}
        {prev && next && (
          <nav className={styles.pager} aria-label={`More ${kindLabel[piece.kind].toLowerCase()} work`}>
            <Link href={`/work/${prev.slug}/`}>
              <span>← previous</span>
              {prev.title}
            </Link>
            <Link href={`/work/${next.slug}/`}>
              <span>next →</span>
              {next.title}
            </Link>
          </nav>
        )}
      </div>
    </main>
  )
}
