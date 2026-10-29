'use client'

import { useEffect, useRef, useState } from 'react'
import { FilmPlayer } from '@/components/film-player/film-player'
import type { FilmVersions } from '@/data/films'
import styles from '@/components/film-player/film-pair.module.css'

type Cut = 'tall' | 'square'
type Side = 'light' | 'dark'

const cuts: { id: Cut; label: string }[] = [
  { id: 'tall', label: 'Vertical' },
  { id: 'square', label: 'Square' },
]
const sides: { id: Side; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
]

function Switch<T extends string>({ label, options, value, onChange, className }: { label: string; options: { id: T; label: string }[]; value: T; onChange: (v: T) => void; className?: string }) {
  return (
    <div className={`${styles.switch} ${className ?? ''}`} role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

// A film made in light and dark: both side by side on wider screens, one at a time on phones (the
// Light / Dark switch), and a switch between the vertical and square cuts. Only one plays at a time.
export function FilmPair({ versions, captions, title, autoPlay }: { versions: FilmVersions; captions?: string; title: string; autoPlay?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [cut, setCut] = useState<Cut>('tall')
  const [side, setSide] = useState<Side>('light')
  const [picked, setPicked] = useState(!!autoPlay)

  // Media events do not bubble, so listen in the capture phase.
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const onPlay = (e: Event) => {
      for (const v of el.querySelectorAll('video')) if (v !== e.target && !v.paused) v.pause()
    }
    el.addEventListener('play', onPlay, true)
    return () => el.removeEventListener('play', onPlay, true)
  }, [])

  // Switching stops whatever is playing; the new players wait for a press.
  const stopAll = () => {
    for (const el of wrap.current?.querySelectorAll('video') ?? []) el.pause()
    setPicked(false)
  }
  const pickCut = (v: Cut) => {
    stopAll()
    setCut(v)
  }
  const pickSide = (v: Side) => {
    stopAll()
    setSide(v)
  }

  return (
    <div ref={wrap} className={styles.pair} data-side={side} data-cut={cut}>
      <div className={styles.bar}>
        <Switch label="Cut" options={cuts} value={cut} onChange={pickCut} />
        <Switch label="Version" options={sides} value={side} onChange={pickSide} className={styles.sides} />
      </div>
      <div className={styles.films}>
        {sides.map((s) => (
          <figure key={`${s.id}-${cut}`} className={styles.film} data-side={s.id}>
            <FilmPlayer
              src={versions[s.id][cut].src}
              poster={versions[s.id][cut].poster}
              captions={captions}
              title={`${title}, ${s.label.toLowerCase()}, ${cut === 'tall' ? 'vertical' : 'square'}`}
              portrait={cut === 'tall'}
              square={cut === 'square'}
              autoPlay={picked && s.id === side}
            />
            <figcaption>{s.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
