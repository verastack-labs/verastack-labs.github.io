'use client'

import { useEffect, useState } from 'react'
import { formatIndiaTime } from '@/lib/india-time'
import styles from '@/components/footer/footer.module.css'

export function IndiaClock() {
  const [time, setTime] = useState<string | null>(null)
  useEffect(() => {
    const tick = () => setTime(formatIndiaTime(new Date()))
    tick()
    const id = window.setInterval(tick, 15000)
    return () => window.clearInterval(id)
  }, [])
  return (
    <span>
      <span className={styles.dot} aria-hidden="true" />
      India <span className={styles.time}>{time ?? '--:--'}</span>
    </span>
  )
}
