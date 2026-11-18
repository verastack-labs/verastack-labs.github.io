'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { FilmCuts, FilmPair } from '@/components/film-player/film-pair'
import { FilmPlayer } from '@/components/film-player/film-player'
import { allFilms, channels, films, shorts, studioFilm, type FilmEntry } from '@/data/films'
import { lenisRef } from '@/lib/motion/smooth-scroll'
import styles from '@/app/films/films.module.css'

// One card in the grid. On a mouse, hovering plays a few silent seconds of the film itself; the file
// only starts loading then. Touch screens and reduced motion get the poster alone.
function Card({ film, onPick, reveal }: { film: FilmEntry; onPick: (f: FilmEntry) => void; reveal?: number }) {
  const preview = useRef<HTMLVideoElement>(null)
  const [hot, setHot] = useState(false)
  const canPreview = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    document.documentElement.dataset.motion !== 'static'

  const start = () => {
    if (!canPreview()) return
    setHot(true)
    const v = preview.current
    if (!v) return
    if (!v.src) v.src = `${film.src}#t=${film.previewAt}`
    void v.play().catch(() => {})
  }
  const stop = () => {
    setHot(false)
    preview.current?.pause()
  }

  return (
    <li
      className={styles.card}
      data-hot={hot || undefined}
      data-portrait={film.portrait || undefined}
      data-reveal={reveal !== undefined || undefined}
      style={reveal !== undefined ? ({ '--i': reveal } as CSSProperties) : undefined}
    >
      <button type="button" className={styles.cardButton} onClick={() => onPick(film)} onPointerEnter={start} onPointerLeave={stop} onFocus={start} onBlur={stop}>
        <span className={styles.thumb}>
          {film.portrait && <span className={styles.backdrop} style={{ backgroundImage: `url(${film.poster})` }} aria-hidden="true" />}
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimiser */}
          <img src={film.poster} alt="" width={film.portrait ? 720 : 1280} height={film.portrait ? 1280 : 720} loading="lazy" decoding="async" />
          <video ref={preview} muted playsInline loop preload="none" aria-hidden="true" tabIndex={-1} />
          <span className={styles.cardPlay} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M8 5.5v13l10.5-6.5z" />
            </svg>
          </span>
          <span className={styles.length}>{film.length}</span>
        </span>
        <span className={styles.cardText}>
          <b>{film.title}</b>
          <span>{film.line}</span>
          <span className={styles.formats}>
            {film.formats.map((f) => (
              <i key={f}>{f}</i>
            ))}
          </span>
        </span>
        <span className="sr-only">, play this film</span>
      </button>
    </li>
  )
}

// A section's grid: the first few films, then a card that opens the rest. The first section shows
// more before it folds; later ones fold after a single row. A lone extra film is shown, not folded.
function Shelf({ list, show, what, onPick }: { list: FilmEntry[]; show: number; what: string; onPick: (f: FilmEntry) => void }) {
  const [open, setOpen] = useState(false)
  const grid = useRef<HTMLUListElement>(null)
  const folds = !open && list.length > show + 1
  const shown = folds ? list.slice(0, show) : list
  const rest = list.slice(show)

  const opened = useRef(false)
  const expand = () => {
    opened.current = true
    setOpen(true)
  }
  // After the card opens the rest, focus lands on the first film that was hidden.
  useEffect(() => {
    if (!open || !opened.current) return
    opened.current = false
    grid.current?.querySelectorAll<HTMLButtonElement>('button')[show]?.focus({ preventScroll: true })
  }, [open, show])

  return (
    <ul ref={grid} className={styles.grid}>
      {shown.map((f, i) => (
        <Card key={f.id} film={f} onPick={onPick} reveal={open && i >= show ? i - show : undefined} />
      ))}
      {folds && (
        <li className={`${styles.card} ${styles.moreCard}`}>
          <button type="button" className={styles.cardButton} onClick={expand} aria-label={`Show ${rest.length} more ${what}`}>
            <span className={`${styles.thumb} ${styles.fan}`} aria-hidden="true">
              {rest.slice(0, 3).map((f, i) => (
                // eslint-disable-next-line @next/next/no-img-element -- static export, no image optimiser
                <img key={f.id} src={f.poster} alt="" loading="lazy" decoding="async" data-portrait={f.portrait || undefined} style={{ '--i': i } as CSSProperties} />
              ))}
              <span className={styles.fanCount}>+{rest.length}</span>
            </span>
            <span className={styles.cardText}>
              <b>
                {rest.length} more {what}
              </b>
              <span>
                {rest[0].title} and {rest.length - 1} more.
              </span>
              <span className={styles.moreGo}>Show all <span aria-hidden="true">↓</span></span>
            </span>
          </button>
        </li>
      )}
    </ul>
  )
}

// The featured film up top and the rest below. Picking a card puts that film in the big player and
// plays it there, so the page stays one place to watch.
export function FilmsGallery() {
  const [current, setCurrent] = useState<FilmEntry>(allFilms[0])
  const [picked, setPicked] = useState(false)
  const stage = useRef<HTMLElement>(null)

  const pick = (f: FilmEntry) => {
    setCurrent(f)
    setPicked(true)
    const el = stage.current
    if (!el) return
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -110 })
    else el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <>
      <section ref={stage} className={styles.stage} aria-labelledby="now-title">
        {current.versions ? (
          <FilmPair key={current.id} versions={current.versions} captions={current.captions} title={current.title} autoPlay={picked} />
        ) : current.cuts ? (
          <FilmCuts key={current.id} cuts={current.cuts} captions={current.captions} title={current.title} autoPlay={picked} />
        ) : (
          <FilmPlayer
            key={current.id}
            src={current.src}
            poster={current.poster}
            captions={current.captions}
            title={current.title}
            chapters={current.chapters}
            autoPlay={picked}
            portrait={current.portrait}
          />
        )}
        <div className={styles.now} key={`${current.id}-text`}>
          <div>
            <h2 id="now-title" className={styles.nowTitle}>
              {current.title}
            </h2>
            <p className={styles.nowLine}>{current.line}</p>
          </div>
          <p className={styles.nowMeta}>
            <span>{current.length}</span>
            {current.formats.map((f) => (
              <i key={f}>{f}</i>
            ))}
          </p>
        </div>
        {(current.note || current.youtube) && (
          <p className={styles.note}>
            {current.note}
            {current.youtube && (
              <>
                {' '}
                <a className={styles.noteLink} href={current.youtube} target="_blank" rel="noopener">
                  Watch on YouTube
                </a>
              </>
            )}
          </p>
        )}
      </section>

      <section className={styles.more} aria-labelledby="more-title">
        <h2 id="more-title" className={styles.h2}>
          More films <em>we&apos;ve made</em>
        </h2>
        <Shelf list={[studioFilm, ...films].filter((f) => f.id !== current.id)} show={5} what="films" onPick={pick} />
      </section>

      <section className={styles.more} aria-labelledby="shorts-title">
        <h2 id="shorts-title" className={styles.h2}>
          Studio shorts: <em>explainers and jokes</em>
        </h2>
        <p className={styles.moreLine}>Our own pieces, made between projects. None of these is client work.</p>
        <Shelf list={shorts.filter((f) => f.id !== current.id)} show={2} what="shorts" onPick={pick} />
      </section>

      {channels.map((c) => (
        <section key={c.id} className={styles.more} aria-labelledby={`${c.id}-title`}>
          <h2 id={`${c.id}-title`} className={styles.h2}>
            {c.name}: <em>{c.kind}</em>
          </h2>
          <p className={styles.moreLine}>{c.line}</p>
          <Shelf list={c.films.filter((f) => f.id !== current.id)} show={2} what="episodes" onPick={pick} />
        </section>
      ))}
    </>
  )
}
