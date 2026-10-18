'use client'

import { useMemo, useState } from 'react'
import { aboutSentence, blankOrg, orgJsonLd, orgNotes, platform, webAddress, type OrgInput } from '@/lib/org-schema'
import styles from '@/app/tools/tool.module.css'

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

const FIELDS: { key: keyof Omit<OrgInput, 'profiles'>; label: string; hint: string; max: number }[] = [
  { key: 'name', label: 'Company name', hint: 'Acme', max: 80 },
  { key: 'what', label: 'What you make, and for whom', hint: 'booking software for clinics', max: 140 },
  { key: 'url', label: 'Website', hint: 'acme.com', max: 200 },
  { key: 'logo', label: 'Logo image address', hint: 'https://acme.com/logo.png', max: 300 },
  { key: 'founded', label: 'Year founded (optional)', hint: '2024', max: 4 },
  { key: 'city', label: 'City (optional)', hint: 'Bengaluru', max: 60 },
  { key: 'country', label: 'Country (optional)', hint: 'India', max: 60 },
  { key: 'founders', label: 'Founders, comma-separated (optional)', hint: 'Asha Rao, Ben Lee', max: 200 },
  { key: 'email', label: 'Contact email (optional)', hint: 'hello@acme.com', max: 120 },
]

export function OrgBuilder() {
  const [o, setO] = useState<OrgInput>(blankOrg)
  const set = (key: keyof OrgInput, value: string) => setO((x) => ({ ...x, [key]: value }))
  const setProfile = (i: number, value: string) => setO((x) => ({ ...x, profiles: x.profiles.map((p, j) => (j === i ? value : p)) }))
  const sentence = useMemo(() => aboutSentence(o), [o])
  const code = useMemo(() => orgJsonLd(o), [o])
  const notes = orgNotes(o)
  const started = !!(o.name.trim() || o.what.trim())

  return (
    <div className={styles.builder}>
      <div className={styles.split}>
        <div className={styles.pairs}>
          <div className={styles.pair}>
            {FIELDS.map((f) => (
              <div key={f.key} className={styles.field}>
                <label htmlFor={`org-${f.key}`}>{f.label}</label>
                <input
                  id={`org-${f.key}`}
                  className={f.key === 'name' ? styles.q : styles.a}
                  value={o[f.key]}
                  maxLength={f.max}
                  placeholder={f.hint}
                  inputMode={f.key === 'founded' ? 'numeric' : f.key === 'url' || f.key === 'logo' ? 'url' : undefined}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className={styles.pair}>
            <div className={styles.pairHead}>
              <span>Your other profiles</span>
            </div>
            {o.profiles.map((p, i) => {
              const where = webAddress(p) ? platform(webAddress(p)!) : null
              return (
                <div key={i} className={styles.profileRow}>
                  <input
                    aria-label={`Profile ${i + 1}`}
                    className={styles.a}
                    value={p}
                    maxLength={300}
                    placeholder={i === 0 ? 'linkedin.com/company/acme' : 'x.com/acme, github.com/acme, crunchbase.com/…'}
                    inputMode="url"
                    onChange={(e) => setProfile(i, e.target.value)}
                  />
                  {where && <span className={styles.chipTag}>{where}</span>}
                  {o.profiles.length > 1 && (
                    <button type="button" className={styles.remove} aria-label={`Remove profile ${i + 1}`} onClick={() => setO((x) => ({ ...x, profiles: x.profiles.filter((_, j) => j !== i) }))}>
                      ✕
                    </button>
                  )}
                </div>
              )
            })}
            {o.profiles.length < 10 && (
              <button type="button" className={styles.add} onClick={() => setO((x) => ({ ...x, profiles: [...x.profiles, ''] }))}>
                + Add a profile
              </button>
            )}
          </div>
          {started && notes.length > 0 && (
            <ul className={styles.notes}>
              {notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.output}>
          <p className={styles.count}>1. Say it on the page (your about line, in the HTML)</p>
          <p className={styles.sentence}>{sentence}</p>
          <div className={styles.actions}>
            <Copy text={sentence} label="Copy the line" />
          </div>
          <p className={styles.how}>Put it on the homepage and the about page, in text rather than only inside an image.</p>
          <p className={styles.count}>2. Label it for machines (good practice)</p>
          <pre className={styles.code} tabIndex={0}>
            <code>{code}</code>
          </pre>
          <div className={styles.actions}>
            <Copy text={code} label="Copy structured data" />
          </div>
          <p className={styles.how}>Paste it into your homepage. The profile links (sameAs) connect your site to the accounts that are really yours.</p>
        </div>
      </div>
    </div>
  )
}
