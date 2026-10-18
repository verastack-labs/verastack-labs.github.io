'use client'

import { useMemo, useState } from 'react'
import { blankOffer, offerJsonLd, offerNotes, plainSentence, softwareCategories, type Kind, type OfferInput, type Plan } from '@/lib/offer-schema'
import styles from '@/app/tools/tool.module.css'

const KINDS: { id: Kind; name: string }[] = [
  { id: 'software', name: 'Software or SaaS' },
  { id: 'service', name: 'A service' },
  { id: 'product', name: 'A physical product' },
]
const WHAT_HINT: Record<Kind, string> = {
  software: 'booking software for clinics',
  service: 'a web design studio for early-stage startups',
  product: 'a cold-pressed hair oil for dry scalps',
}

function Copy({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      className={styles.copy}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setDone(true)
          window.setTimeout(() => setDone(false), 1800)
        } catch {}
      }}
    >
      {done ? 'Copied ✓' : label}
    </button>
  )
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  )
}

export function OfferBuilder() {
  const [o, setO] = useState<OfferInput>(() => blankOffer('software'))
  const set = <K extends keyof OfferInput>(key: K, value: OfferInput[K]) => setO((x) => ({ ...x, [key]: value }))
  const setPlan = (i: number, patch: Partial<Plan>) => setO((x) => ({ ...x, plans: x.plans.map((p, j) => (j === i ? { ...p, ...patch } : p)) }))
  const sentence = useMemo(() => plainSentence(o), [o])
  const code = useMemo(() => offerJsonLd(o), [o])
  const notes = offerNotes(o)

  return (
    <div className={styles.builder}>
      <div className={styles.templates} role="group" aria-label="What do you sell?">
        <span>What do you sell?</span>
        {KINDS.map((k) => (
          <button key={k.id} type="button" aria-pressed={o.kind === k.id} onClick={() => setO({ ...blankOffer(k.id), name: o.name, what: '', url: o.url, company: o.company, currency: o.currency })}>
            {k.name}
          </button>
        ))}
      </div>

      <div className={styles.split}>
        <div className={styles.pairs}>
          <div className={styles.pair}>
            <Field id="o-name" label="Name">
              <input id="o-name" className={styles.q} value={o.name} maxLength={80} placeholder="Acme" onChange={(e) => set('name', e.target.value)} />
            </Field>
            <Field id="o-what" label="What it is, and who it is for">
              <input id="o-what" className={styles.a} value={o.what} maxLength={140} placeholder={WHAT_HINT[o.kind]} onChange={(e) => set('what', e.target.value)} />
            </Field>
            {o.kind === 'software' && (
              <Field id="o-cat" label="Category">
                <select id="o-cat" className={styles.a} value={o.category} onChange={(e) => set('category', e.target.value)}>
                  {softwareCategories.map((c) => (
                    <option key={c} value={c}>
                      {c.replace('Application', '')}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            {o.kind === 'service' && (
              <>
                <Field id="o-type" label="Type of service">
                  <input id="o-type" className={styles.a} value={o.category} maxLength={80} placeholder="Web design" onChange={(e) => set('category', e.target.value)} />
                </Field>
                <Field id="o-area" label="Where you offer it">
                  <input id="o-area" className={styles.a} value={o.area} maxLength={80} placeholder="Worldwide, or a city or country" onChange={(e) => set('area', e.target.value)} />
                </Field>
              </>
            )}
            {o.kind === 'product' && (
              <>
                <Field id="o-brand" label="Brand">
                  <input id="o-brand" className={styles.a} value={o.category} maxLength={80} placeholder="Your brand" onChange={(e) => set('category', e.target.value)} />
                </Field>
                <Field id="o-stock" label="Availability">
                  <select id="o-stock" className={styles.a} value={o.availability} onChange={(e) => set('availability', e.target.value as OfferInput['availability'])}>
                    <option value="InStock">In stock</option>
                    <option value="PreOrder">Pre-order</option>
                    <option value="OutOfStock">Out of stock</option>
                  </select>
                </Field>
              </>
            )}
            <Field id="o-url" label="Page address (optional)">
              <input id="o-url" className={styles.a} value={o.url} maxLength={200} placeholder="https://acme.com" inputMode="url" onChange={(e) => set('url', e.target.value)} />
            </Field>
            <Field id="o-company" label={o.kind === 'product' ? 'Seller (optional)' : 'Company (optional)'}>
              <input id="o-company" className={styles.a} value={o.company} maxLength={80} placeholder="Acme Inc" onChange={(e) => set('company', e.target.value)} />
            </Field>
          </div>

          <div className={styles.pair}>
            <div className={styles.pairHead}>
              <span>{o.kind === 'software' ? 'Plans' : o.kind === 'service' ? 'Prices' : 'Price'}</span>
              <select aria-label="Currency" className={styles.currency} value={o.currency} onChange={(e) => set('currency', e.target.value)}>
                {['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            {o.plans.map((p, i) => (
              <div key={i} className={styles.plan}>
                {o.kind !== 'product' && (
                  <input aria-label={`Plan ${i + 1} name`} className={styles.a} value={p.name} maxLength={40} placeholder="Plan name" onChange={(e) => setPlan(i, { name: e.target.value })} />
                )}
                <input aria-label={`Plan ${i + 1} price`} className={styles.a} value={p.price} inputMode="decimal" maxLength={12} placeholder="0 for free" onChange={(e) => setPlan(i, { price: e.target.value.replace(/[^\d.]/g, '') })} />
                {o.kind !== 'product' && (
                  <select aria-label={`Plan ${i + 1} billing`} className={styles.a} value={p.period} onChange={(e) => setPlan(i, { period: e.target.value as Plan['period'] })}>
                    <option value="month">a month</option>
                    <option value="year">a year</option>
                    <option value="once">one-off</option>
                  </select>
                )}
                {o.plans.length > 1 && (
                  <button type="button" className={styles.remove} aria-label={`Remove plan ${i + 1}`} onClick={() => set('plans', o.plans.filter((_, j) => j !== i))}>
                    ✕
                  </button>
                )}
              </div>
            ))}
            {o.kind !== 'product' && o.plans.length < 6 && (
              <button type="button" className={styles.add} onClick={() => set('plans', [...o.plans, { name: '', price: '', period: o.plans[0]?.period ?? 'month' }])}>
                + Add a {o.kind === 'software' ? 'plan' : 'price'}
              </button>
            )}
          </div>
          {notes.length > 0 && (o.name.trim() || o.what.trim()) && (
            <ul className={styles.notes}>
              {notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.output}>
          <p className={styles.count}>1. Say it on the page (this is what an AI answer quotes)</p>
          <p className={styles.sentence}>{sentence}</p>
          <div className={styles.actions}>
            <Copy text={sentence} label="Copy the sentence" />
          </div>
          <p className={styles.how}>Put it near the top of the page, in the HTML itself, not only in an image or an animation.</p>
          <p className={styles.count}>2. Label it for machines (good practice)</p>
          <pre className={styles.code} tabIndex={0}>
            <code>{code}</code>
          </pre>
          <div className={styles.actions}>
            <Copy text={code} label="Copy structured data" />
          </div>
          <p className={styles.how}>Paste it into the same page. Keep the prices in step with what the page shows.</p>
        </div>
      </div>
    </div>
  )
}
