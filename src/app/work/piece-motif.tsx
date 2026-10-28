import type { CSSProperties, JSX } from 'react'
import type { PieceMotif } from '@/data/pieces'
import styles from '@/app/work/piece.module.css'

// A drawing for the hero, from the piece's own world. Decoration only: hidden from screen readers,
// drawn in the piece's colours, and still when the visitor prefers reduced motion.
const line = 'color-mix(in srgb, var(--p-fg) 30%, transparent)'
const faint = 'color-mix(in srgb, var(--p-fg) 12%, transparent)'
const accent = 'var(--p-accent)'
const s = (o: CSSProperties) => o

// The same "random" every build, so the static export never changes on its own.
const noise = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function Typing() {
  return (
    <svg viewBox="0 0 320 240">
      <rect x="20" y="24" width="210" height="44" rx="22" style={s({ fill: 'none', stroke: line })} />
      <rect x="40" y="42" width="150" height="8" rx="4" style={s({ fill: faint })} />
      <rect x="90" y="88" width="210" height="60" rx="22" style={s({ fill: accent })} />
      <rect x="110" y="106" width="160" height="8" rx="4" style={s({ fill: 'var(--p-on-accent)', opacity: 0.6 })} />
      <rect x="110" y="122" width="110" height="8" rx="4" style={s({ fill: 'var(--p-on-accent)', opacity: 0.6 })} />
      <rect x="20" y="168" width="170" height="44" rx="22" style={s({ fill: 'none', stroke: line })} />
      <rect x="40" y="186" width="90" height="8" rx="4" style={s({ fill: faint })} />
      <rect className={styles.caret} x="138" y="180" width="3" height="20" style={s({ fill: accent })} />
    </svg>
  )
}

function Slots() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  return (
    <svg viewBox="0 0 320 240">
      {days.map((d, c) => (
        <text key={d} x={28 + c * 60} y="28" style={s({ fill: 'var(--p-muted)', font: '500 11px var(--font-piece-mono, var(--font-mono))' })}>
          {d}
        </text>
      ))}
      {Array.from({ length: 20 }, (_, i) => {
        const c = i % 5
        const r = Math.floor(i / 5)
        const on = i === 7 || i === 13
        return <rect key={i} x={20 + c * 60} y={44 + r * 46} width="52" height="34" rx="10" style={s(on ? { fill: accent } : { fill: 'none', stroke: i % 3 === 0 ? faint : line })} />
      })}
    </svg>
  )
}

function Notice() {
  return (
    <svg viewBox="0 0 320 240">
      <g transform="rotate(-3 160 120)">
        <rect x="58" y="34" width="210" height="170" style={s({ fill: accent })} />
        <rect x="50" y="26" width="210" height="170" style={s({ fill: 'var(--p-bg)', stroke: 'var(--p-fg)', strokeWidth: 3 })} />
        <rect x="72" y="52" width="120" height="14" style={s({ fill: 'var(--p-fg)' })} />
        <rect x="72" y="78" width="160" height="8" style={s({ fill: faint })} />
        <rect x="72" y="94" width="140" height="8" style={s({ fill: faint })} />
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={66 + i * 28} y1="140" x2={66 + i * 28} y2="196" style={s({ stroke: line, strokeDasharray: '4 4' })} />
        ))}
        <circle cx="155" cy="26" r="7" style={s({ fill: accent, stroke: 'var(--p-fg)', strokeWidth: 2 })} />
      </g>
    </svg>
  )
}

// Contour lines, a triangulation figure with its three stations, and a bench mark.
function Survey() {
  return (
    <svg viewBox="0 0 320 240">
      {[0, 1, 2, 3, 4].map((k) => (
        <path
          key={k}
          d={`M ${120 - k * 24} 130 C ${100 - k * 22} ${70 - k * 14}, ${200 + k * 20} ${60 - k * 16}, ${210 + k * 22} ${115 - k * 2} S ${180 + k * 10} ${190 + k * 12}, ${120 - k * 24} 130 Z`}
          style={s({ fill: 'none', stroke: k === 2 ? accent : line, strokeWidth: k === 2 ? 1.5 : 1 })}
        />
      ))}
      <path d="M 70 200 L 160 70 L 260 190 Z" style={s({ fill: 'none', stroke: line, strokeDasharray: '6 5' })} />
      {[
        [70, 200],
        [160, 70],
        [260, 190],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="6" style={s({ fill: 'var(--p-bg)', stroke: accent, strokeWidth: 1.5 })} />
          <circle cx={x} cy={y} r="1.6" style={s({ fill: accent })} />
        </g>
      ))}
      <path d="M 24 226 h 26 M 37 226 v -14 M 30 219 l 7 -7 l 7 7" style={s({ fill: 'none', stroke: line })} />
    </svg>
  )
}

// A contribution graph whose three empty weeks fill in.
function Commits() {
  const cols = 22
  return (
    <svg viewBox="0 0 320 240">
      {Array.from({ length: cols * 7 }, (_, i) => {
        const c = Math.floor(i / 7)
        const r = i % 7
        const gap = c >= 12 && c <= 14
        const n = noise(i)
        const level = gap ? 0.9 : n < 0.35 ? 0 : n < 0.6 ? 0.25 : n < 0.85 ? 0.5 : 0.8
        return (
          <rect
            key={i}
            className={gap ? styles.fill : undefined}
            style={s({ fill: level ? accent : faint, opacity: level || 1, animationDelay: gap ? `${(c - 12) * 0.25 + r * 0.05}s` : undefined })}
            x={6 + c * 14}
            y={60 + r * 14}
            width="11"
            height="11"
            rx="2.5"
          />
        )
      })}
      <path d="M 174 44 h 42" style={s({ stroke: accent, strokeWidth: 1.5 })} />
    </svg>
  )
}

// A live speed graph over three transfers.
function Speed() {
  const pts = Array.from({ length: 29 }, (_, i) => [10 + i * 10.7, 170 - (40 + Math.sin(i / 3) * 26 + noise(i + 3) * 46 + (i > 18 ? 30 : 0))] as const)
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  return (
    <svg viewBox="0 0 320 240">
      {[50, 90, 130, 170].map((y) => (
        <line key={y} x1="10" y1={y} x2="310" y2={y} style={s({ stroke: faint })} />
      ))}
      <path d={`${d} L 310 170 L 10 170 Z`} style={s({ fill: accent, opacity: 0.16 })} />
      <path d={d} style={s({ fill: 'none', stroke: accent, strokeWidth: 2 })} />
      {[70, 38, 92].map((w, i) => (
        <g key={i}>
          <rect x={10 + i * 104} y="194" width="92" height="6" rx="3" style={s({ fill: faint })} />
          <rect x={10 + i * 104} y="194" width={w} height="6" rx="3" style={s({ fill: i === 2 ? line : accent })} />
        </g>
      ))}
    </svg>
  )
}

const drawings: Record<PieceMotif, () => JSX.Element> = { typing: Typing, slots: Slots, notice: Notice, survey: Survey, commits: Commits, speed: Speed }

export function PieceMotifArt({ motif }: { motif: PieceMotif }) {
  const Drawing = drawings[motif]
  return (
    <div className={styles.motif} aria-hidden="true">
      <Drawing />
    </div>
  )
}
