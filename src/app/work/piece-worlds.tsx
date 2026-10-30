'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Worlds } from '@/data/pieces'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'
import styles from '@/app/work/worlds.module.css'

const clamp = (n: number) => Math.min(1, Math.max(0, n))

// One product, several directions. A pinned phone shows each direction's home screen, and as its
// chapter scrolls by, the next one wipes up over the last while the band takes on that direction's
// colours. Then one screen at a time, all directions side by side.
export function PieceWorlds({ slug, worlds: { worlds, screens, sheets } }: { slug: string; worlds: Worlds }) {
  const mode = useMotionPreference()
  const still = mode === 'static'
  const scene = useRef<HTMLDivElement>(null)
  const layers = useRef<(HTMLImageElement | null)[]>([])
  const [active, setActive] = useState(0)
  const [screen, setScreen] = useState(screens[0].id)
  const [sheet, setSheet] = useState(0)
  const src = (world: string, id: string) => `/work/${slug}/${world}-${id}.webp`

  // Progress runs from 0 at the first chapter to worlds.length - 1 at the last, measured from the
  // middle of the viewport, and is written straight to each layer's clip so it follows the scroll.
  useEffect(() => {
    const el = scene.current
    if (!el) return
    const chapters = [...el.querySelectorAll<HTMLElement>('[data-chapter]')]
    let frame = 0
    const update = () => {
      frame = 0
      const mid = window.innerHeight / 2
      let p = 0
      chapters.forEach((c, i) => {
        if (i === 0) return
        const r = c.getBoundingClientRect()
        // A chapter's wipe runs while its top climbs from the bottom of the viewport to the middle.
        p += clamp((window.innerHeight - r.top) / (window.innerHeight - mid))
      })
      layers.current.forEach((img, i) => {
        if (!img || i === 0) return
        const r = still ? (p >= i - 0.5 ? 1 : 0) : clamp(p - (i - 1))
        img.style.clipPath = `inset(${((1 - r) * 100).toFixed(2)}% 0 0 0 round var(--w-r))`
      })
      setActive(Math.min(worlds.length - 1, Math.round(p)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [still, worlds.length])

  const w = worlds[active]
  const vars = { '--w-bg': w.bg, '--w-fg': w.fg, '--w-muted': w.muted, '--w-accent': w.accent } as CSSProperties

  return (
    <>
      <div ref={scene} className={styles.scene} style={vars} data-still={still || undefined}>
        <div className={styles.stage}>
          <div className={styles.phone}>
            {worlds.map((x, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={x.key}
                ref={(n) => {
                  layers.current[i] = n
                }}
                src={src(x.key, 'home')}
                alt={i === active ? `${x.name}, the home screen` : ''}
                aria-hidden={i === active ? undefined : true}
                width={390}
                height={844}
                loading={i === 0 ? 'eager' : 'lazy'}
                style={i ? { clipPath: 'inset(100% 0 0 0)' } : undefined}
              />
            ))}
          </div>
          <ol className={styles.rail} aria-hidden="true">
            {worlds.map((x, i) => (
              <li key={x.key} data-on={i === active || undefined}>
                <span>{i + 1}</span>
                {x.name}
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.chapters}>
          {worlds.map((x, i) => (
            <article key={x.key} className={styles.chapter} data-chapter data-on={i === active || undefined}>
              <p className={styles.num}>
                {String(i + 1).padStart(2, '0')} <em>{'//'}</em> {x.flow}
              </p>
              <h3 className={styles.name}>{x.name}</h3>
              <p className={styles.wline}>{x.line}</p>
              <p className={styles.world}>{x.world}</p>
              <dl className={styles.system}>
                <div>
                  <dt>Type</dt>
                  <dd>{x.type}</dd>
                </div>
                <div>
                  <dt>Colour</dt>
                  <dd>{x.colour}</dd>
                </div>
                <div>
                  <dt>Signature</dt>
                  <dd>{x.signature}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.compare}>
        <div className={styles.compareHead}>
          <p className={styles.compareTitle}>
            Same screen, <em>{worlds.length} worlds.</em>
          </p>
          <div className={styles.tabs} role="group" aria-label="Pick a screen">
            {screens.map((s) => (
              <button key={s.id} type="button" aria-pressed={s.id === screen} onClick={() => setScreen(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.row}>
          {worlds.map((x, i) => {
            const label = screens.find((s) => s.id === screen)?.label ?? screen
            return (
              <figure key={x.key} className={styles.cell} style={{ '--i': i } as CSSProperties}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={screen} src={src(x.key, screen)} alt={`${x.name}, the ${label.toLowerCase()} screen`} width={390} height={844} loading="lazy" />
                <figcaption>
                  <b>{x.name}</b> {x.flow}
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>

      {sheets && (
        <div className={styles.sheets}>
          <div className={styles.compareHead}>
            <p className={styles.compareTitle}>
              The system <em>behind each.</em>
            </p>
            <div className={styles.tabs} role="group" aria-label="Pick a direction">
              {worlds.map((x, i) => (
                <button key={x.key} type="button" aria-pressed={i === sheet} onClick={() => setSheet(i)}>
                  {x.name}
                </button>
              ))}
            </div>
          </div>
          {/* A tall sheet scrolls inside its frame, so the page keeps its pace. */}
          <div className={styles.sheetFrame} tabIndex={0} aria-label={`${worlds[sheet].name} design system, scrollable`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={worlds[sheet].key} src={src(worlds[sheet].key, 'system')} alt={`${worlds[sheet].name} design system: colour, type, spacing, components, illustration, icons and motion`} width={1600} loading="lazy" />
          </div>
          <a className={styles.sheetLink} href={src(worlds[sheet].key, 'system')} target="_blank" rel="noreferrer">
            Open the {worlds[sheet].name} sheet full size ↗
          </a>
        </div>
      )}
    </>
  )
}
