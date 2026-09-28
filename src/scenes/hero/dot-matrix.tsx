'use client'

import { useEffect, useRef, useState } from 'react'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'
import { createQuadRenderer } from '@/lib/webgl/quad-renderer'
import { DOT_MATRIX_SHADER } from '@/scenes/hero/dot-matrix-shader'
import { autoPointer, cellSize, heroSettings, shouldDraw } from '@/scenes/hero/settings'
import styles from '@/scenes/hero/hero.module.css'

// The hero's WebGL field (spec 6.01). Starts after first paint so the headline is the LCP element.
export function DotMatrix() {
  const mode = useMotionPreference()
  const settings = heroSettings(mode)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [live, setLive] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !settings) return
    let renderer: ReturnType<typeof createQuadRenderer> | null = null
    let raf = 0
    let visible = true
    let last = 0
    const t0 = performance.now()
    const target: [number, number] = [0.3, 0.1]
    const pointer: [number, number] = [0.3, 0.1]

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, settings.dprCap)
      renderer?.resize(Math.round(canvas.clientWidth * dpr), Math.round(canvas.clientHeight * dpr))
    }
    const frame = (now: number) => {
      raf = 0
      if (!renderer || !visible) return
      raf = requestAnimationFrame(frame)
      if (!shouldDraw(now, last, settings.fps)) return
      last = now
      const seconds = (now - t0) / 1000
      if (!settings.cursor) [target[0], target[1]] = autoPointer(seconds)
      pointer[0] += (target[0] - pointer[0]) * 0.06
      pointer[1] += (target[1] - pointer[1]) * 0.06
      renderer.render({ t: seconds, m: pointer, cs: cellSize(canvas.height, settings.cellDivisor) })
    }
    const onMove = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect()
      target[0] = (e.clientX - b.left) / b.width - 0.5
      target[1] = 0.5 - (e.clientY - b.top) / b.height
    }

    // Wait for first paint, then start.
    const start = window.setTimeout(() => {
      try {
        renderer = createQuadRenderer(canvas, DOT_MATRIX_SHADER)
      } catch {
        setFailed(true)
        return
      }
      size()
      setLive(true)
      raf = requestAnimationFrame(frame)
    }, 150)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && renderer && !raf) raf = requestAnimationFrame(frame)
    })
    io.observe(canvas)
    const resize = new ResizeObserver(size)
    resize.observe(canvas)
    if (settings.cursor) window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      window.clearTimeout(start)
      cancelAnimationFrame(raf)
      io.disconnect()
      resize.disconnect()
      window.removeEventListener('pointermove', onMove)
      renderer?.dispose()
      renderer = null
      setLive(false)
    }
    // settings is derived from mode; mode is the real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  return (
    <div className={styles.field} aria-hidden="true">
      {settings && !failed ? (
        <canvas ref={canvasRef} className={`${styles.canvas} ${live ? styles.canvasOn : ''}`} />
      ) : (
        <div className={styles.fallback} />
      )}
    </div>
  )
}
