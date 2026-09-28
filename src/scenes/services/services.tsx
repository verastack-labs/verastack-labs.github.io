'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { services } from '@/data/services'
import { useScramble } from '@/components/use-scramble'
import { formatCounter } from '@/lib/counter'
import { activeService, demoOpenness, snapToHold } from '@/lib/services-beats'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'
import { ConfiguratorDemo } from '@/scenes/services/configurator-demo'
import styles from '@/scenes/services/services.module.css'

gsap.registerPlugin(ScrollTrigger)

const LAST = services.length
const pad = (n: number) => String(n).padStart(2, '0')

function ProofLine({ text, animate }: { text: string; animate: boolean }) {
  const ref = useScramble<HTMLElement>(text, animate)
  return (
    <span className={styles.proofLine}>
      see: <b ref={ref}>{text}</b>
    </span>
  )
}

// Desktop (full): one stage pinned for about five viewports (spec 6.02 beats).
function PinnedServices() {
  const section = useRef<HTMLElement>(null)
  const main = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = section.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: '100% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Layout effect: the pin must be reverted before React removes the pinned node.
  useLayoutEffect(() => {
    const el = section.current
    const grid = main.current
    if (!el || !grid) return
    const apply = (p: number) => {
      const o = demoOpenness(p)
      el.style.setProperty('--o', o.toFixed(3))
      grid.style.gridTemplateColumns = `minmax(max-content, ${(1.5 - o).toFixed(3)}fr) ${(1 + 1.6 * o).toFixed(3)}fr`
      el.dataset.live = String(o > 0.95)
      setOpen(o > 0)
      setActive(activeService(p))
    }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: '+=400%',
        pin: true,
        snap: { snapTo: snapToHold, delay: 0.12, duration: { min: 0.2, max: 0.5 }, ease: 'power1.inOut' },
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      })
    }, el)
    return () => ctx.revert()
  }, [])

  const service = services[active]
  const next = services[1]

  return (
    <section id="services" ref={section} className={styles.pinned} aria-labelledby="services-title">
      <div className="sr-only">
        <h2 id="services-title">Services</h2>
        <ul>
          {services.map((s) => (
            <li key={s.id}>
              {s.name}: {s.blurb} See {s.proof.join(', ')}.
            </li>
          ))}
        </ul>
      </div>
      <div ref={main} className={styles.stage}>
        <div className={styles.list}>
          <p className={styles.label}>
            /services <em>{'//'}</em> {formatCounter(active + 1, LAST)}
          </p>
          <ol className={styles.rows} aria-hidden="true">
            {services.map((s, i) => (
              <li key={s.id} className={styles.row} data-on={i === active}>
                <span className={styles.num}>{pad(i + 1)}</span>
                <span className={styles.name}>{s.name}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.right}>
          <div className={styles.desc} aria-hidden="true">
            <p>{service.blurb}</p>
            <p className={styles.proof}>
              {service.proof.map((p) => (
                <ProofLine key={`${service.id}-${p}`} text={p} animate />
              ))}
            </p>
          </div>
          <div className={styles.demo} inert={!open}>
            <ConfiguratorDemo live mounted={near} running={open} animate holdNote={`02 ${next.name.split(' ')[0].toLowerCase()}`} />
          </div>
        </div>
      </div>
    </section>
  )
}

// Phones, tablets and reduced motion: no pin, the services stack as blocks (spec 6.02, 5.1).
function StackedServices({ animate }: { animate: boolean }) {
  return (
    <section id="services" className={styles.stacked} aria-labelledby="services-title">
      <p className={styles.label}>
        /services <em>{'//'}</em> {pad(LAST)} ways we help
      </p>
      <h2 id="services-title" className={styles.stackTitle}>
        Services
      </h2>
      {services.map((s, i) => (
        <div key={s.id} className={styles.block}>
          <h3 className={styles.blockName}>
            <span className={styles.num}>{pad(i + 1)}</span>
            {s.name}
          </h3>
          <p className={styles.blockBlurb}>{s.blurb}</p>
          <p className={styles.proof}>
            {s.proof.map((p) => (
              <span key={p} className={styles.proofLine}>
                see: <b>{p}</b>
              </span>
            ))}
          </p>
          {s.lead && (
            <div className={styles.inlineDemo}>
              <ConfiguratorDemo live={false} mounted={false} running={false} animate={animate} />
            </div>
          )}
        </div>
      ))}
    </section>
  )
}

export function Services() {
  const mode = useMotionPreference()
  return mode === 'full' ? <PinnedServices /> : <StackedServices animate={mode === 'lite'} />
}
