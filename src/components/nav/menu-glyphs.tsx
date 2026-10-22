'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, type CSSProperties, type ReactNode } from 'react'
import { spring, stepSpring, type Spring, type SpringConfig } from '@/lib/motion/spring'
import styles from '@/components/nav/full-menu.module.css'

// Line icons for what the studio does, 24 x 24, drawn with the current colour.
const ICONS: Record<string, ReactNode> = {
  video: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5v7l5.5-3.5z" />
    </>
  ),
  code: <path d="M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5M13.5 5l-3 14" />,
  browser: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="M3 9h18M6 6.8h.01M8.5 6.8h.01M11 6.8h.01" />
    </>
  ),
  cube: <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12 4 7.5" />,
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5.5 5.5M10.5 7.5v6M7.5 10.5h6" />
    </>
  ),
  sparkle: <path d="M12 3c.6 4.3 2.7 6.4 7 7-4.3.6-6.4 2.7-7 7-.6-4.3-2.7-6.4-7-7 4.3-.6 6.4-2.7 7-7z" />,
  linkedin: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M8 10.5v6M8 7.5v.01M11.5 16.5v-6M11.5 13c0-1.7 1-2.5 2.3-2.5s2.2.8 2.2 2.5v3.5" />
    </>
  ),
  cursor: <path d="M5 3.5 18.5 11l-6 1.5-2.5 6z" />,
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  clapper: (
    <>
      <rect x="3.5" y="9" width="17" height="11" rx="2" />
      <path d="M3.5 9 19 5.5l.7 3M7.5 8.1 9 5M12.5 7 14 3.9" />
    </>
  ),
  layers: <path d="m12 3.5 9 4.5-9 4.5L3 8zM3 12.5 12 17l9-4.5M3 16.5 12 21l9-4.5" />,
}

// Where each glyph floats (as a share of the menu), how big it is, how strongly it leans towards the
// highlighted link, and which sections light it up.
const GLYPHS: { icon: keyof typeof ICONS; x: number; y: number; size: number; pull: number; tags: string[] }[] = [
  { icon: 'code', x: 45, y: 21, size: 33, pull: 0.3, tags: ['services', 'products', 'process'] },
  { icon: 'video', x: 52, y: 34, size: 39, pull: 0.22, tags: ['top', 'services'] },
  { icon: 'browser', x: 42, y: 45, size: 44, pull: 0.26, tags: ['services', 'work', 'products'] },
  { icon: 'sparkle', x: 50, y: 56, size: 22, pull: 0.42, tags: ['services', 'notes'] },
  { icon: 'cube', x: 45, y: 69, size: 36, pull: 0.28, tags: ['services', 'work'] },
  { icon: 'linkedin', x: 52, y: 79, size: 26, pull: 0.34, tags: ['about', 'contact'] },
  { icon: 'search', x: 55, y: 17, size: 24, pull: 0.4, tags: ['services', 'notes'] },
  { icon: 'phone', x: 40, y: 30, size: 27, pull: 0.3, tags: ['services', 'products'] },
  { icon: 'cursor', x: 55, y: 48, size: 20, pull: 0.46, tags: ['top', 'work', 'process'] },
  { icon: 'mail', x: 39, y: 80, size: 26, pull: 0.25, tags: ['contact'] },
  { icon: 'clapper', x: 38, y: 60, size: 30, pull: 0.32, tags: ['services', 'work'] },
  { icon: 'layers', x: 54, y: 66, size: 22, pull: 0.38, tags: ['process', 'about'] },
]

// Each glyph drifts on its own slow, never-repeating path: two sine waves per axis at unrelated speeds.
const DRIFT = GLYPHS.map((_, i) => ({
  ax: 9 + (i % 4) * 3,
  ay: 11 + ((i * 7) % 5) * 2.5,
  fx: 0.21 + ((i * 13) % 7) * 0.035,
  fy: 0.17 + ((i * 5) % 6) * 0.04,
  p: i * 1.7,
}))

// Soft and heavy for the glyphs, quicker for the slash and its trail, which each lag the one before.
const GLYPH: SpringConfig = { stiffness: 38, damping: 0.72 }
const SLASH: SpringConfig = { stiffness: 210, damping: 0.74 }
const INDEX: SpringConfig = { stiffness: 150, damping: 0.76 }
const BAR: SpringConfig = { stiffness: 105, damping: 0.8 }
const POINTER: SpringConfig = { stiffness: 22, damping: 1 }

// The furthest a glyph leans towards a link, in pixels.
const MAX_LEAN = 150

type Pair = { x: Spring; y: Spring }
const pair = (x = 0, y = 0): Pair => ({ x: spring(x), y: spring(y) })

export type GlyphHandle = {
  // Highlights a section link: the slash slides beside it, the glyphs lean towards it and the ones
  // that belong to the section light up.
  aim: (link: HTMLElement, section: string, index: number) => void
  // Nothing highlighted: the slash rests beside `link` (the current section) and the glyphs drift home.
  rest: (link: HTMLElement | null, index: number) => void
}

// The moving layer behind the full-screen menu: faded line icons floating like Unown, the lime slash
// that marks the highlighted section, and a faint glow trailing the pointer. One animation loop moves
// everything on springs while the menu is open, so fast sweeps stay fluid.
export const MenuGlyphs = forwardRef<GlyphHandle, { open: boolean }>(function MenuGlyphs({ open }, ref) {
  const field = useRef<HTMLDivElement>(null)
  const items = useRef<(HTMLSpanElement | null)[]>([])
  const slash = useRef<HTMLSpanElement>(null)
  const index = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const glow = useRef<HTMLSpanElement>(null)

  // Targets the loop chases, and the springs chasing them.
  const state = useRef({
    lean: GLYPHS.map(() => ({ x: 0, y: 0 })),
    glyphs: GLYPHS.map(() => pair()),
    rail: { x: 0, y: 0, placed: false },
    slash: pair(),
    index: pair(),
    bar: pair(),
    pointer: { x: 0, y: 0, seen: false },
    glow: pair(),
  })

  // Where the slash sits for a link: just past the end of its word (which slides right on hover),
  // centred on the line, in the field's coordinates.
  const railFor = (link: HTMLElement, hovered: boolean) => {
    const box = field.current?.getBoundingClientRect()
    const word = link.querySelector<HTMLElement>('[data-word]')
    if (!box || !word) return null
    const fs = parseFloat(getComputedStyle(link).fontSize) || 60
    const r = word.getBoundingClientRect()
    const l = link.getBoundingClientRect()
    return { x: r.right - 0.7 * fs + (hovered ? 0.55 * fs : 0) + 0.32 * fs - box.left, y: l.top + l.height / 2 - box.top }
  }

  const place = (link: HTMLElement | null, i: number, hovered: boolean) => {
    const s = state.current
    const p = link && railFor(link, hovered)
    if (!p) return
    s.rail.x = p.x
    s.rail.y = p.y
    // The first placement after opening jumps there; the slash fades in rather than flying across.
    if (!s.rail.placed) {
      s.rail.placed = true
      for (const k of [s.slash, s.index, s.bar]) {
        k.x.x = p.x
        k.y.x = p.y
        k.x.v = k.y.v = 0
      }
    }
    if (index.current) index.current.textContent = String(i).padStart(2, '0')
    return p
  }

  useImperativeHandle(ref, () => ({
    aim(link, section, i) {
      const p = place(link, i, true)
      const box = field.current
      if (!p || !box) return
      // The glyphs lean towards a point a little past the slash, so they gather beside the word
      // rather than over it.
      const ax = p.x + 90
      const ay = p.y
      items.current.forEach((el, k) => {
        if (!el) return
        const g = GLYPHS[k]
        const hx = (g.x / 100) * box.clientWidth
        const hy = (g.y / 100) * box.clientHeight
        let dx = (ax - hx) * g.pull
        let dy = (ay - hy) * g.pull
        const len = Math.hypot(dx, dy)
        if (len > MAX_LEAN) {
          dx *= MAX_LEAN / len
          dy *= MAX_LEAN / len
        }
        state.current.lean[k] = { x: dx, y: dy }
        el.toggleAttribute('data-on', g.tags.includes(section))
      })
    },
    rest(link, i) {
      place(link, i, false)
      state.current.lean = GLYPHS.map(() => ({ x: 0, y: 0 }))
      items.current.forEach((el) => el?.removeAttribute('data-on'))
    },
  }))

  useEffect(() => {
    const box = field.current
    if (!open || !box) return
    const s = state.current
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'static'

    // Each opening, the glyphs float up into place from a little below.
    s.glyphs.forEach((g, k) => {
      g.x.x = 0
      g.y.x = still ? 0 : 36 + (k % 3) * 14
      g.x.v = g.y.v = 0
    })
    s.rail.placed = false
    s.pointer.seen = false

    const menu = box.parentElement
    const halo = glow.current
    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect()
      s.pointer.x = e.clientX - r.left
      s.pointer.y = e.clientY - r.top
      if (!s.pointer.seen) {
        s.pointer.seen = true
        s.glow.x.x = s.pointer.x
        s.glow.y.x = s.pointer.y
        halo?.setAttribute('data-on', '')
      }
    }
    menu?.addEventListener('pointermove', onMove)

    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = still ? 1 : (now - last) / 1000
      last = now
      const t = now / 1000
      const w = box.clientWidth
      const h = box.clientHeight

      // The pointer, smoothed, tilts the whole field a touch: bigger glyphs (nearer) move more.
      stepSpring(s.glow.x, s.pointer.x, POINTER, dt)
      stepSpring(s.glow.y, s.pointer.y, POINTER, dt)
      const px = s.pointer.seen ? s.glow.x.x / w - 0.5 : 0
      const py = s.pointer.seen ? s.glow.y.x / h - 0.5 : 0
      if (glow.current) glow.current.style.transform = `translate3d(${s.glow.x.x}px, ${s.glow.y.x}px, 0)`

      items.current.forEach((el, k) => {
        if (!el) return
        const g = s.glyphs[k]
        const d = DRIFT[k]
        const depth = GLYPHS[k].size / 44
        stepSpring(g.x, s.lean[k].x - px * 34 * depth, GLYPH, dt)
        stepSpring(g.y, s.lean[k].y - py * 26 * depth, GLYPH, dt)
        const fx = still ? 0 : d.ax * (Math.sin(t * d.fx + d.p) + 0.45 * Math.sin(t * d.fx * 2.3 + d.p * 0.6))
        const fy = still ? 0 : d.ay * (Math.sin(t * d.fy + d.p * 1.3) + 0.4 * Math.sin(t * d.fy * 1.9 + d.p))
        // Glyphs bank into their motion and sway gently at rest.
        const tilt = (still ? 0 : 5 * Math.sin(t * d.fy * 0.8 + d.p)) + Math.max(-14, Math.min(14, g.x.v * 0.06))
        el.style.transform = `translate3d(${(g.x.x + fx).toFixed(2)}px, ${(g.y.x + fy).toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg)`
      })

      // The slash leads, the index and bar follow a beat behind, so the rail moves as a soft chain.
      const chain: [Pair, SpringConfig, HTMLElement | null][] = [
        [s.slash, SLASH, slash.current],
        [s.index, INDEX, index.current],
        [s.bar, BAR, bar.current],
      ]
      for (const [k, cfg, el] of chain) {
        stepSpring(k.x, s.rail.x, cfg, dt)
        stepSpring(k.y, s.rail.y, cfg, dt)
        if (el) {
          const lean = Math.max(-18, Math.min(18, k.y.v * 0.025))
          el.style.transform = `translate3d(${k.x.x.toFixed(2)}px, ${k.y.x.toFixed(2)}px, 0) skewY(${lean.toFixed(2)}deg)`
        }
      }

      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      menu?.removeEventListener('pointermove', onMove)
      halo?.removeAttribute('data-on')
    }
  }, [open])

  return (
    <div ref={field} className={styles.glyphs} aria-hidden="true">
      <span ref={glow} className={styles.glow} />
      {GLYPHS.map((g, i) => (
        <span
          key={g.icon}
          ref={(el) => {
            items.current[i] = el
          }}
          className={styles.glyph}
          style={{ left: `${g.x}%`, top: `${g.y}%`, width: g.size, height: g.size, '--k': i, '--size': `${g.size}px` } as CSSProperties}
        >
          <svg viewBox="0 0 24 24">{ICONS[g.icon]}</svg>
        </span>
      ))}
      <span ref={slash} className={styles.railSlash}>
        /
      </span>
      <span ref={index} className={styles.railIndex}>
        00
      </span>
      <span ref={bar} className={styles.railBar} />
    </div>
  )
})
