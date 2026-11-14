'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Chapter } from '@/data/films'
import { nextRate, shortcutFor, SHORTCUTS, type Action } from '@/components/film-player/shortcuts'
import styles from '@/components/film-player/film-player.module.css'

type Props = {
  src: string
  poster: string
  captions?: string
  title: string
  chapters?: Chapter[]
  // Start playing as soon as it mounts: only after a click (a film picked from the grid, a poster
  // pressed), so the browser allows sound.
  autoPlay?: boolean
  // A vertical film: a 9:16 frame, as tall as the screen allows.
  portrait?: boolean
  // A square cut: a 1:1 frame.
  square?: boolean
}

const time = (s: number) => {
  if (!Number.isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

// Shows or hides the first captions track; returns whether it is now showing (null if none).
function flipCaptions(v: HTMLVideoElement | null): boolean | null {
  const track = v?.textTracks[0]
  if (!track) return null
  const on = track.mode !== 'showing'
  track.mode = on ? 'showing' : 'hidden'
  return on
}

// The player the letter shortcuts go to: the last one played, pressed or focused. Only one film
// plays at a time, so a page with several players still has one obvious target.
let activePlayer: symbol | null = null

// Typing in a field, or a shortcut with a modifier, is never a player shortcut.
function isTyping(e: KeyboardEvent): boolean {
  const el = e.target as HTMLElement | null
  if (e.ctrlKey || e.metaKey || e.altKey) return true
  if (!el) return false
  return el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)
}

// How long the controls stay up after the last pointer move while a film plays.
const IDLE_MS = 2200
// One frame at the 30 fps our films are cut at.
const FRAME = 1 / 30

// Our own player: the poster with a big neon play button until the first press, then slim controls
// that fade out while the film plays. Nothing but the poster loads until play (preload="none").
// Keyboard shortcuts (shortcuts.ts) go to the player last used: f, m, c and k anywhere on the page, the
// rest while focus is inside the player or its film is playing on screen. Each one shows a short note
// in the frame, ? lists them all, and a double click goes full screen. Every control is a real button
// or range input with a label.
export function FilmPlayer({ src, poster, captions, title, chapters, autoPlay, portrait, square }: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const idle = useRef<number | undefined>(undefined)
  const id = useRef(Symbol('film'))
  // A film that plays on mount (picked from the grid) skips the big button.
  const [started, setStarted] = useState(!!autoPlay)
  const [playing, setPlaying] = useState(false)
  const [now, setNow] = useState(0)
  const [length, setLength] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [muted, setMuted] = useState(false)
  const [cc, setCc] = useState(false)
  const [full, setFull] = useState(false)
  const [awake, setAwake] = useState(true)
  const [waiting, setWaiting] = useState(false)
  // The centre flash after a toggle: bumping the key replays its animation.
  const [flash, setFlash] = useState<{ kind: 'play' | 'pause'; key: number } | null>(null)
  // The note a shortcut leaves at the top of the frame ("+5 s", "Volume 60%"), replayed the same way.
  const [note, setNote] = useState<{ text: string; key: number } | null>(null)
  const [help, setHelp] = useState(false)
  // What the page-wide key handler needs without re-subscribing on every change.
  const live = useRef({ started: !!autoPlay, seen: false, full: false })
  useEffect(() => {
    live.current.started = started
    live.current.full = full
  }, [started, full])

  const say = useCallback((text: string) => setNote((n) => ({ text, key: (n?.key ?? 0) + 1 })), [])

  const wake = useCallback(() => {
    setAwake(true)
    window.clearTimeout(idle.current)
    idle.current = window.setTimeout(() => setAwake(false), IDLE_MS)
  }, [])

  const toggle = useCallback(() => {
    const v = video.current
    if (!v) return
    if (v.paused) {
      setStarted(true)
      void v.play().catch(() => {})
      setFlash((f) => ({ kind: 'play', key: (f?.key ?? 0) + 1 }))
    } else {
      v.pause()
      setFlash((f) => ({ kind: 'pause', key: (f?.key ?? 0) + 1 }))
    }
    wake()
  }, [wake])

  const seek = useCallback(
    (to: number) => {
      const v = video.current
      if (!v) return
      v.currentTime = Math.max(0, Math.min(to, v.duration || to))
      setNow(v.currentTime)
      wake()
    },
    [wake],
  )

  const toggleCc = useCallback(() => {
    const on = flipCaptions(video.current)
    if (on !== null) setCc(on)
    return on
  }, [])

  const toggleMute = useCallback(() => {
    const v = video.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }, [])

  const togglePip = useCallback(() => {
    const v = video.current
    if (!v || !document.pictureInPictureEnabled) return false
    if (document.pictureInPictureElement) void document.exitPictureInPicture().catch(() => {})
    else void v.requestPictureInPicture().catch(() => {})
    return true
  }, [])

  const toggleFull = useCallback(() => {
    const el = wrap.current
    const v = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    if (!el || !v) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else if (el.requestFullscreen) void el.requestFullscreen().catch(() => v.webkitEnterFullscreen?.())
    else v.webkitEnterFullscreen?.() // iPhone Safari: only the video itself can go full screen
  }, [])

  useEffect(() => {
    const onFull = () => setFull(document.fullscreenElement === wrap.current)
    document.addEventListener('fullscreenchange', onFull)
    return () => document.removeEventListener('fullscreenchange', onFull)
  }, [])

  useEffect(() => {
    if (autoPlay) void video.current?.play().catch(() => {})
  }, [autoPlay, src])

  useEffect(() => () => window.clearTimeout(idle.current), [])

  // Whether at least half the player is on screen: a playing film that has scrolled away gives space
  // and the arrows back to the page.
  useEffect(() => {
    const el = wrap.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => (live.current.seen = e.intersectionRatio >= 0.5), { threshold: [0, 0.5, 1] })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const run = useCallback(
    (a: Action) => {
      const v = video.current
      if (!v) return
      const end = v.duration || length
      switch (a.type) {
        case 'toggle':
          return toggle()
        case 'full':
          return toggleFull()
        case 'mute':
          toggleMute()
          return say(v.muted ? 'Muted' : 'Sound on')
        case 'captions': {
          const on = toggleCc()
          if (on !== null) say(on ? 'Captions on' : 'Captions off')
          return
        }
        case 'pip':
          if (!togglePip()) say('Picture in picture is not available here')
          return
        case 'help':
          return setHelp((h) => !h)
        case 'close':
          return setHelp(false)
        case 'skip':
          seek(v.currentTime + a.by)
          return say(`${a.by > 0 ? '+' : '−'}${Math.abs(a.by)} s`)
        case 'jump':
          setStarted(true)
          seek(end ? a.to * end : 0)
          return say(time(end ? a.to * end : 0))
        case 'frame':
          if (!v.paused) v.pause()
          setStarted(true)
          seek(v.currentTime + a.by * FRAME)
          return say(a.by > 0 ? 'Next frame' : 'Previous frame')
        case 'volume':
          v.volume = Math.round(Math.min(1, Math.max(0, v.volume + a.by)) * 10) / 10
          if (v.volume > 0 && v.muted) v.muted = false
          return say(`Volume ${Math.round(v.volume * 100)}%`)
        case 'speed':
          v.playbackRate = nextRate(v.playbackRate, a.by)
          return say(`${v.playbackRate}×`)
      }
    },
    [length, toggle, toggleFull, toggleMute, toggleCc, togglePip, seek, say],
  )

  // One page-wide handler for every shortcut, for the active player.
  useEffect(() => {
    const me = id.current
    // The first player on a page takes the shortcuts until another one is used.
    if (activePlayer === null) activePlayer = me
    const onKey = (e: KeyboardEvent) => {
      if (activePlayer !== me || e.defaultPrevented || isTyping(e)) return
      const target = e.target as HTMLElement | null
      const inside = !!target && !!wrap.current?.contains(target)
      // The scrubber keeps its own arrow keys, and a focused button its own space.
      if (inside && target.tagName === 'INPUT' && e.key.startsWith('Arrow')) return
      if (e.key === ' ' && target?.tagName === 'BUTTON') return
      const { started: on, seen, full: isFull } = live.current
      const action = shortcutFor(e.key, { inside, live: on && (seen || isFull), full: isFull })
      if (!action) return
      e.preventDefault()
      run(action)
      wake()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (activePlayer === me) activePlayer = null
    }
  }, [run, wake])

  const claim = () => {
    activePlayer = id.current
  }

  const pct = length ? (now / length) * 100 : 0
  const loadedPct = length ? (buffered / length) * 100 : 0
  const showControls = started && (!playing || awake)

  return (
    <div className={styles.block}>
      <div
        ref={wrap}
        className={styles.player}
        data-started={started || undefined}
        data-playing={playing || undefined}
        data-controls={showControls || undefined}
        data-full={full || undefined}
        data-portrait={portrait || undefined}
        data-square={square || undefined}
        onPointerMove={wake}
        onPointerDown={() => {
          claim()
          wake()
        }}
        onFocus={claim}
        role="region"
        aria-label={`${title}, video player`}
      >
        <video
          ref={video}
          className={styles.video}
          src={src}
          poster={poster}
          preload="none"
          playsInline
          onClick={toggle}
          // The two clicks of a double click play and pause again, so the film is left as it was.
          onDoubleClick={toggleFull}
          onPlay={() => {
            claim()
            setPlaying(true)
          }}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onWaiting={() => setWaiting(true)}
          onPlaying={() => setWaiting(false)}
          onLoadedMetadata={(e) => setLength(e.currentTarget.duration)}
          onTimeUpdate={(e) => setNow(e.currentTarget.currentTime)}
          onProgress={(e) => {
            const b = e.currentTarget.buffered
            if (b.length) setBuffered(b.end(b.length - 1))
          }}
          onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        >
          {captions && <track kind="captions" src={captions} srcLang="en" label="English" />}
        </video>

        {/* Before the first play: the poster and one big neon button. */}
        <button type="button" className={styles.big} onClick={toggle} aria-label={`Play ${title}`} tabIndex={started ? -1 : 0}>
          <span className={styles.bigRing} aria-hidden="true" />
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5.5v13l10.5-6.5z" />
          </svg>
        </button>

        {flash && (
          <span key={flash.key} className={styles.flash} aria-hidden="true">
            <svg viewBox="0 0 24 24">{flash.kind === 'play' ? <path d="M8 5.5v13l10.5-6.5z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}</svg>
          </span>
        )}
        {waiting && playing && <span className={styles.spinner} aria-hidden="true" />}
        {note && (
          <span key={note.key} className={styles.note} role="status">
            {note.text}
          </span>
        )}

        {help && (
          <div className={styles.help} role="dialog" aria-label="Keyboard shortcuts" onClick={() => setHelp(false)}>
            <p className={styles.helpTitle}>Keyboard shortcuts</p>
            <dl>
              {SHORTCUTS.map((s) => (
                <div key={s.does}>
                  <dt>
                    {s.keys.map((k) => (
                      <kbd key={k}>{k}</kbd>
                    ))}
                  </dt>
                  <dd>{s.does}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.helpFoot}>Double click for full screen. Esc or ? to close.</p>
          </div>
        )}

        <div className={styles.controls} inert={!started || undefined}>
          <input
            className={styles.scrub}
            type="range"
            min={0}
            max={length || 0}
            step={0.1}
            value={now}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Seek"
            aria-valuetext={`${time(now)} of ${time(length)}`}
            style={{ '--pct': `${pct}%`, '--loaded': `${loadedPct}%` } as React.CSSProperties}
          />
          <div className={styles.row}>
            <button type="button" className={styles.btn} onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} title={playing ? 'Pause (k)' : 'Play (k)'}>
              <svg viewBox="0 0 24 24" aria-hidden="true" data-icon={playing ? 'pause' : 'play'}>
                <path className={styles.iconPlay} d="M8 5.5v13l10.5-6.5z" />
                <path className={styles.iconPause} d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
              </svg>
            </button>
            <span className={styles.time}>
              {time(now)} <em>/ {time(length)}</em>
            </span>
            <span className={styles.spacer} />
            <button type="button" className={`${styles.btn} ${styles.keys}`} onClick={() => setHelp((h) => !h)} aria-pressed={help} aria-label="Keyboard shortcuts" title="Keyboard shortcuts (?)">
              <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.stroke}>
                <path d="M3.5 7h17v10h-17zM7 10.5h.01M10.5 10.5h.01M14 10.5h.01M17 10.5h.01M8 14h8" />
              </svg>
            </button>
            {captions && (
              <button type="button" className={styles.btn} onClick={toggleCc} aria-pressed={cc} aria-label="Captions" title="Captions (c)">
                <span className={styles.cc}>CC</span>
              </button>
            )}
            <button type="button" className={styles.btn} onClick={toggleMute} aria-pressed={muted} aria-label={muted ? 'Unmute' : 'Mute'} title={muted ? 'Unmute (m)' : 'Mute (m)'}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
                {muted ? <path d="M16 9.5l5 5M21 9.5l-5 5" className={styles.stroke} /> : <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" className={styles.stroke} />}
              </svg>
            </button>
            <button type="button" className={styles.btn} onClick={toggleFull} aria-label={full ? 'Exit full screen' : 'Full screen'} title={full ? 'Exit full screen (f)' : 'Full screen (f)'}>
              <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.stroke}>
                {full ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {chapters && chapters.length > 0 && (
        <ol className={styles.chapters} aria-label="Chapters">
          {chapters.map((c, i) => {
            const end = chapters[i + 1]?.at ?? (length || Infinity)
            const here = started && now >= c.at && now < end
            return (
              <li key={c.at}>
                <button
                  type="button"
                  aria-current={here || undefined}
                  onClick={() => {
                    setStarted(true)
                    seek(c.at)
                    void video.current?.play().catch(() => {})
                  }}
                >
                  <em>{time(c.at)}</em>
                  {c.label}
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
