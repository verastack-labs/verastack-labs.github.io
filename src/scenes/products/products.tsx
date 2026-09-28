'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { products, type Product } from '@/data/products'
import { tokens } from '@/styles/tokens'
import { handoverFrame, hexToRgb } from '@/lib/handover'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'
import { ProductMockup } from '@/scenes/products/mockups'
import styles from '@/scenes/products/products.module.css'

gsap.registerPlugin(ScrollTrigger)

const HEADLINE = 'Three products. Three brands. One studio.'
const SWAP_MS = 3200

function Label() {
  return (
    <p className={styles.label}>
      /products <em>{'//'}</em> and we build our own
    </p>
  )
}

function Cta({ product }: { product: Product }) {
  const style = { background: product.palette.accent, color: product.palette.onAccent }
  const cls = `${styles.cta} ${product.light ? styles.ctaBrutal : ''}`
  return product.url ? (
    <a className={cls} style={style} href={product.url} target="_blank" rel="noopener">
      {product.cta}
    </a>
  ) : (
    <span className={cls} style={style}>
      {product.cta}
    </span>
  )
}

function Copy({ product }: { product: Product }) {
  return (
    <div className={styles.copy}>
      <p className={styles.kicker}>
        /products/{product.id} · {product.platform}
      </p>
      <h3 className={styles.pitch}>{product.pitch}</h3>
      <p className={styles.line}>{product.line}</p>
      <p className={styles.meta}>{product.meta}</p>
      <Cta product={product} />
    </div>
  )
}

// Desktop (full): the pinned stage hands itself to each product's palette in turn (spec 6.04).
function Handover() {
  const section = useRef<HTMLElement>(null)
  const [stop, setStop] = useState(0)

  // Layout effect: the pin must be reverted before React removes the pinned node.
  useLayoutEffect(() => {
    const el = section.current
    if (!el) return
    const panels = [...el.querySelectorAll<HTMLElement>('[data-panel]')]
    const intro = el.querySelector<HTMLElement>('[data-intro]')!
    const palettes = [
      { bg: hexToRgb(tokens.ink), fg: hexToRgb(tokens.text) },
      ...products.map((p) => ({ bg: hexToRgb(p.palette.bg), fg: hexToRgb(p.palette.fg) })),
    ]
    const apply = (p: number) => {
      const f = handoverFrame(p, palettes)
      el.style.setProperty('--bg', `rgb(${f.bg.join(',')})`)
      el.style.setProperty('--fg', `rgb(${f.fg.join(',')})`)
      intro.style.opacity = String(1 - Math.min(Math.max((p - 0.07) / 0.05, 0), 1))
      panels.forEach((panel, i) => {
        const o = f.panels[i]
        panel.style.opacity = o.toFixed(3)
        panel.style.transform = `translateY(${((1 - o) * 28).toFixed(1)}px)`
        panel.inert = o < 0.5
      })
      const light = f.stop > 0 && products[f.stop - 1].light
      if (light) el.dataset.navTheme = 'light'
      else delete el.dataset.navTheme
      setStop(f.stop)
    }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: `+=${products.length * 110}%`,
        pin: true,
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      })
    }, el)
    return () => {
      ctx.revert()
      delete el.dataset.navTheme
    }
  }, [])

  return (
    <section id="products" ref={section} className={styles.handover}>
      <div className={styles.intro} data-intro>
        <Label />
        <h2 className={styles.headline}>{HEADLINE}</h2>
      </div>
      {products.map((p) => (
        <div key={p.id} className={styles.panel} data-panel>
          <Copy product={p} />
          <ProductMockup id={p.id} />
        </div>
      ))}
      <div className={styles.dots} aria-hidden="true">
        {products.map((p, i) => (
          <i key={p.id} data-on={stop === i + 1} />
        ))}
      </div>
    </section>
  )
}

// Phones (lite): a tilted 3D stack that cycles every 3.2 s; the names are tabs (spec 6.04).
function CardSwap() {
  const [front, setFront] = useState(0)
  const [cycle, setCycle] = useState(0)
  const n = products.length

  useEffect(() => {
    const timer = window.setInterval(() => setFront((f) => (f + 1) % n), SWAP_MS)
    return () => window.clearInterval(timer)
  }, [n, cycle])

  const bring = (i: number) => {
    setFront(i)
    setCycle((c) => c + 1)
  }
  const current = products[front]

  return (
    <section id="products" className={styles.swap}>
      <Label />
      <h2 className={styles.headline}>{HEADLINE}</h2>
      <div className={styles.tabs} role="tablist" aria-label="Products">
        {products.map((p, i) => (
          <button key={p.id} type="button" role="tab" aria-selected={i === front} onClick={() => bring(i)}>
            {p.name}
          </button>
        ))}
      </div>
      <div className={styles.stack} onClick={() => bring((front + 1) % n)}>
        {products.map((p, i) => {
          const depth = (i - front + n) % n
          return (
            <div
              key={p.id}
              className={styles.swapCard}
              data-depth={depth}
              style={{ background: p.palette.bg, zIndex: n - depth }}
            >
              <ProductMockup id={p.id} />
            </div>
          )
        })}
      </div>
      <div className={styles.swapCopy} role="tabpanel" aria-live="polite">
        <h3 className={styles.swapPitch}>{current.pitch}</h3>
        <p className={styles.swapLine}>{current.line}</p>
        <p className={styles.swapMeta}>{current.meta}</p>
        <Cta product={current} />
      </div>
    </section>
  )
}

// Reduced motion: each product as its own block in its palette.
function Blocks() {
  return (
    <section id="products" className={styles.blocks}>
      <div className={styles.blocksHead}>
        <Label />
        <h2 className={styles.headline}>{HEADLINE}</h2>
      </div>
      {products.map((p) => (
        <div
          key={p.id}
          className={styles.block}
          style={{ '--bg': p.palette.bg, '--fg': p.palette.fg } as React.CSSProperties}
        >
          <Copy product={p} />
          <ProductMockup id={p.id} />
        </div>
      ))}
    </section>
  )
}

export function Products() {
  const mode = useMotionPreference()
  if (mode === 'full') return <Handover />
  return mode === 'lite' ? <CardSwap /> : <Blocks />
}
