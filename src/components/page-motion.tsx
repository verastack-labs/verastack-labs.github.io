'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'

gsap.registerPlugin(ScrollTrigger)

// Motion for the inner pages (the Launch Kit, the founder page), wired by data attributes so the
// pages stay server-rendered and readable without JavaScript. Everything is visible by default; it
// only animates in when motion is allowed, and `static` mode (reduced motion, weak devices) skips it.
//
//   data-m="lines"   children rise in one after another on load (a headline's lines)
//   data-m="slide"   slides in from the right on load (the price card)
//   data-m="mask"    revealed from the bottom by a sliding mask on load (a photo)
//   data-m="wipe"    wiped in left to right on load (a signature)
//   data-m="stagger" its children fade and rise in turn when it scrolls into view
//   data-m="bar"     its children grow left to right in turn when it scrolls into view
//   data-m="words"   its words light up one by one as it scrolls through the screen
//   data-m="count"   its number counts up from zero when it scrolls into view (keeps any prefix,
//                    suffix and thousands commas); data-m-to="#hex" also shifts its colour to that
//   data-m="rail"    a timeline: the line draws down as you scroll, each item pops in as it arrives
//   data-tilt       leans a little toward the cursor (mouse only); combines with any data-m
const EASE = 'power3.out'

function countUp(el: HTMLElement) {
  const text = el.textContent ?? ''
  const match = text.match(/^(\D*)([\d,]*\.?\d+)(.*)$/)
  if (!match) return
  const [, prefix, digits, suffix] = match
  // "Day 1" is a phrase, not a number to count; only symbols such as $ may lead.
  if (/[a-z]/i.test(prefix)) return
  const target = Number(digits.replace(/,/g, ''))
  const decimals = digits.includes('.') ? digits.split('.')[1].length : 0
  const commas = digits.includes(',')
  const format = (n: number) => {
    const fixed = n.toFixed(decimals)
    return `${prefix}${commas ? Number(fixed).toLocaleString('en-US', { minimumFractionDigits: decimals }) : fixed}${suffix}`
  }
  const state = { n: 0 }
  el.textContent = format(0)
  const to = el.dataset.mTo
  gsap.to(state, {
    n: target,
    duration: 1.4,
    ease: 'power2.out',
    onUpdate: () => (el.textContent = format(state.n)),
    onComplete: () => (el.textContent = text),
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
  })
  if (to) gsap.to(el, { color: to, duration: 1.4, ease: 'power2.in', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
}

function splitWords(el: HTMLElement) {
  const walk = (node: Node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment()
        for (const part of (child.textContent ?? '').split(/(\s+)/)) {
          if (!part) continue
          if (/^\s+$/.test(part)) frag.append(part)
          else {
            const span = document.createElement('span')
            span.className = 'm-word'
            span.textContent = part
            frag.append(span)
          }
        }
        child.replaceWith(frag)
      } else walk(child)
    }
  }
  walk(el)
  gsap.fromTo(
    el.querySelectorAll('.m-word'),
    { opacity: 0.15 },
    { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 40%', scrub: true } },
  )
}

export function PageMotion() {
  const mode = useMotionPreference()

  useEffect(() => {
    if (mode === 'static') return
    const ctx = gsap.context(() => {
      const all = (name: string) => gsap.utils.toArray<HTMLElement>(`[data-m="${name}"]`)

      all('lines').forEach((el) =>
        gsap.from(el.children, { yPercent: 60, opacity: 0, duration: 1, ease: 'back.out(1.6)', stagger: 0.14, delay: 0.15 }),
      )
      all('slide').forEach((el) => gsap.from(el, { x: 80, opacity: 0, duration: 1.1, ease: EASE, delay: 0.35 }))
      all('mask').forEach((el) =>
        gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power4.inOut', delay: 0.2 }),
      )
      all('wipe').forEach((el) =>
        gsap.fromTo(el, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power2.inOut', delay: 0.9 }),
      )
      all('stagger').forEach((el) =>
        gsap.from(el.children, {
          y: 34,
          opacity: 0,
          duration: 0.8,
          ease: EASE,
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }),
      )
      all('bar').forEach((el) =>
        gsap.fromTo(el.children, { '--grow': 0 }, {
          '--grow': 1,
          duration: 0.7,
          ease: 'power2.inOut',
          stagger: 0.35,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }),
      )
      all('words').forEach(splitWords)
      all('count').forEach(countUp)
      all('rail').forEach((el) => {
        gsap.fromTo(el, { '--draw': 0 }, { '--draw': 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 60%', scrub: true } })
        for (const item of [...el.children] as HTMLElement[]) {
          gsap.from(item, { x: -24, opacity: 0, duration: 0.6, ease: EASE, scrollTrigger: { trigger: item, start: 'top 78%', once: true } })
        }
      })
    })

    // Tilt: mouse only, and only where motion is in full.
    const cleanups: (() => void)[] = []
    if (mode === 'full') {
      for (const el of document.querySelectorAll<HTMLElement>('[data-tilt]')) {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          const x = (e.clientX - r.left) / r.width - 0.5
          const y = (e.clientY - r.top) / r.height - 0.5
          gsap.to(el, { rotateY: x * 8, rotateX: -y * 8, transformPerspective: 700, duration: 0.4, ease: 'power2.out' })
        }
        const leave = () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' })
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        cleanups.push(() => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        })
      }
    }
    return () => {
      ctx.revert()
      cleanups.forEach((c) => c())
    }
  }, [mode])

  return null
}
