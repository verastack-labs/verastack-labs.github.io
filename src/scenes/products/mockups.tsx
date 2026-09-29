'use client'

import { useEffect, useRef, useState } from 'react'
import type { Product } from '@/data/products'
import styles from '@/scenes/products/mockups.module.css'

// Drawn stand-ins for each app, in its own palette (spec 6.04). Motion is CSS only and stops in
// static mode.

// Origan: a four-year longitudinal profile in survey notation, the language of its own page. Its
// brief allows only partial, synthetic imagery, so this is a drawing, not a dashboard.
const SEMESTERS = [96, 90, 82, 72, 62, 50, 38, 24]
const PROFILE = `M0 104 ${SEMESTERS.map((y, i) => `L${20 + i * 40} ${y}`).join(' ')}`
const BENCHMARKS = [
  { at: 1, mark: 'I' },
  { at: 3, mark: 'II' },
  { at: 5, mark: 'III' },
  { at: 7, mark: 'IV' },
]

function Origan() {
  return (
    <div className={`${styles.win} ${styles.origan}`}>
      <div className={styles.titlebar}>
        <i />
        <i />
        <i />
        <span>origan · profile</span>
      </div>
      <div className={styles.orBody}>
        <div className={styles.orRow}>
          <span>longitudinal section</span>
          <span>
            ch <b>5+400</b>
          </span>
        </div>
        <svg className={styles.orPlot} viewBox="0 0 320 120" preserveAspectRatio="none">
          <g className={styles.contours}>
            <path d="M-20 34 C 60 14, 140 54, 340 22" />
            <path d="M-20 58 C 80 36, 170 80, 340 48" />
            <path d="M-20 82 C 70 64, 190 100, 340 74" />
          </g>
          <path className={styles.profile} d={PROFILE} pathLength={1} />
          {BENCHMARKS.map((b) => {
            const x = 20 + b.at * 40
            const y = SEMESTERS[b.at]
            return (
              <g key={b.mark} className={styles.benchmark}>
                <path d={`M${x - 4} ${y + 7} L${x} ${y} L${x + 4} ${y + 7} Z`} />
                <text x={x} y={y - 6}>
                  {b.mark}
                </text>
              </g>
            )
          })}
        </svg>
        <div className={styles.orTicks}>
          {SEMESTERS.map((_, i) => (
            <span key={i} data-now={i === 5 || undefined}>
              S{i + 1}
            </span>
          ))}
        </div>
        <div className={styles.orRow}>
          <span>
            benchmark <b>III</b> · readiness
          </span>
          <span className={styles.orChip}>year III of IV</span>
        </div>
      </div>
    </div>
  )
}

const TORRENTS = [
  { name: 'ubuntu-24.04-desktop-amd64.iso', state: '12.4 MB/s', from: 38, to: 92 },
  { name: 'archlinux-2026.09.01-x86_64.iso', state: '8.1 MB/s', from: 6, to: 64 },
  { name: 'debian-12.7.0-amd64-netinst.iso', state: 'seeding', from: 100, to: 100 },
  { name: 'fedora-workstation-41.iso', state: 'queued', from: 0, to: 0 },
]

function Rigseed() {
  return (
    <div className={`${styles.win} ${styles.rigseed}`}>
      <div className={styles.titlebar}>
        <i />
        <i />
        <i />
        <span>rigseed</span>
      </div>
      <div className={styles.rsBody}>
        <div className={styles.rsSide}>
          all · <b>4</b>
          <br />
          downloading
          <br />
          seeding
          <br />
          completed
        </div>
        <div className={styles.rsList}>
          {TORRENTS.map((t) => (
            <div key={t.name} className={styles.torrent}>
              <div className={styles.torrentName}>
                <span>{t.name}</span>
                <span>{t.state}</span>
              </div>
              <div className={styles.bar}>
                <i style={{ '--from': t.from / 100, '--to': t.to / 100 } as React.CSSProperties} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// A deterministic contribution graph: 38 weeks, with gaps that fill in on a loop.
const WEEKS = 38
const CELLS = Array.from({ length: WEEKS * 7 }, (_, i) => {
  // Integer hash, so the server and every browser draw the same graph.
  const r = (Math.imul(i + 1, 2654435761) >>> 0) / 4294967296
  const level = r < 0.45 ? 0 : r < 0.72 ? 1 : r < 0.9 ? 2 : 3
  // About one cell in six is a gap that Riggit backfills.
  const gap = level === 0 && (i * 7) % 6 === 0
  return { level: gap ? 2 : level, gap, delay: ((i * 37) % 60) / 10 }
})

function Riggit() {
  return (
    <div className={`${styles.win} ${styles.riggit}`}>
      <div className={styles.titlebar}>
        <i />
        <i />
        <i />
        <span>riggit</span>
      </div>
      <div className={styles.rgBody}>
        <div className={styles.rgRow}>
          <span>verastack/riggit</span>
          <span>2026</span>
        </div>
        <div className={styles.graph}>
          {CELLS.map((c, i) => (
            <i
              key={i}
              data-level={c.level}
              data-gap={c.gap || undefined}
              style={c.gap ? ({ '--delay': `${c.delay}s` } as React.CSSProperties) : undefined}
            />
          ))}
        </div>
        <div className={styles.rgRow}>
          <span>
            commit at <b>2026-03-14 22:40</b>
          </span>
          <span className={styles.chip}>backfill ↵</span>
        </div>
      </div>
    </div>
  )
}

function Mehfil() {
  return (
    <div className={styles.phone}>
      <div className={styles.phoneTop}>
        <span>mehfil</span>
        <span>4:12 pm</span>
      </div>
      <div className={styles.event}>
        <h4>Chai break?</h4>
        <p>4:30 pm · tapri near gate 2</p>
        <div className={styles.who}>
          <b style={{ background: '#E7A33A' }} />
          <b style={{ background: '#B93E29' }} />
          <b style={{ background: '#8FB0CB' }} />
        </div>
      </div>
      <div className={`${styles.event} ${styles.eventDim}`}>
        <h4>Cards tonight</h4>
        <p>9:00 pm · 5 going</p>
      </div>
      <span className={styles.imIn}>I&apos;m in</span>
    </div>
  )
}

export function ProductMockup({ id }: { id: Product['id'] }) {
  const root = useRef<HTMLDivElement>(null)
  const [play, setPlay] = useState(false)
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setPlay(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={root} className={styles.mockup} data-play={play} aria-hidden="true">
      {id === 'origan' ? <Origan /> : id === 'rigseed' ? <Rigseed /> : id === 'riggit' ? <Riggit /> : <Mehfil />}
    </div>
  )
}
