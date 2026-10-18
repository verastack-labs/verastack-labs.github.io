'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { checker } from '@/data/ai-search-check'
import styles from '@/app/tools/tool.module.css'

type Block = { tag: 'h1' | 'h2' | 'h3' | 'p' | 'li'; text: string }
type View = { url: string; title: string | null; description: string | null; words: number; blocks: Block[]; truncated: boolean }

const ENDPOINT = checker.endpoint.replace(/\/aeo-check$/, '/page-view')

// The same bands as the checker's "plain HTML" check (500 passes, under 200 fails).
function verdict(words: number): { tone: 'poor' | 'fair' | 'good'; head: string; text: string } {
  if (words < 50)
    return { tone: 'poor', head: 'Almost blank to ChatGPT.', text: 'This page draws its words with JavaScript, which most AI crawlers do not run. To them, there is next to nothing here.' }
  if (words < 200) return { tone: 'poor', head: 'Thin to an AI crawler.', text: 'Some words arrive in the HTML, but not enough for an engine to understand what you do.' }
  if (words < 500) return { tone: 'fair', head: 'Readable, but light.', text: 'An engine gets the gist. A plain paragraph on what you do, for whom and from what price would make it clear.' }
  return { tone: 'good', head: 'Reads well without JavaScript.', text: 'Your words are in the HTML. The next question is whether engines name you, which takes more than a readable page.' }
}

export function Viewer() {
  const [input, setInput] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [view, setView] = useState<View | null>(null)
  const [error, setError] = useState('')
  const resultRef = useRef<HTMLDivElement>(null)

  const run = async (url: string) => {
    setState('loading')
    setError('')
    try {
      const res = await fetch(`${ENDPOINT}?url=${encodeURIComponent(url)}`)
      const body = (await res.json().catch(() => null)) as (View & { error?: string }) | null
      if (!res.ok || !body || body.error) {
        setError(body?.error ?? 'That did not work. Try again in a minute.')
        setState('error')
        return
      }
      setView(body)
      setState('done')
    } catch {
      setError('Could not reach the tool. Check your connection and try again.')
      setState('error')
    }
  }

  useEffect(() => {
    if (state === 'done') resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [state])

  const v = view ? verdict(view.words) : null
  const host = view ? new URL(view.url).host.replace(/^www\./, '') : ''

  return (
    <div className={styles.builder}>
      <form
        className={styles.bridgeForm}
        onSubmit={(e) => {
          e.preventDefault()
          if (input.trim() && state !== 'loading') void run(input.trim())
        }}
      >
        <label className="sr-only" htmlFor="view-url">
          Website address
        </label>
        <input id="view-url" value={input} onChange={(e) => setInput(e.target.value)} placeholder="yourproduct.com" inputMode="url" spellCheck={false} />
        <button type="submit" disabled={!input.trim() || state === 'loading'}>
          {state === 'loading' ? 'Reading…' : 'Show me'}
        </button>
      </form>
      {state === 'error' && <p className={styles.notes}>{error}</p>}

      {view && v && state === 'done' && (
        <div ref={resultRef} className={styles.viewResult}>
          <div className={styles.viewHead} data-tone={v.tone}>
            <p className={styles.viewWords}>
              {view.words.toLocaleString('en-US')}
              <small>words a crawler reads on {host}</small>
            </p>
            <div>
              <p className={styles.viewVerdict}>{v.head}</p>
              <p className={styles.how}>{v.text}</p>
            </div>
          </div>

          <div className={styles.viewPane}>
            <p className={styles.count}>What ChatGPT&apos;s crawler gets, with no JavaScript</p>
            <div className={styles.viewDoc}>
              <p className={styles.viewMeta}>
                <b>Title:</b> {view.title ?? <em>none</em>}
                <br />
                <b>Description:</b> {view.description ?? <em>none</em>}
              </p>
              {view.blocks.length === 0 ? (
                <p className={styles.viewEmpty}>Nothing to read. This is the whole page, as most AI crawlers see it.</p>
              ) : (
                view.blocks.slice(0, 120).map((b, i) =>
                  b.tag === 'h1' ? (
                    <p key={i} className={styles.vH1}>
                      {b.text}
                    </p>
                  ) : b.tag === 'h2' || b.tag === 'h3' ? (
                    <p key={i} className={styles.vH2}>
                      {b.text}
                    </p>
                  ) : (
                    <p key={i} className={b.tag === 'li' ? styles.vLi : styles.vP}>
                      {b.text}
                    </p>
                  ),
                )
              )}
              {(view.truncated || view.blocks.length > 120) && <p className={styles.viewEmpty}>…and more, cut short here.</p>}
            </div>
          </div>

          <div className={styles.actions}>
            <Link className={styles.copy} href={`${checker.path}/?url=${encodeURIComponent(view.url)}`}>
              Run the full AEO and GEO check on {host} →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
