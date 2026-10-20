'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Film } from '@/data/services'
import { FilmPlayer } from '@/components/film-player/film-player'
import { lenisRef } from '@/lib/motion/smooth-scroll'
import styles from '@/scenes/services/services.module.css'

// Matches the exit transition on .player in services.module.css.
const EXIT_MS = 320

// Posters for the films we made. Nothing loads until one is pressed; it then plays in a dialog with
// controls, sound and captions, and the page holds still underneath.
export function FilmReel({ films }: { films: Film[] }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [film, setFilm] = useState<Film | null>(null)
  // Bumped on every open, so pressing the same poster again reopens the dialog.
  const [opens, setOpens] = useState(0)
  // The film stays mounted until the exit animation has played, then unmounts.
  const unmount = useRef<number | undefined>(undefined)

  const open = useCallback((f: Film) => {
    window.clearTimeout(unmount.current)
    setFilm(f)
    setOpens((n) => n + 1)
  }, [])

  // Undo everything opening did. Called directly from every way out (button, backdrop, Escape),
  // with the dialog's close event as a backstop, so it never waits on that event.
  const release = useCallback(() => {
    dialog.current?.querySelector('video')?.pause()
    lenisRef.current?.start()
    document.documentElement.style.overflow = ''
    window.clearTimeout(unmount.current)
    unmount.current = window.setTimeout(() => setFilm(null), EXIT_MS)
  }, [])

  const shut = useCallback(() => {
    const d = dialog.current
    if (d?.open) d.close()
    release()
  }, [release])

  useEffect(() => {
    const d = dialog.current
    if (!film || !d) return
    if (!d.open) d.showModal()
    lenisRef.current?.stop()
    document.documentElement.style.overflow = 'hidden'
    const onCancel = (e: Event) => {
      e.preventDefault()
      shut()
    }
    d.addEventListener('cancel', onCancel)
    d.addEventListener('close', release)
    return () => {
      d.removeEventListener('cancel', onCancel)
      d.removeEventListener('close', release)
    }
  }, [film, opens, release, shut])

  return (
    <>
      <ul className={styles.films}>
        {films.map((f) => (
          <li key={f.id}>
            <button type="button" className={styles.film} onClick={() => open(f)} aria-label={`Play the ${f.title} (${f.meta})`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.poster} alt="" width={1280} height={720} loading="lazy" decoding="async" />
              <span className={styles.play} aria-hidden="true">
                ▶
              </span>
              <span className={styles.filmText}>
                <b>{f.title}</b>
                <span>{f.meta}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        className={styles.player}
        aria-label={film?.title}
        data-lenis-prevent
        onClick={(e) => e.target === e.currentTarget && shut()}
      >
        {film && (
          <div className={styles.playerInner}>
            {/* Plays straight away: the poster press is the click. Captions stay off by default, as the
                films carry their words on screen. */}
            <FilmPlayer key={`${film.id}-${opens}`} src={film.src} poster={film.poster} captions={film.captions} title={film.title} autoPlay />
            <div className={styles.playerBar}>
              <span>
                {film.title} <em>· {film.meta}</em>
              </span>
              <button type="button" onClick={shut}>
                close ✕
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
