'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FieldWarning } from '@/components/field-warning'
import { HCaptcha } from '@/components/hcaptcha'
import { checker } from '@/data/ai-search-check'
import { site } from '@/data/site'
import { EMAIL_WARNING } from '@/lib/enquiry'
import { setEnquiryPrefill } from '@/lib/enquiry-prefill'
import { lenisRef } from '@/lib/motion/smooth-scroll'
import { markOfferDone } from '@/lib/offer'
import { readShared, writeShared } from '@/lib/share-url'
import styles from '@/app/tools/ai-search-check/checker.module.css'

// `partial`: the finding is shown but not the fix; the Worker sends no fix text for it.
type Check = { id: string; label: string; status: 'pass' | 'warn' | 'fail'; weight: number; detail: string; fix: string; partial?: true }
// The public answer: a few fixes and only a count of the rest, never the whole list (more than three
// issues: the top three in full; three or fewer: the first in full and the next without its fix).
// Every check's finding and fix together are the audit; the rest comes by email from the studio.
type Report = { url: string; score: number; top: Check[]; counts: { pass: number; warn: number; fail: number; total: number } }

// Three bands, one set of cut-offs (70 and 85), so the colour, the label and the sentence always agree.
const BANDS = [
  { from: 0, tone: 'poor', label: 'Losing mentions', verdict: 'AI search engines will struggle to understand this page.' },
  { from: 70, tone: 'fair', label: 'Gaps', verdict: 'Readable, with gaps that cost you mentions.' },
  { from: 85, tone: 'good', label: 'Ready', verdict: 'Engines can read this page well. The rest is about who cites you.' },
] as const

const band = (score: number) => [...BANDS].reverse().find((b) => score >= b.from) ?? BANDS[0]
const verdict = (score: number) => band(score).verdict
const tone = (score: number) => band(score).tone

// The meter under the score: a red to amber to green bar, ticks at the two cut-offs, and a marker
// that slides in to the score. The band is also in words, so nothing rests on colour alone.
function ScoreMeter({ score }: { score: number }) {
  const b = band(score)
  return (
    <div className={styles.meter} data-tone={b.tone}>
      <div
        className={styles.meterBar}
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        aria-valuetext={`${score} out of 100: ${b.label}`}
        aria-label="AI search readiness"
        style={{ '--at': `${score}%` } as React.CSSProperties}
      >
        <span className={styles.meterTick} style={{ left: '70%' }} aria-hidden="true" />
        <span className={styles.meterTick} style={{ left: '85%' }} aria-hidden="true" />
        <span className={styles.meterMarker} aria-hidden="true" />
      </div>
      <div className={styles.meterLabels} aria-hidden="true">
        {BANDS.map((x, i) => (
          <span key={x.label} data-on={x === b || undefined} style={{ left: `${x.from}%`, width: `${(BANDS[i + 1]?.from ?? 100) - x.from}%` }}>
            {x.label}
          </span>
        ))}
      </div>
    </div>
  )
}

const STATUS_WORD = { pass: 'pass', warn: 'improve', fail: 'fix' } as const

// Stands in for the checks that are not shown. The page never receives them, so the blurred rows
// are placeholders and there is nothing to read in the source.
const LOCKED_ROW = { label: 'Another thing keeping you out of AI answers', text: 'What we found on your page, and what it takes to fix it.' }
// Stands in for a fix that is held back, so the blurred line has the shape of real advice.
const LOCKED_FIX = 'What it takes to fix this on your page, step by step, with the exact wording and where it goes, is in the complete report.'

// What the audit covers that the sixteen checks cannot: the check reads one page, the audit works on
// whether AI answers name you. Shown under every result, a perfect score included.
const BEYOND = [
  { title: 'Your buyers’ questions, asked for real', text: 'We put the questions your customers ask to ChatGPT, Perplexity, Gemini and Google’s AI answers, and record who gets named.' },
  { title: 'Your competitors, side by side', text: 'Who the answers cite instead of you, and what their pages and mentions have that yours don’t.' },
  { title: 'Every page that sells', text: 'Pricing, product, docs and blog, not just the homepage this check reads.' },
  { title: 'The sites AI quotes', text: 'Review sites, directories, Reddit, Wikipedia and press: where engines look for you, and where you are missing.' },
  { title: 'Pages that earn the citation', text: 'Comparisons, answers and numbers written so an engine can quote them, built and shipped by us.' },
  { title: 'Proof it moved', text: 'The same questions asked again after the fixes, so you see when and where you start being named.' },
]

// A padlock, for the unlock button.
function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <rect x="2.5" y="7" width="11" height="7.5" rx="2" fill="currentColor" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

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
        {c.partial ? (
          <>
            <p className={`${styles.fix} ${styles.heldFix}`} aria-hidden="true">
              {LOCKED_FIX}
            </p>
            <span className="sr-only">The fix for this one is in the complete report.</span>
          </>
        ) : (
          showFix && c.status !== 'pass' && <p className={styles.fix}>{c.fix}</p>
        )}
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
  // Warnings wait until a field is left, so typing is never interrupted.
  const [urlLeft, setUrlLeft] = useState(false)
  const [emailLeft, setEmailLeft] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [captchaReset, setCaptchaReset] = useState(0)
  const [unlock, setUnlock] = useState<'locked' | 'sending' | 'sent' | 'failed'>('locked')
  const resultRef = useRef<HTMLDivElement>(null)
  const lockedRef = useRef<HTMLElement>(null)
  const sentRef = useRef<HTMLHeadingElement>(null)
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
      // The address now names the site, so sharing or bookmarking the page shares this report.
      writeShared(url)
      setUnlock((u) => (u === 'sending' ? u : 'locked'))
      setState('done')
      // They have used the free check, so the site-wide offer stops offering it.
      markOfferDone()
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
    const url = readShared(window.location.search)
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
    if (!report || unlock === 'sent' || autoShown.current || !el) return
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

  // The confirmation replaces the form inside the dialog (a bottom sheet on phones), so it shows
  // where the visitor pressed Send. The page behind is held still while the dialog is open.
  useEffect(() => {
    if (unlock === 'sent') sentRef.current?.focus()
  }, [unlock])

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const emailBad = emailLeft && !!email.trim() && !emailOk
  // A web address needs a dot and no spaces; the Worker does the real checking.
  const urlBad = urlLeft && !!input.trim() && !/^\S+\.\S+$/.test(input.trim())
  const captchaOn = !!(site.formAccessKey && site.hcaptchaSiteKey)

  // The email reaches the studio with the score; we write the summary from the full report
  // (workers/aeo-check/full-report.mjs) and send it within a working day.
  const sendSummary = async (e: React.FormEvent) => {
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
          wants: 'The complete report, by email',
          issues: `${report.counts.fail} to fix, ${report.counts.warn} to improve, ${report.counts.pass} passed`,
          shown_on_page: report.top.map((c) => c.label).join('; ') || 'nothing',
          full_report: `node workers/aeo-check/full-report.mjs ${new URL(report.url).host}`,
          ...(token ? { 'h-captcha-response': token } : {}),
        }),
      })
      const body = (await res.json().catch(() => null)) as { success?: boolean } | null
      if (res.ok && body?.success) {
        setUnlock('sent')
      } else {
        setUnlock('failed')
        setCaptchaReset((n) => n + 1)
      }
    } catch {
      setUnlock('failed')
      setCaptchaReset((n) => n + 1)
    }
  }

  const top = report?.top ?? []
  const failing = report ? report.counts.fail + report.counts.warn : 0
  const rest = Math.max(0, failing - top.length)
  // How much is held back: issues not shown at all, plus a fix cut from a shown one (short reports).
  const shownFull = top.filter((c) => !c.partial).length
  const held = failing - shownFull
  const short = top.some((c) => c.partial)
  const heldWord = short ? (held === 1 ? 'fix' : 'fixes') : held === 1 ? 'issue' : 'issues'
  const rows = short ? rest : 3
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
          aria-invalid={urlBad || state === 'error'}
          aria-describedby={urlBad || state === 'error' ? 'check-url-warning' : undefined}
          onChange={(e) => {
            setInput(e.target.value)
            setUrlLeft(false)
            if (state === 'error') setState('idle')
          }}
          onBlur={() => setUrlLeft(true)}
        />
        <button className={styles.go} type="submit" disabled={state === 'checking' || !input.trim()}>
          {state === 'checking' ? 'Checking…' : 'Check'}
        </button>
      </form>
      {state === 'error' && error ? (
        <FieldWarning id="check-url-warning">{error}</FieldWarning>
      ) : urlBad ? (
        <FieldWarning id="check-url-warning">
          That doesn&apos;t look like a website address. Try something like example.com.
        </FieldWarning>
      ) : (
        <p className={styles.note} aria-live="polite">
          {state === 'checking'
            ? 'Fetching the page, robots.txt, llms.txt and sitemap. About ten seconds.'
            : 'One page at a time. Results are kept for ten minutes, then dropped; nothing else is stored unless you ask for the complete report.'}
        </p>
      )}

      {report && state !== 'checking' && (
        <div className={styles.result} ref={resultRef} tabIndex={-1} data-offer-hold aria-label={`Score ${report.score} out of 100`}>
          <div className={styles.scoreRow}>
            <p className={styles.score} data-tone={tone(report.score)}>
              {report.score}
              <span>/100</span>
            </p>
            <div>
              <p className={styles.band} data-tone={tone(report.score)}>
                {band(report.score).label}
              </p>
              <p className={styles.checked}>
                {report.url} <span>{'//'} this page only</span>
              </p>
              <p className={styles.verdict}>{verdict(report.score)}</p>
              <button type="button" className={styles.again} onClick={() => void check(report.url, true)}>
                Check again
              </button>
            </div>
          </div>
          <ScoreMeter key={`${report.url}-${report.score}`} score={report.score} />

          <div className={styles.upsell}>
            <p>
              {report.score < 100 ? (
                <>
                  <b>{report.score < 85 ? 'Get this page into the green.' : 'This score is for one page.'}</b> We cover your whole site: every page that sells, fixed and re-checked until
                  each reads 100. Price on request.
                </>
              ) : (
                <>
                  <b>This page reads 100. Your other pages may not.</b> The audit covers every page that sells, checks who AI engines
                  cite for your category and gets you named. Price on request.
                </>
              )}
            </p>
            <Link className={styles.upsellCta} href="/#contact" onClick={() => setEnquiryPrefill('ai-search')}>
              {report.score < 100 ? 'Cover my whole site' : 'Ask about the audit'}
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
          ) : null}

          {held > 0 && (
            <section className={styles.locked} ref={lockedRef} aria-label="The rest of the report">
              {/* Placeholders: the list carries on past what is shown and fades out. Three for a long
                  report; for a short one, one per issue not shown, so the count never lies. */}
              {rows > 0 && (
                <ol className={`${styles.list} ${styles.fade}`} aria-hidden="true">
                  {Array.from({ length: rows }, (_, i) => (
                    <li key={i} className={styles.check} data-status="fail">
                      <span className={styles.badge}>fix</span>
                      <div>
                        <b>{LOCKED_ROW.label}</b>
                        <p>{LOCKED_ROW.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
              <div className={styles.lockCard} data-over={rows > 0 ? 'true' : 'fix'}>
                <p className={styles.lockCount}>
                  <b data-n={`+${held}`}>+{held}</b>
                  <span>{heldWord}</span>
                </p>
                <p className={styles.lockTitle}>Find {held === 1 ? 'it' : 'them all'} in the complete report.</p>
                {unlock === 'sent' ? (
                  <p className={styles.lockText}>
                    The complete report for {host} is on its way to {email.trim()}, within one working day. Want it fixed
                    sooner?{' '}
                    <Link href="/#contact" onClick={() => setEnquiryPrefill('ai-search')}>
                      Tell us about your site
                    </Link>
                    .
                  </p>
                ) : (
                  <>
                    <p className={styles.lockText}>
                      Every issue we found on {host} and what it takes to fix it, by email. Free, from a person, within one
                      working day.
                    </p>
                    <button type="button" className={styles.unlock} onClick={openGate}>
                      <LockIcon />
                      Email me the complete report
                    </button>
                  </>
                )}
              </div>
            </section>
          )}

          <section className={styles.beyond} aria-labelledby="beyond-title">
            <h2 id="beyond-title" className={styles.beyondTitle}>
              Sixteen checks read your page. <em>The audit gets you named.</em>
            </h2>
            <p className={styles.beyondLead}>
              A page engines can read is where it starts. Whether ChatGPT recommends you or your competitor comes down to
              things no score can see. Our AEO and GEO audit covers them, and we do the work.
            </p>
            <ul className={styles.beyondList}>
              {BEYOND.map((item) => (
                <li key={item.title}>
                  <b>{item.title}</b>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            <Link className={styles.upsellCta} href="/#contact" onClick={() => setEnquiryPrefill('ai-search')}>
              Ask about the audit
            </Link>
          </section>

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
              {unlock === 'sent' ? (
                <div className={styles.gateSent} role="status">
                  <h2 id="gate-title" className={styles.gateTitle} ref={sentRef} tabIndex={-1}>
                    Got it. <span>Your report is on its way.</span>
                  </h2>
                  <p className={styles.gateText}>
                    A person on our team writes the complete report for {host} and sends it to <b>{email.trim()}</b> from{' '}
                    {site.email} within one working day. If it isn&apos;t in your inbox by then, check spam.
                  </p>
                  <button type="button" className={styles.go} onClick={closeGate}>
                    Done
                  </button>
                </div>
              ) : (
              <>
              <h2 id="gate-title" className={styles.gateTitle}>
                <span>+{held}</span> more {heldWord} on {host}. Find {held === 1 ? 'it' : 'them all'} in the complete report.
              </h2>
              <p className={styles.gateText}>
                {shownFull === 0 ? 'You have seen what we found.' : shownFull === 1 ? 'You have seen the first fix.' : `You have seen the top ${shownFull}.`}{' '}
                Leave your email and we&apos;ll send the complete report: every issue we found
                and what it takes to fix it. Free, from a person, within one working day.
              </p>
              <form className={styles.gate} onSubmit={sendSummary} noValidate>
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
                    aria-invalid={emailBad}
                    aria-describedby={emailBad ? 'check-email-warning' : undefined}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailLeft(true)}
                  />
                  <button className={styles.go} type="submit" disabled={!emailOk || unlock === 'sending' || (captchaOn && !token)}>
                    {unlock === 'sending' ? 'Sending…' : 'Send it'}
                  </button>
                </div>
                {emailBad && <FieldWarning id="check-email-warning">{EMAIL_WARNING}</FieldWarning>}
                {captchaOn && emailOk && site.hcaptchaSiteKey && (
                  <div className={styles.captcha}>
                    <HCaptcha siteKey={site.hcaptchaSiteKey} onToken={setToken} resetKey={captchaReset} />
                  </div>
                )}
                {unlock === 'failed' && (
                  <FieldWarning>
                    That did not go through. Tick the box again and retry, or email {site.email} with your site.
                  </FieldWarning>
                )}
                {emailOk && captchaOn && !token && unlock !== 'sending' && (
                  <p className={styles.note}>Tick the box above to send.</p>
                )}
                <p className={styles.note}>One email with your report, maybe one follow-up. No newsletter.</p>
              </form>
              </>
              )}
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
