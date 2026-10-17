'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { HCaptcha } from '@/components/hcaptcha'
import { checker } from '@/data/ai-search-check'
import { site } from '@/data/site'
import { setEnquiryPrefill } from '@/lib/enquiry-prefill'
import styles from '@/app/ai-search-check/checker.module.css'

type Check = { id: string; label: string; status: 'pass' | 'warn' | 'fail'; weight: number; detail: string; fix: string }
type Report = { url: string; score: number; top: string[]; checks: Check[] }

const verdict = (score: number) =>
  score >= 85
    ? 'Engines can read this page well. The rest is about who cites you.'
    : score >= 60
      ? 'Readable, with gaps that cost you mentions.'
      : 'AI search engines will struggle to understand this page.'

const tone = (score: number) => (score >= 85 ? 'good' : score >= 60 ? 'fair' : 'poor')

const STATUS_WORD = { pass: 'pass', warn: 'improve', fail: 'fix' } as const

function CheckRow({ c, showFix }: { c: Check; showFix: boolean }) {
  return (
    <li className={styles.check} data-status={c.status}>
      <span className={styles.badge}>{STATUS_WORD[c.status]}</span>
      <div>
        <b>{c.label}</b>
        <p>{c.detail}</p>
        {showFix && c.status !== 'pass' && <p className={styles.fix}>{c.fix}</p>}
      </div>
    </li>
  )
}

export function Checker() {
  const [input, setInput] = useState('')
  const [state, setState] = useState<'idle' | 'checking' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<Report | null>(null)
  const [email, setEmail] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [captchaReset, setCaptchaReset] = useState(0)
  const [unlock, setUnlock] = useState<'locked' | 'sending' | 'open' | 'failed'>('locked')
  const resultRef = useRef<HTMLDivElement>(null)

  const run = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || state === 'checking') return
    setState('checking')
    setError(null)
    try {
      const res = await fetch(`${checker.endpoint}?url=${encodeURIComponent(input.trim())}`)
      const body = (await res.json().catch(() => null)) as (Report & { error?: string }) | null
      if (!res.ok || !body || body.error) {
        setError(body?.error ?? 'The check did not finish. Try again in a minute.')
        setState('error')
        return
      }
      setReport(body)
      setState('done')
      requestAnimationFrame(() => resultRef.current?.focus())
    } catch {
      setError('Could not reach the checker. Check your connection and try again.')
      setState('error')
    }
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const captchaOn = !!(site.formAccessKey && site.hcaptchaSiteKey)

  // The full report opens here once the email is sent; the email reaches the studio with the score.
  const openReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!report || !emailOk || unlock === 'sending' || !site.formAccessKey) return
    if (captchaOn && !token) return
    setUnlock('sending')
    try {
      const res = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: site.formAccessKey,
          subject: `AI search check: ${new URL(report.url).host} scored ${report.score}`,
          from_name: site.name,
          email: email.trim(),
          checked_url: report.url,
          score: report.score,
          to_fix: report.checks.filter((c) => c.status !== 'pass').map((c) => `${c.status}: ${c.label}`).join('\n') || 'nothing',
          ...(token ? { 'h-captcha-response': token } : {}),
        }),
      })
      const body = (await res.json().catch(() => null)) as { success?: boolean } | null
      if (res.ok && body?.success) {
        setUnlock('open')
      } else {
        setUnlock('failed')
        setCaptchaReset((n) => n + 1)
      }
    } catch {
      setUnlock('failed')
      setCaptchaReset((n) => n + 1)
    }
  }

  const top = report ? report.top.map((id) => report.checks.find((c) => c.id === id)!).filter(Boolean) : []
  const failing = report ? report.checks.filter((c) => c.status !== 'pass').length : 0

  return (
    <div className={styles.tool}>
      <form className={styles.form} onSubmit={run} noValidate>
        <label className={styles.srOnly} htmlFor="check-url">
          Website address
        </label>
        <input
          id="check-url"
          className={styles.input}
          type="text"
          inputMode="url"
          autoComplete="url"
          spellCheck={false}
          placeholder="yourproduct.com"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className={styles.go} type="submit" disabled={state === 'checking' || !input.trim()}>
          {state === 'checking' ? 'Checking…' : 'Check'}
        </button>
      </form>
      <p className={styles.note} aria-live="polite">
        {state === 'checking' ? 'Fetching the page, robots.txt, llms.txt and sitemap. About ten seconds.' : error ?? 'One page at a time. Nothing is stored unless you ask for the full report.'}
      </p>

      {report && state !== 'checking' && (
        <div className={styles.result} ref={resultRef} tabIndex={-1} aria-label={`Score ${report.score} out of 100`}>
          <div className={styles.scoreRow}>
            <p className={styles.score} data-tone={tone(report.score)}>
              {report.score}
              <span>/100</span>
            </p>
            <div>
              <p className={styles.checked}>{report.url}</p>
              <p className={styles.verdict}>{verdict(report.score)}</p>
            </div>
          </div>

          {top.length > 0 ? (
            <>
              <h2 className={styles.h2}>Fix these first</h2>
              <ol className={styles.list}>
                {top.map((c) => (
                  <CheckRow key={c.id} c={c} showFix />
                ))}
              </ol>
            </>
          ) : (
            <p className={styles.verdict}>Every check passed.</p>
          )}

          <h2 className={styles.h2}>The full report</h2>
          {unlock === 'open' ? (
            <ol className={styles.list}>
              {report.checks.map((c) => (
                <CheckRow key={c.id} c={c} showFix />
              ))}
            </ol>
          ) : (
            <form className={styles.gate} onSubmit={openReport} noValidate>
              <p>
                All {report.checks.length} checks{failing > 3 ? `, including ${failing - 3} more to improve` : ''}, each with its fix. Leave your
                email and it opens here. We may write once about what we found; no newsletter.
              </p>
              <div className={styles.form}>
                <label className={styles.srOnly} htmlFor="check-email">
                  Email
                </label>
                <input
                  id="check-email"
                  className={styles.input}
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className={styles.go} type="submit" disabled={!emailOk || unlock === 'sending' || (captchaOn && !token)}>
                  {unlock === 'sending' ? 'Opening…' : 'Open report'}
                </button>
              </div>
              {captchaOn && emailOk && site.hcaptchaSiteKey && (
                <div className={styles.captcha}>
                  <HCaptcha siteKey={site.hcaptchaSiteKey} onToken={setToken} resetKey={captchaReset} />
                </div>
              )}
              {unlock === 'failed' && <p className={styles.note}>That did not go through. Tick the box again and retry.</p>}
            </form>
          )}

          <div className={styles.audit}>
            <h2 className={styles.h2}>Want it fixed?</h2>
            <p>
              The full audit covers every key page and the sources AI engines cite for your category, then we make the fixes: crawler
              access, server-rendered copy, structured data, llms.txt and the pages that get you named. Price on request.
            </p>
            <Link className={styles.cta} href="/#contact" onClick={() => setEnquiryPrefill('ai-search')}>
              Ask about an audit
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
