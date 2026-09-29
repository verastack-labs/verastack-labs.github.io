import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { configurator, choiceOf, type Selection } from '@/data/configurator'
import { KEYS, LAYOUT_DEPTH, LAYOUT_WIDTH } from '@/scenes/services/keyboard-layout'
import styles from '@/scenes/services/services.module.css'

const U = 10
const PAD = 6
const W = LAYOUT_WIDTH * U + PAD * 2
const D = LAYOUT_DEPTH * U + PAD * 2
// The key lifted off its switch so the switch colour shows (J on the home row).
const LIFTED = KEYS.findIndex((k) => k.y === 2 && k.x === 7.75)

// The demo keyboard as a tilted drawing: the phone, reduced-motion and no-WebGL view (spec 6.02).
// Like the 3D board, the lifted key bobs and a new switch type runs a press wave; both are CSS, and
// static mode stops them.
export function KeyboardFlat({ selection }: { selection: Selection }) {
  // Counts switch changes; each one remounts the keys so the wave plays again. Not on first paint.
  const [wave, setWave] = useState(0)
  const firstSwitch = useRef(selection.switches)
  useEffect(() => {
    if (selection.switches === firstSwitch.current) return
    firstSwitch.current = selection.switches
    setWave((w) => w + 1)
  }, [selection.switches])

  const body = choiceOf('case', selection).color
  const caps = choiceOf('keycaps', selection).color
  const stem = choiceOf('switches', selection).color
  const lifted = KEYS[LIFTED]
  const lx = PAD + lifted.x * U
  const ly = PAD + lifted.y * U

  return (
    <div className={styles.flat}>
      <svg viewBox={`-2 -18 ${W + 4} ${D + 26}`} role="img" aria-label="Keyboard preview">
        <rect x={0} y={4} width={W} height={D} rx={7} fill="#000" opacity={0.35} />
        <rect x={0} y={0} width={W} height={D} rx={7} fill={body} />
        <rect x={0} y={0} width={W} height={D} rx={7} fill="url(#kb-sheen)" />
        <rect x={PAD - 1} y={PAD - 1} width={LAYOUT_WIDTH * U + 2} height={LAYOUT_DEPTH * U + 2} rx={2} fill="#0B0C0A" />
        <g key={wave} data-wave={wave > 0 || undefined}>
          {KEYS.map((k, i) =>
            i === LIFTED ? null : (
              <g key={i} className={styles.flatKey} style={{ '--d': `${((k.x + k.w / 2) * 0.035).toFixed(3)}s` } as CSSProperties}>
                <rect x={PAD + k.x * U + 0.6} y={PAD + k.y * U + 0.6} width={k.w * U - 1.2} height={U - 1.2} rx={1.6} fill={k.accent ? configurator.accent : caps} />
                <rect x={PAD + k.x * U + 1.8} y={PAD + k.y * U + 1.2} width={k.w * U - 3.6} height={U - 3.4} rx={1.2} fill="#fff" opacity={0.1} />
              </g>
            ),
          )}
        </g>
        <g>
          <rect x={lx + 1.5} y={ly + 1.5} width={U - 3} height={U - 3} rx={1} fill="#222419" />
          <path d={`M${lx + U / 2} ${ly + 2.8}V${ly + U - 2.8}M${lx + 2.8} ${ly + U / 2}H${lx + U - 2.8}`} stroke={stem} strokeWidth={1.6} />
        </g>
        <line x1={lx + U / 2} y1={ly - 1} x2={lx + U / 2} y2={-5} stroke="#A3A69B" strokeWidth={0.4} strokeDasharray="1 1.2" />
        <g className={styles.flatLifted}>
          <rect x={lx + 0.6} y={-15} width={U - 1.2} height={U - 1.2} rx={1.6} fill={caps} />
          <rect x={lx + 1.8} y={-14.4} width={U - 3.6} height={U - 3.4} rx={1.2} fill="#fff" opacity={0.1} />
        </g>
        <defs>
          <linearGradient id="kb-sheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity={0.14} />
            <stop offset="1" stopColor="#000" stopOpacity={0.12} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
