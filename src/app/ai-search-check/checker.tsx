'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { HCaptcha } from '@/components/hcaptcha'
import { checker } from '@/data/ai-search-check'
import { site } from '@/data/site'
import { setEnquiryPrefill } from '@/lib/enquiry-prefill'
import { lenisRef } from '@/lib/motion/smooth-scroll'
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

// Stands in for a locked check's details. The real detail and fix never reach the page until the
// report is unlocked, so the blur hides nothing worth reading in the source.
const LOCKED_TEXT = 'What we found on your page, and the exact change that fixes it, open with the full report.'

// Brings an element into view below the fixed header, smoothly unless motion is reduced.
function reveal(el: HTMLElement) {
  el.focus({ preventScroll: true })
  if (lenisRef.current) {
    lenisRef.current.scrollTo(el, { offset: -110 })
    return
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

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
  const lockedRef = useRef<HTMLElement>(null)
  const fullRef = useRef<HTMLHeadingElement>(null)
  const gateRef = useRef<HTMLDialogElement>(null)
  // The unlock dialog opens by itself once per visit, when the locked list scrolls into view.
  const autoShown = useRef(false)

  // fresh skips the Worker's ten-minute cache, for a re-run right after a fix.
  const check = useCallback(async (url: string, fresh = false) => {
    setState('checking')
    setError(null)
    try {
      const res = await fetch(`${checker.endpoint}?url=${encodeURIComponent(url)}${fresh ? '&fresh=1' : ''}`)
      const body = (await res.json().catch(() => null)) as (Report & { error?: string }) | null
      if (!res.ok || !body || body.error) {
        setError(body?.error ?? 'The check did not finish. Try again in a minute.')
        setState('error')
        return
      }
      setReport(body)
      setState('done')
    } catch {
      setError('Could not reach the checker. Check your connection and try again.')
      setState('error')
    }
  }, [])

  // Once a new result has rendered, bring it into view below the header.
  useEffect(() => {
    if (state === 'done' && resultRef.current) reveal(resultRef.current)
  }, [state, report])

  const run = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || state === 'checking') return
    void check(input.trim())
  }

  // Arriving with ?url= (from the site-wide offer, or a shared link) fills the field and runs, once.
  const autoRan = useRef(false)
  useEffect(() => {
    const url = new URLSearchParams(window.location.search).get('url')?.trim()
    if (!url || autoRan.current) return
    autoRan.current = true
    const start = () => {
      setInput(url)
      void check(url)
    }
    start()
  }, [check])

  const openGate = useCallback(() => {
    const dialog = gateRef.current
    if (!dialog || dialog.open) return
    lenisRef.current?.stop()
    dialog.showModal()
  }, [])
  const closeGate = () => gateRef.current?.close()

  useEffect(() => {
    const el = lockedRef.current
    if (!report || unlock === 'open' || autoShown.current || !el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || autoShown.current) return
        autoShown.current = true
        io.disconnect()
        openGate()
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [report, unlock, openGate])

  useEffect(() => {
    if (unlock === 'open' && fullRef.current) reveal(fullRef.current)
  }, [unlock])

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
        closeGate()
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
  const rest = report ? report.checks.filter((c) => c.status !== 'pass' && !report.top.includes(c.id)) : []
  const passed = report ? report.checks.length - failing : 0
  const host = report ? new URL(report.url).host.replace(/^www\./, '') : ''

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
        {state === 'checking' ? 'Fetching the page, robots.txt, llms.txt and sitemap. About ten seconds.' : error ?? 'One page at a time. Results are kept for ten minutes, then dropped; nothing else is stored unless you ask for the full report.'}
      </p>

      {report && state !== 'checking' && (
        <div className={styles.result} ref={resultRef} tabIndex={-1} data-offer-hold aria-label={`Score ${report.score} out of 100`}>
          <div className={styles.scoreRow}>
            <p className={styles.score} data-tone={tone(report.score)}>
              {report.score}
              <span>/100</span>
            </p>
            <div>
              <p className={styles.checked}>{report.url}</p>
              <p className={styles.verdict}>{verdict(report.score)}</p>
              <button type="button" className={styles.again} onClick={() => void check(report.url, true)}>
                Check again
              </button>
            </div>
          </div>

          <div className={styles.upsell}>
            <p>
              {report.score < 100 ? (
                <>
                  <b>Get this to 100:</b> we fix every item in the report and re-run the check until it reads 100. Price on request.
                </>
              ) : (
                <>
                  <b>Readable is step one.</b> The audit checks who AI engines cite for your category and gets you named. Price on
                  request.
                </>
              )}
            </p>
            <Link className={styles.upsellCta} href="/#contact" onClick={() => setEnquiryPrefill('ai-search')}>
              {report.score < 100 ? 'Get it to 100' : 'Ask about the audit'}
            </Link>
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

          {unlock === 'open' ? (
            <>
              <h2 className={styles.h2} ref={fullRef} tabIndex={-1}>
                The full report
              </h2>
              <ol className={styles.list}>
                {report.checks.map((c) => (
                  <CheckRow key={c.id} c={c} showFix />
                ))}
              </ol>
            </>
          ) : (
            <section className={styles.locked} ref={lockedRef} aria-labelledby="locked-title">
              <h2 id="locked-title" className={styles.h2}>
                {rest.length ? <span className={styles.more}>+{rest.length} more to fix</span> : 'The full report'}
              </h2>
              {rest.length > 0 && (
                <ol className={styles.list} aria-hidden="true">
                  {rest.map((c) => (
                    <li key={c.id} className={styles.check} data-status={c.status}>
                      <span className={styles.badge}>{STATUS_WORD[c.status]}</span>
                      <div>
                        <b>{c.label}</b>
                        <p className={styles.blur}>{LOCKED_TEXT}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
              <div className={styles.lockBar}>
                <p>
                  {rest.length
                    ? `${rest.length} more ${rest.length === 1 ? 'issue is' : 'issues are'} costing ${host} mentions in AI answers. The details and fixes are in the full report, with the ${passed} checks you pass.`
                    : `See all ${report.checks.length} checks for ${host}, with what each one found.`}
                </p>
                <button type="button" className={styles.unlock} onClick={openGate}>
                  Unlock the full report, free
                </button>
              </div>
            </section>
          )}

          <dialog
            ref={gateRef}
            className={styles.gateDialog}
            aria-labelledby="gate-title"
            onClose={() => lenisRef.current?.start()}
            onClick={(e) => e.target === e.currentTarget && closeGate()}
          >
            <div className={styles.gateInner} data-lenis-prevent>
              <button type="button" className={styles.gateClose} onClick={closeGate} aria-label="Close">
                ✕
              </button>
              <p className={styles.label}>
                /report <em>{'//'}</em> {host}
              </p>
              <h2 id="gate-title" className={styles.gateTitle}>
                {failing > 0 ? (
                  <>
                    <span>{failing}</span> {failing === 1 ? 'thing is' : 'things are'} keeping {host} out of AI answers.
                  </>
                ) : (
                  <>Every check passed. See what each one found.</>
                )}
              </h2>
              <p className={styles.gateText}>
                {rest.length
                  ? `You have seen the top ${top.length}. The full report shows ${rest.length === 1 ? 'the other one with its' : `the other ${rest.length}, each with the`} exact fix. It is free: leave your email and it opens on this page.`
                  : 'The full report shows every check with what it found. It is free: leave your email and it opens on this page.'}
              </p>
              <form className={styles.gate} onSubmit={openReport} noValidate>
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
                <p className={styles.note}>We may write once about what we found; no newsletter.</p>
              </form>
              <p className={styles.gateAlt}>
                Rather have it done?{' '}
                <Link href="/#contact" onClick={() => setEnquiryPrefill('ai-search')}>
                  We fix it and get it to 100 →
                </Link>
              </p>
            </div>
          </dialog>
        </div>
      )}
    </div>
  )
}
