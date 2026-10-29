'use client'

import { useRef, useState } from 'react'
import { FilmPair } from '@/components/film-player/film-pair'
import { FilmPlayer } from '@/components/film-player/film-player'
import { allFilms, type FilmEntry } from '@/data/films'
import { lenisRef } from '@/lib/motion/smooth-scroll'
import styles from '@/app/films/films.module.css'

// One card in the grid. On a mouse, hovering plays a few silent seconds of the film itself; the file
// only starts loading then. Touch screens and reduced motion get the poster alone.
function Card({ film, onPick }: { film: FilmEntry; onPick: (f: FilmEntry) => void }) {
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
    <li className={styles.card} data-hot={hot || undefined} data-portrait={film.portrait || undefined}>
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
        {current.note && <p className={styles.note}>{current.note}</p>}
      </section>

      <section className={styles.more} aria-labelledby="more-title">
        <h2 id="more-title" className={styles.h2}>
          More films <em>we&apos;ve made</em>
        </h2>
        <ul className={styles.grid}>
          {allFilms
            .filter((f) => f.id !== current.id)
            .map((f) => (
              <Card key={f.id} film={f} onPick={pick} />
            ))}
        </ul>
      </section>
    </>
  )
}
