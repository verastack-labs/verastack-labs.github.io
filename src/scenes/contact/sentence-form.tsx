'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { budgets } from '@/data/budgets'
import { contact } from '@/data/contact'
import { site } from '@/data/site'
import { filledCount, isEmail, mailtoHref, problemMessage, problems, sentence, type Enquiry } from '@/lib/enquiry'
import { takeEnquiryPrefill } from '@/lib/enquiry-prefill'
import { setCurrency, useCurrency } from '@/lib/use-currency'
import { HCaptcha } from '@/components/hcaptcha'
import styles from '@/scenes/contact/contact.module.css'

type Status = 'idle' | 'sending' | 'sent' | 'failed'

// Auto-sizes its field to the content: the label is a one-cell grid whose ::after holds the same
// text as the field, so the cell grows with it.
function Auto({ value, kind, children }: { value: string; kind: 'blank' | 'pick'; children: ReactNode }) {
  return (
    <label className={styles.auto} data-kind={kind} data-value={value}>
      {children}
    </label>
  )
}

export function SentenceForm() {
  const currency = useCurrency()
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState(contact.defaultService)
  const [budget, setBudget] = useState(contact.defaultBudget)
  const [timeline, setTimeline] = useState(contact.defaultTimeline)
  const [note, setNote] = useState('')
  const [noteOpen, setNoteOpen] = useState(false)
  const [bot, setBot] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const noteRef = useRef<HTMLTextAreaElement>(null)
  const [token, setToken] = useState<string | null>(null)
  const [captchaReset, setCaptchaReset] = useState(0)
  const [captchaShown, setCaptchaShown] = useState(false)

  // Arriving from the configurator's Pre-book button picks "a configurator" (spec 6.07).
  useEffect(() => {
    const apply = (id: string | null) => {
      const choice = id ? contact.prefillService[id] : undefined
      if (choice) setService(choice)
    }
    apply(takeEnquiryPrefill())
    const onPrefill = (e: Event) => apply((e as CustomEvent<string>).detail)
    window.addEventListener('enquiry-prefill', onPrefill)
    return () => window.removeEventListener('enquiry-prefill', onPrefill)
  }, [])

  const enquiry: Enquiry = { name, company, service, budget: budgets[currency][budget], timeline, email, note }
  const issues = problems(enquiry)
  const ready = Object.keys(issues).length === 0
  const locked = status === 'sent' || status === 'sending'
  // The captcha appears once the sentence can be sent, and stays once shown (spec 7.4).
  const captchaOn = !!(site.formAccessKey && site.hcaptchaSiteKey)
  if (captchaOn && ready && !captchaShown) setCaptchaShown(true)
  const needsToken = captchaOn && !token

  const pulse = (el: HTMLElement | null) => {
    if (!el) return
    el.classList.remove(styles.miss)
    void el.offsetWidth
    el.classList.add(styles.miss)
  }

  const send = async () => {
    if (locked) return
    if (!ready) {
      if (issues.name) pulse(nameRef.current)
      if (issues.email) pulse(emailRef.current)
      ;(issues.name ? nameRef : emailRef).current?.focus()
      setMessage(problemMessage(issues))
      return
    }
    // The honeypot: people never tick it, so pretend it went and send nothing.
    if (bot) {
      setStatus('sent')
      return
    }
    if (!site.formAccessKey) {
      setStatus('failed')
      return
    }
    if (needsToken) {
      setMessage('tick the box above to send')
      return
    }
    setStatus('sending')
    setMessage(null)
    try {
      const res = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: site.formAccessKey,
          subject: `Project enquiry from ${name.trim()}`,
          from_name: site.name,
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          service,
          budget: enquiry.budget,
          timeline,
          message: sentence(enquiry),
          ...(token ? { 'h-captcha-response': token } : {}),
        }),
      })
      const body = (await res.json().catch(() => null)) as { success?: boolean } | null
      const ok = res.ok && !!body?.success
      setStatus(ok ? 'sent' : 'failed')
      if (!ok) setCaptchaReset((n) => n + 1)
    } catch {
      setStatus('failed')
      setCaptchaReset((n) => n + 1)
    }
  }

  const hint =
    message ??
    (status === 'sending'
      ? 'sending…'
      : !ready
        ? 'fill the underlined blanks to send'
        : needsToken
          ? 'one quick check above, then send'
          : 'ready when you are')

  return (
    <form
      className={styles.form}
      data-status={status}
      noValidate
      // POST, so a press before the page has loaded never puts personal details in a URL.
      method="post"
      onSubmit={(e) => {
        e.preventDefault()
        void send()
      }}
    >
      <div className={styles.legend}>
        <span>fill in the sentence:</span>
        <span>
          <span className={styles.keyBlank}>underlined</span> type here
        </span>
        <span>
          <span className={styles.keyPick}>green</span> tap to change
        </span>
        <span className={styles.count} aria-live="polite">
          <b>{filledCount(enquiry)}</b> of 3 filled
        </span>
      </div>

      <p className={styles.sentence}>
        Hi, I&apos;m{' '}
        <Auto value={name || 'your name'} kind="blank">
          <span className="sr-only">Your name</span>
          <input
            ref={nameRef}
            className={styles.blank}
            data-ok={!!name.trim()}
            name="name"
            placeholder="your name"
            autoComplete="name"
            required
            readOnly={locked}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              e.target.classList.remove(styles.miss)
              setMessage(null)
            }}
          />
        </Auto>{' '}
        from{' '}
        <Auto value={company || 'company (optional)'} kind="blank">
          <span className="sr-only">Company (optional)</span>
          <input
            className={styles.blank}
            data-ok={!!company.trim()}
            name="company"
            placeholder="company (optional)"
            autoComplete="organization"
            readOnly={locked}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </Auto>
        . We need{' '}
        <Auto value={service} kind="pick">
          <span className="sr-only">What you need</span>
          <select className={styles.pick} name="service" disabled={locked} value={service} onChange={(e) => setService(e.target.value)}>
            {contact.services.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Auto>{' '}
        with a budget of{' '}
        <Auto value={budgets[currency][budget]} kind="pick">
          <span className="sr-only">Budget</span>
          <select
            className={styles.pick}
            name="budget"
            disabled={locked}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
          >
            {budgets[currency].map((b, i) => (
              <option key={b} value={i}>
                {b}
              </option>
            ))}
          </select>
        </Auto>
        , ideally live by{' '}
        <Auto value={timeline} kind="pick">
          <span className="sr-only">Timeline</span>
          <select className={styles.pick} name="timeline" disabled={locked} value={timeline} onChange={(e) => setTimeline(e.target.value)}>
            {contact.timelines.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Auto>
        . Reach me at{' '}
        <Auto value={email || 'you@company.com'} kind="blank">
          <span className="sr-only">Email</span>
          <input
            ref={emailRef}
            className={styles.blank}
            data-ok={isEmail(email)}
            type="email"
            name="email"
            placeholder="you@company.com"
            autoComplete="email"
            required
            readOnly={locked}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              e.target.classList.remove(styles.miss)
              setMessage(null)
            }}
          />
        </Auto>
        .
      </p>

      <div className={styles.tools}>
        <span className={styles.currency} role="group" aria-label="Budget currency">
          {(['inr', 'usd'] as const).map((c) => (
            <button key={c} type="button" aria-pressed={currency === c} disabled={locked} onClick={() => setCurrency(c)}>
              {c === 'inr' ? '₹' : '$'}
            </button>
          ))}
        </span>
        {status !== 'sent' && (
          <button
            type="button"
            className={styles.noteToggle}
            aria-expanded={noteOpen}
            aria-controls="enquiry-note"
            onClick={() => {
              setNoteOpen((o) => !o)
              if (!noteOpen) window.setTimeout(() => noteRef.current?.focus(), 300)
            }}
          >
            <i aria-hidden="true">+</i> add a note (links, context, anything)
          </button>
        )}
      </div>
      <div id="enquiry-note" className={styles.note} data-open={noteOpen}>
        <div>
          <label>
            <span className="sr-only">A note</span>
            <textarea
              ref={noteRef}
              name="note"
              rows={3}
              readOnly={locked}
              tabIndex={noteOpen ? 0 : -1}
              placeholder="What it is, who it's for, links to anything similar you like"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* Hidden from people; bots fill it in. */}
      <label className={styles.honeypot} aria-hidden="true">
        Leave this empty
        <input type="checkbox" name="botcheck" tabIndex={-1} checked={bot} onChange={(e) => setBot(e.target.checked)} />
      </label>

      {captchaShown && site.hcaptchaSiteKey && status !== 'sent' && (
        <div className={styles.captcha}>
          <HCaptcha siteKey={site.hcaptchaSiteKey} onToken={setToken} resetKey={captchaReset} />
        </div>
      )}

      {status === 'sent' ? (
        <p className={styles.sent} role="status">
          <b>
            Sent. <em>We&apos;ll reply {site.replyPromise}.</em>
          </b>
        </p>
      ) : (
        <div className={styles.row}>
          <button type="submit" className={styles.send} aria-disabled={!ready || needsToken || status === 'sending'}>
            Send it →
          </button>
          <span className={styles.hint} aria-live="polite">
            {status === 'failed' ? (
              site.email ? (
                <>
                  that didn&apos;t go through.{' '}
                  <a href={mailtoHref(site.email, enquiry)}>email it instead ↗</a>
                </>
              ) : (
                "that didn't go through. Please try again in a little while."
              )
            ) : (
              hint
            )}
          </span>
        </div>
      )}
    </form>
  )
}
