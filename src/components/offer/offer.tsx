'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { FieldWarning } from '@/components/field-warning'
import { HCaptcha } from '@/components/hcaptcha'
import { checker } from '@/data/ai-search-check'
import { offer } from '@/data/offer'
import { site } from '@/data/site'
import { EMAIL_WARNING, isEmail } from '@/lib/enquiry'
import { FINE_QUERY } from '@/lib/motion/mode'
import { lenisRef } from '@/lib/motion/smooth-scroll'
import { countPage, markOfferDone, offerDone, offerDue, offerMoment, readLastShown, writeLastShown } from '@/lib/offer'
import styles from '@/components/offer/offer.module.css'

// Matches the exit transition on .dialog in offer.module.css.
const EXIT_MS = 320

// False on the server and during hydration, true after: the pill depends on local storage.
const noSubscribe = () => () => {}
const useHydrated = () => useSyncExternalStore(noSubscribe, () => true, () => false)

// Somewhere the offer would get in the way: the contact form in view or in use, another dialog
// open (the film player), the visitor typing in any field, or a page part that asks for quiet with
// data-offer-hold (the AI search check while a result is on screen).
function pageBusy(): boolean {
  if (document.querySelector('dialog[open], [data-offer-hold]')) return true
  const active = document.activeElement
  if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement || active instanceof HTMLSelectElement) return true
  const contact = document.getElementById('contact')
  if (!contact) return false
  if (contact.contains(active)) return true
  const r = contact.getBoundingClientRect()
  return r.top < window.innerHeight && r.bottom > 0
}

function VideoForm({ sent, onSent }: { sent: boolean; onSent: () => void }) {
  const [product, setProduct] = useState('')
  const [email, setEmail] = useState('')
  // The email warning waits until the field is left, so typing is never interrupted.
  const [emailLeft, setEmailLeft] = useState(false)
  const [note, setNote] = useState('')
  const [bot, setBot] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [captchaReset, setCaptchaReset] = useState(0)
  const [status, setStatus] = useState<'idle' | 'sending' | 'failed'>('idle')

  const ready = !!product.trim() && isEmail(email)
  const emailBad = emailLeft && !!email.trim() && !isEmail(email)
  const captchaOn = !!(site.formAccessKey && site.hcaptchaSiteKey)

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ready || status === 'sending') return
    // The honeypot: people never tick it, so pretend it went and send nothing.
    if (bot) return onSent()
    if (!site.formAccessKey) return setStatus('failed')
    if (captchaOn && !token) return
    setStatus('sending')
    try {
      const res = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: site.formAccessKey,
          subject: `Free product video application: ${product.trim()}`,
          from_name: site.name,
          email: email.trim(),
          product: product.trim(),
          note: note.trim() || 'none',
          ...(token ? { 'h-captcha-response': token } : {}),
        }),
      })
      const body = (await res.json().catch(() => null)) as { success?: boolean } | null
      if (res.ok && body?.success) {
        onSent()
      } else {
        setStatus('failed')
        setCaptchaReset((n) => n + 1)
      }
    } catch {
      setStatus('failed')
      setCaptchaReset((n) => n + 1)
    }
  }

  if (sent) {
    return (
      <p className={styles.sent} role="status">
        <b>Got it.</b> We&apos;ll reply {site.replyPromise}.
      </p>
    )
  }

  return (
    // POST, so a press before the page has loaded never puts personal details in a URL.
    <form className={styles.form} method="post" onSubmit={send} noValidate>
      <label className={styles.field}>
        <span className="sr-only">Product name or address</span>
        <input
          className={styles.input}
          name="product"
          placeholder="product name or URL"
          autoComplete="off"
          spellCheck={false}
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />
      </label>
      <label className={styles.field}>
        <span className="sr-only">Email</span>
        <input
          className={styles.input}
          type="email"
          name="email"
          placeholder="you@company.com"
          autoComplete="email"
          value={email}
          aria-invalid={emailBad}
          aria-describedby={emailBad ? 'offer-email-warning' : undefined}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setEmailLeft(true)}
        />
      </label>
      {emailBad && <FieldWarning id="offer-email-warning">{EMAIL_WARNING}</FieldWarning>}
      <label className={styles.field}>
        <span className="sr-only">One line about it (optional)</span>
        <input
          className={styles.input}
          name="note"
          placeholder="one line about it (optional)"
          maxLength={200}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      {/* Hidden from people; bots fill it in. */}
      <label className={styles.honeypot} aria-hidden="true">
        Leave this empty
        <input type="checkbox" name="botcheck" tabIndex={-1} checked={bot} onChange={(e) => setBot(e.target.checked)} />
      </label>
      {captchaOn && ready && site.hcaptchaSiteKey && (
        <div className={styles.captcha}>
          <HCaptcha siteKey={site.hcaptchaSiteKey} onToken={setToken} resetKey={captchaReset} />
        </div>
      )}
      <button className={styles.go} type="submit" disabled={!ready || status === 'sending' || (captchaOn && !token)}>
        {status === 'sending' ? 'Sending…' : offer.video.submit}
      </button>
      {status === 'failed' && (
        <FieldWarning>
          That did not go through. Tick the box again and retry
          {site.email && (
            <>
              , or write to <a href={`mailto:${site.email}`}>{site.email}</a>
            </>
          )}
          .
        </FieldWarning>
      )}
      <p className={styles.hint} aria-live="polite">
        {status === 'failed' ? null : !ready ? (
          'A name or link and an email, then one quick check.'
        ) : captchaOn && !token ? (
          'One quick check above, then apply.'
        ) : (
          'Ready when you are.'
        )}
      </p>
    </form>
  )
}

function CheckForm({ onGo }: { onGo: (url: string) => void }) {
  const [url, setUrl] = useState('')
  return (
    <form
      className={styles.inline}
      onSubmit={(e) => {
        e.preventDefault()
        if (url.trim()) onGo(url.trim())
      }}
      noValidate
    >
      <label className={styles.field}>
        <span className="sr-only">Website address</span>
        <input
          className={styles.input}
          type="text"
          inputMode="url"
          autoComplete="url"
          spellCheck={false}
          placeholder="yourproduct.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </label>
      <button className={styles.go} type="submit" disabled={!url.trim()}>
        {offer.check.submit}
      </button>
    </form>
  )
}

// The site-wide offer: a free product video application and the free AI search check, in a dialog
// that opens by itself at a natural pause, at most once every 14 days (src/lib/offer.ts). Once closed, a pill
// at the bottom right reopens it. On the checker page only the video offer shows.
export function Offer() {
  const pathname = usePathname()
  const router = useRouter()
  const onChecker = !!pathname?.startsWith(checker.path)
  const dialog = useRef<HTMLDialogElement>(null)
  const pill = useRef<HTMLButtonElement>(null)
  const hydrated = useHydrated()
  // waiting: due and not shown yet; open; pill: closed, shown in the last 14 days, or done with.
  const [phase, setPhase] = useState<'waiting' | 'open' | 'pill'>(() =>
    typeof window !== 'undefined' && !offerDue(readLastShown(), Date.now(), offerDone()) ? 'pill' : 'waiting',
  )
  // Pages seen in this visit, counted on each arrival.
  const pages = useRef(0)
  const counted = useRef<string | null>(null)
  useEffect(() => {
    if (counted.current === pathname) return
    counted.current = pathname
    pages.current = countPage()
  }, [pathname])
  // The content stays mounted until the exit animation has played, then unmounts.
  const [mounted, setMounted] = useState(false)
  const unmount = useRef<number | undefined>(undefined)
  const [applied, setApplied] = useState(false)
  // The pill hides over the contact section and the footer, so it never covers the booking card.
  const [covered, setCovered] = useState(false)
  // Opened from the pill, so focus goes back to it on close.
  const fromPill = useRef(false)

  const open = useCallback((byPill: boolean) => {
    window.clearTimeout(unmount.current)
    fromPill.current = byPill
    if (!byPill) writeLastShown(Date.now())
    setMounted(true)
    setPhase('open')
  }, [])

  // Undo everything opening did. Called directly from every way out (button, backdrop, Escape),
  // with the dialog's close event as a backstop, so it never waits on that event.
  const release = useCallback(() => {
    lenisRef.current?.start()
    document.documentElement.style.overflow = ''
    setPhase('pill')
    window.clearTimeout(unmount.current)
    unmount.current = window.setTimeout(() => setMounted(false), EXIT_MS)
  }, [])

  const shut = useCallback(() => {
    const d = dialog.current
    if (d?.open) d.close()
    release()
  }, [release])

  // The triggers (src/lib/offer.ts): a laptop pointer heading for the tabs, or a pause in
  // scrolling once the visitor has read past Work on the home page or spent 45 seconds on a later
  // page. Checked every half second; it opens once nothing on the page is busy.
  useEffect(() => {
    if (phase !== 'waiting') return
    const arrived = Date.now()
    let lastScroll = 0
    let exitIntent = false
    const check = () => {
      const work = pathname === '/' ? document.getElementById('work') : null
      const now = Date.now()
      const due = offerMoment({
        exitIntent,
        idleMs: now - lastScroll,
        onHome: pathname === '/',
        pastWork: !!work && work.getBoundingClientRect().bottom < window.innerHeight * 0.3,
        readMs: now - arrived,
        pagesThisVisit: pages.current,
      })
      if (due && !pageBusy()) open(false)
    }
    const onScroll = () => {
      lastScroll = Date.now()
    }
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) {
        exitIntent = true
        check()
      }
    }
    const poll = window.setInterval(check, 500)
    const exitWatch = window.matchMedia(FINE_QUERY).matches
    window.addEventListener('scroll', onScroll, { passive: true })
    if (exitWatch) document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.clearInterval(poll)
      window.removeEventListener('scroll', onScroll)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [phase, open, pathname])

  useEffect(() => {
    const d = dialog.current
    if (phase !== 'open' || !d) return
    if (!d.open) d.showModal()
    lenisRef.current?.stop()
    document.documentElement.style.overflow = 'hidden'
    const onCancel = (e: Event) => {
      e.preventDefault()
      shut()
    }
    d.addEventListener('cancel', onCancel)
    d.addEventListener('close', release)
    return () => {
      d.removeEventListener('cancel', onCancel)
      d.removeEventListener('close', release)
    }
  }, [phase, release, shut])

  useEffect(() => {
    if (phase === 'pill' && fromPill.current) {
      fromPill.current = false
      pill.current?.focus()
    }
  }, [phase])

  useEffect(() => {
    const targets = [document.getElementById('contact'), document.querySelector('footer')].filter(
      (el): el is HTMLElement => el instanceof HTMLElement,
    )
    const seen = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? seen.add(en.target) : seen.delete(en.target)))
      setCovered(seen.size > 0)
    })
    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  // Close before leaving, so the checker page opens without the dialog over it.
  const goCheck = (url: string) => {
    shut()
    router.push(`${checker.path}/?url=${encodeURIComponent(url)}`)
  }

  const showCheck = !onChecker

  return (
    <>
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-label={showCheck ? 'Two free offers' : offer.video.title}
        data-lenis-prevent
        onClick={(e) => e.target === e.currentTarget && shut()}
      >
        {mounted && (
          <div className={styles.inner}>
            <div className={styles.bar}>
              <p className={styles.label}>
                /offer <em>{'//'}</em> {showCheck ? offer.label : offer.video.label}
              </p>
              <button type="button" className={styles.close} onClick={shut}>
                close ✕
              </button>
            </div>
            <div className={styles.grid} data-single={!showCheck || undefined}>
              <section className={styles.card} aria-labelledby="offer-video">
                {showCheck && (
                  <p className={styles.label}>
                    /offer <em>{'//'}</em> {offer.video.label}
                  </p>
                )}
                <h2 id="offer-video" className={styles.title}>
                  {offer.video.title}
                </h2>
                <p className={styles.body}>{offer.video.body}</p>
                <p className={styles.proof}>{offer.video.proof}</p>
                <VideoForm
                  sent={applied}
                  onSent={() => {
                    markOfferDone()
                    setApplied(true)
                  }}
                />
              </section>
              {showCheck && (
                <section className={styles.card} aria-labelledby="offer-check">
                  <p className={styles.label}>
                    /offer <em>{'//'}</em> {offer.check.label}
                  </p>
                  <h2 id="offer-check" className={styles.title}>
                    {offer.check.title}
                  </h2>
                  <p className={styles.body}>{offer.check.body}</p>
                  <CheckForm onGo={goCheck} />
                </section>
              )}
            </div>
          </div>
        )}
      </dialog>
      {hydrated && phase === 'pill' && (
        <button
          ref={pill}
          type="button"
          className={styles.pill}
          data-hidden={covered || undefined}
          aria-hidden={covered || undefined}
          tabIndex={covered ? -1 : undefined}
          onClick={() => open(true)}
        >
          <i aria-hidden="true" />
          {showCheck ? offer.pill.both : offer.pill.video}
        </button>
      )}
    </>
  )
}
