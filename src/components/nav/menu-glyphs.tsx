'use client'

import { forwardRef, useImperativeHandle, useRef, type CSSProperties, type ReactNode } from 'react'
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

// Where each glyph floats (as a share of the menu), how big it is, how strongly it is drawn to the
// highlighted link, and which sections light it up.
const GLYPHS: { icon: keyof typeof ICONS; x: number; y: number; size: number; pull: number; tags: string[] }[] = [
  { icon: 'code', x: 47, y: 14, size: 44, pull: 0.32, tags: ['services', 'products', 'process'] },
  { icon: 'video', x: 58, y: 30, size: 52, pull: 0.22, tags: ['top', 'services'] },
  { icon: 'browser', x: 42, y: 44, size: 58, pull: 0.4, tags: ['services', 'work', 'products'] },
  { icon: 'sparkle', x: 55, y: 58, size: 30, pull: 0.5, tags: ['services', 'notes'] },
  { icon: 'cube', x: 46, y: 74, size: 48, pull: 0.28, tags: ['services', 'work'] },
  { icon: 'linkedin', x: 59, y: 86, size: 34, pull: 0.36, tags: ['about', 'contact'] },
  { icon: 'search', x: 63, y: 9, size: 32, pull: 0.45, tags: ['services', 'notes'] },
  { icon: 'phone', x: 38, y: 25, size: 36, pull: 0.3, tags: ['services', 'products'] },
  { icon: 'cursor', x: 64, y: 47, size: 26, pull: 0.55, tags: ['top', 'work', 'process'] },
  { icon: 'mail', x: 37, y: 88, size: 34, pull: 0.25, tags: ['contact'] },
  { icon: 'clapper', x: 35, y: 62, size: 40, pull: 0.34, tags: ['services', 'work'] },
  { icon: 'layers', x: 61, y: 70, size: 30, pull: 0.42, tags: ['process', 'about'] },
]

export type GlyphHandle = { aim: (link: HTMLElement | null, section: string | null) => void }

// The glyphs snap to fixed heights: each move lands on this step grid, so every link has its own set
// of positions rather than a smooth glide.
const STEP = 28

// Faded line icons floating in the menu, bobbing on their own like Unown. When a link is
// highlighted they snap part of the way towards it, on a step grid, and the ones that belong to that
// section light up in neon. `aim(null)` sends them back.
export const MenuGlyphs = forwardRef<GlyphHandle>(function MenuGlyphs(_, ref) {
  const field = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => ({
    aim(link, section) {
      const box = field.current
      const items = box?.querySelectorAll<HTMLElement>('[data-glyph]')
      if (!box || !items) return
      const r = link?.getBoundingClientRect()
      const y = r ? r.top + r.height / 2 - box.getBoundingClientRect().top : null
      items.forEach((el, i) => {
        const g = GLYPHS[i]
        const centre = el.offsetTop + el.offsetHeight / 2
        const pull = y === null ? 0 : Math.round(((y - centre) * g.pull) / STEP) * STEP
        el.style.setProperty('--pull', `${pull}px`)
        el.toggleAttribute('data-on', !!section && g.tags.includes(section))
      })
    },
  }))

  return (
    <div ref={field} className={styles.glyphs} aria-hidden="true">
      {GLYPHS.map((g, i) => (
        <span
          key={g.icon}
          data-glyph
          className={styles.glyph}
          style={{ left: `${g.x}%`, top: `${g.y}%`, width: g.size, height: g.size, '--d': `${5 + (i % 5) * 1.3}s`, '--k': i, '--size': `${g.size}px` } as CSSProperties}
        >
          <svg viewBox="0 0 24 24">{ICONS[g.icon]}</svg>
        </span>
      ))}
    </div>
  )
})
