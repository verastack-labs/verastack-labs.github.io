'use client'

import { useMemo, useState } from 'react'
import { faqHtml, faqJsonLd, faqNotes, faqTemplates, MAX_QUESTIONS, usable, type Qa } from '@/lib/faq-schema'
import styles from '@/app/tools/tool.module.css'

type Row = Qa & { hint: string; id: number }
let nextId = 1
const rowsFrom = (templateId: string): Row[] =>
  (faqTemplates.find((t) => t.id === templateId) ?? faqTemplates[0]).items.map((i) => ({ q: i.q, a: '', hint: i.hint, id: nextId++ }))

function CopyButton({ text, label }: { text: string; label: string }) {
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

export function FaqBuilder() {
  const [template, setTemplate] = useState('saas')
  const [rows, setRows] = useState<Row[]>(() => rowsFrom('saas'))
  const [tab, setTab] = useState<'jsonld' | 'html' | 'preview'>('jsonld')

  const ready = usable(rows)
  const jsonLd = useMemo(() => faqJsonLd(rows), [rows])
  const html = useMemo(() => faqHtml(rows), [rows])

  const update = (id: number, key: 'q' | 'a', value: string) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [key]: value } : r)))
  const pick = (id: string) => {
    const filled = rows.some((r) => r.a.trim())
    if (filled && !window.confirm('Swap templates? Your answers so far will be cleared.')) return
    setTemplate(id)
    setRows(rowsFrom(id))
  }

  return (
    <div className={styles.builder}>
      <div className={styles.templates} role="group" aria-label="Start from">
        <span>Start from</span>
        {faqTemplates.map((t) => (
          <button key={t.id} type="button" aria-pressed={template === t.id} onClick={() => pick(t.id)}>
            {t.name}
          </button>
        ))}
      </div>

      <div className={styles.split}>
        <ol className={styles.pairs}>
          {rows.map((r, i) => {
            const notes = faqNotes(r)
            return (
              <li key={r.id} className={styles.pair}>
                <div className={styles.pairHead}>
                  <span>Q{i + 1}</span>
                  <button
                    type="button"
                    className={styles.remove}
                    aria-label={`Remove question ${i + 1}`}
                    onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}
                  >
                    ✕
                  </button>
                </div>
                <label className="sr-only" htmlFor={`q-${r.id}`}>
                  Question {i + 1}
                </label>
                <input
                  id={`q-${r.id}`}
                  className={styles.q}
                  value={r.q}
                  placeholder="The question a buyer would ask"
                  maxLength={200}
                  onChange={(e) => update(r.id, 'q', e.target.value)}
                />
                <label className="sr-only" htmlFor={`a-${r.id}`}>
                  Answer {i + 1}
                </label>
                <textarea
                  id={`a-${r.id}`}
                  className={styles.a}
                  value={r.a}
                  placeholder={r.hint}
                  rows={3}
                  maxLength={600}
                  onChange={(e) => update(r.id, 'a', e.target.value)}
                />
                {notes.length > 0 && r.a.trim() && (
                  <ul className={styles.notes}>
                    {notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
          {rows.length < MAX_QUESTIONS && (
            <li>
              <button
                type="button"
                className={styles.add}
                onClick={() => setRows((rs) => [...rs, { q: '', a: '', hint: 'Answer in one or two sentences.', id: nextId++ }])}
              >
                + Add a question
              </button>
            </li>
          )}
        </ol>

        <div className={styles.output}>
          <div className={styles.tabs} role="tablist" aria-label="Output">
            {(
              [
                ['jsonld', 'Structured data'],
                ['html', 'HTML'],
                ['preview', 'Preview'],
              ] as const
            ).map(([id, name]) => (
              <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>
                {name}
              </button>
            ))}
          </div>
          <p className={styles.count}>
            {ready.length} of {rows.length} {rows.length === 1 ? 'question' : 'questions'} ready
            {ready.length === 0 && ': write an answer to see the code'}
          </p>
          {tab === 'preview' ? (
            <div className={styles.preview}>
              {ready.length === 0 ? (
                <p className={styles.empty}>Your questions will show here, as they will on your page.</p>
              ) : (
                ready.map((r) => (
                  <details key={r.q}>
                    <summary>{r.q}</summary>
                    <p>{r.a}</p>
                  </details>
                ))
              )}
            </div>
          ) : (
            <>
              <pre className={styles.code} tabIndex={0}>
                <code>{tab === 'jsonld' ? jsonLd : html}</code>
              </pre>
              <div className={styles.actions}>
                <CopyButton text={tab === 'jsonld' ? jsonLd : html} label={tab === 'jsonld' ? 'Copy structured data' : 'Copy HTML'} />
              </div>
              <p className={styles.how}>
                {tab === 'jsonld'
                  ? 'Paste it in the page’s <head> or anywhere in its <body>. Then add the same questions where visitors can read them: engines expect the marked-up answers on the page too.'
                  : 'Paste it where the questions should appear, and style the .faq class to match your site.'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
