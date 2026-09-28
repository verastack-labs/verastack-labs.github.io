'use client'

import { useEffect, useRef } from 'react'
import type { WorkEntry } from '@/data/work'
import styles from '@/scenes/work/work.module.css'

// A headliner's screen recording (muted, looping, playing only while on screen), or its stand-in
// artwork until the recording exists.
export function ReelMedia({ entry, playing }: { entry: WorkEntry; playing: boolean }) {
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (playing) v.play().catch(() => {})
    else v.pause()
  }, [playing])

  if (entry.media) {
    return (
      <video ref={video} className={styles.video} poster={entry.media.poster} muted loop playsInline preload="none" aria-hidden="true">
        {entry.media.webm && <source src={entry.media.webm} type="video/webm" />}
        <source src={entry.media.mp4} type="video/mp4" />
      </video>
    )
  }

  const art = entry.art!
  return (
    <div
      className={styles.art}
      style={{ '--from': art.from, '--to': art.to, '--glow': art.glow } as React.CSSProperties}
      aria-hidden="true"
    >
      <span className={styles.artGlow} />
      <span className={styles.artGrid} />
      <span className={styles.artWord}>{art.word}</span>
    </div>
  )
}
