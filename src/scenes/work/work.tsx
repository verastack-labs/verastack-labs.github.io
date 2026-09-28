'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { headliners, roleLabel, type WorkEntry } from '@/data/work'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'
import { introAlpha, reelFrames, workHeadline } from '@/lib/reel'
import { FlowingList } from '@/scenes/work/flowing-list'
import { ReelMedia } from '@/scenes/work/reel-media'
import styles from '@/scenes/work/work.module.css'

gsap.registerPlugin(ScrollTrigger)

const headline = workHeadline(headliners.length)

function Intro() {
  return (
    <>
      <p className={styles.label}>
        /work <em>{'//'}</em> our founder has worked with
      </p>
      <h2 className={styles.headline}>{headline}</h2>
    </>
  )
}

function Credit({ entry }: { entry: WorkEntry }) {
  return (
    <div className={styles.meta}>
      <h3 className={styles.name}>
        {entry.client}
        <span>{entry.project}</span>
      </h3>
      <p className={styles.credit}>
        {entry.year} · <b>{roleLabel(entry.role)}</b>
        <br />
        {entry.stack.join(' · ')}
        <br />
        {entry.liveUrl && (
          <a href={entry.liveUrl} target="_blank" rel="noopener">
            visit live ↗
          </a>
        )}
        {entry.caseStudyUrl && (
          <>
            {' · '}
            <a href={entry.caseStudyUrl} target="_blank" rel="noopener">
              case study ↗
            </a>
          </>
        )}
      </p>
    </div>
  )
}

// Desktop (full): each headliner grows from a framed card to full bleed while the stage is pinned.
function Reel() {
  const stage = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(-1)

  // Layout effect: the pin must be reverted before React removes the pinned node.
  useLayoutEffect(() => {
    const el = stage.current
    if (!el) return
    const layers = [...el.querySelectorAll<HTMLElement>('[data-reel]')]
    const intro = el.querySelector<HTMLElement>('[data-intro]')!
    const apply = (p: number, active: boolean) => {
      const frames = reelFrames(p, layers.length)
      frames.forEach((f, i) => {
        layers[i].style.setProperty('--a', f.alpha.toFixed(3))
        layers[i].style.setProperty('--g', f.grow.toFixed(3))
        layers[i].inert = f.alpha < 0.5
      })
      intro.style.opacity = introAlpha(p, layers.length).toFixed(3)
      const visible = frames.findIndex((f) => f.alpha > 0.5)
      setPlaying(active ? visible : -1)
    }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: `+=${layers.length * 150}%`,
        pin: true,
        onUpdate: (self) => apply(self.progress, self.isActive),
        onRefresh: (self) => apply(self.progress, self.isActive),
        onToggle: (self) => apply(self.progress, self.isActive),
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={stage} className={styles.stage}>
      <div className={styles.intro} data-intro>
        <Intro />
      </div>
      {headliners.map((w, i) => (
        <div key={w.id} className={styles.layer} data-reel>
          <div className={styles.frame}>
            <ReelMedia entry={w} playing={playing === i} />
          </div>
          <Credit entry={w} />
        </div>
      ))}
    </div>
  )
}

// Phones and reduced motion: no pin; headliners are full-width cards (spec 6.03).
function Cards({ autoplay }: { autoplay: boolean }) {
  const [visible, setVisible] = useState<string | null>(null)
  const list = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!autoplay || !list.current) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = (e.target as HTMLElement).dataset.id!
          setVisible((v) => (e.isIntersecting ? id : v === id ? null : v))
        }
      },
      { threshold: 0.5 },
    )
    list.current.querySelectorAll('[data-id]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [autoplay])

  return (
    <div className={styles.cards} ref={list}>
      <Intro />
      {headliners.map((w) => (
        <article key={w.id} className={styles.card} data-id={w.id}>
          <div className={styles.cardMedia}>
            <ReelMedia entry={w} playing={visible === w.id} />
          </div>
          <Credit entry={w} />
        </article>
      ))}
    </div>
  )
}

export function Work() {
  const mode = useMotionPreference()
  return (
    <section id="work" className={styles.work}>
      {mode === 'full' ? <Reel /> : <Cards autoplay={mode === 'lite'} />}
      <FlowingList marquee={mode === 'full'} />
    </section>
  )
}
