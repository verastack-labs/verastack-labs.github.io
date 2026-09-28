'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { configurator, priceOf, type GroupId, type Selection } from '@/data/configurator'
import { useCountUp } from '@/components/use-count-up'
import { formatMoney } from '@/lib/currency'
import { useCurrency } from '@/lib/use-currency'
import { setEnquiryPrefill } from '@/lib/enquiry-prefill'
import { KeyboardFlat } from '@/scenes/services/keyboard-flat'
import styles from '@/scenes/services/services.module.css'

const Keyboard3D = dynamic(() => import('@/scenes/services/keyboard-3d'), { ssr: false })

type Props = {
  // Live 3D canvas (full mode); otherwise the flat drawing.
  live: boolean
  // Mount the canvas (the section is near) and let it render (the demo is on screen).
  mounted: boolean
  running: boolean
  animate: boolean
  holdNote?: string
}

export function ConfiguratorDemo({ live, mounted, running, animate, holdNote }: Props) {
  const [selection, setSelection] = useState<Selection>(configurator.defaults)
  const currency = useCurrency()
  const price = priceOf(selection, currency)
  const priceRef = useCountUp<HTMLSpanElement>(price, (n) => formatMoney(n, currency), animate)

  const pick = (group: GroupId, id: string) => setSelection((s) => ({ ...s, [group]: id }))

  return (
    <div className={styles.demoCard}>
      <p className={styles.label}>
        /services/01 <em>{'//'}</em> try it
      </p>
      <h3 className={styles.demoTitle}>{configurator.title}</h3>
      <div className={styles.demoBody}>
        <div className={styles.view}>
          {live ? (
            mounted && <Keyboard3D selection={selection} running={running} />
          ) : (
            <KeyboardFlat selection={selection} />
          )}
        </div>
        <div className={styles.options}>
          {configurator.groups.map((g) => (
            <fieldset key={g.id} className={styles.group}>
              <legend className={styles.label}>{g.label}</legend>
              <div className={styles.choices}>
                {g.choices.map((c) => {
                  const on = selection[g.id] === c.id
                  const extra = c.delta[currency]
                  return (
                    <button key={c.id} type="button" aria-pressed={on} className={styles.choice} onClick={() => pick(g.id, c.id)}>
                      <i style={{ background: c.color }} aria-hidden="true" />
                      {c.label}
                      {extra > 0 && <span className={styles.delta}>+{formatMoney(extra, currency)}</span>}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </div>
      </div>
      <div className={styles.demoFoot}>
        <p className={styles.price}>
          <small>{configurator.product} · demo price</small>
          <span ref={priceRef} aria-hidden="true">
            {formatMoney(price, currency)}
          </span>
          <span className="sr-only" aria-live="polite">
            {formatMoney(price, currency)}
          </span>
        </p>
        <a className={styles.prebook} href="#contact" onClick={() => setEnquiryPrefill('configurator')}>
          Pre-book for {formatMoney(configurator.deposit[currency], currency)} →
        </a>
      </div>
      {holdNote && (
        <p className={styles.holdNote}>
          keep scrolling for <b>{holdNote}</b> ↓
        </p>
      )}
    </div>
  )
}
