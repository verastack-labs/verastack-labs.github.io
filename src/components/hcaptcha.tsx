'use client'

import { useEffect, useRef } from 'react'

type HCaptchaApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  reset: (id?: string) => void
  remove: (id: string) => void
}

declare global {
  interface Window {
    hcaptcha?: HCaptchaApi
    __hcaptchaReady?: () => void
  }
}

let loading: Promise<HCaptchaApi> | null = null

// Loads hCaptcha once, on demand, so visitors who never fill the form never download it.
function loadHCaptcha(): Promise<HCaptchaApi> {
  if (window.hcaptcha) return Promise.resolve(window.hcaptcha)
  loading ??= new Promise((resolve, reject) => {
    window.__hcaptchaReady = () => resolve(window.hcaptcha!)
    const script = document.createElement('script')
    script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit&onload=__hcaptchaReady&recaptchacompat=off'
    script.async = true
    script.onerror = () => {
      loading = null
      reject(new Error('hCaptcha failed to load'))
    }
    document.head.appendChild(script)
  })
  return loading
}

// A challenge opens as a floating frame at the end of <body>. When the checkbox sits in a modal
// <dialog>, the dialog is in the browser's top layer and covers that frame. Turning the frame into
// a manual popover lifts it into the top layer too, above the dialog, without moving it in the
// page (moving an iframe would reload it).
function challengeFrame(): HTMLElement | null {
  const frame = document.querySelector<HTMLIFrameElement>('iframe[src*="hcaptcha"][src*="frame=challenge"]')
  let el: HTMLElement | null = frame
  while (el?.parentElement && el.parentElement !== document.body) el = el.parentElement
  return el?.parentElement === document.body ? el : null
}

function raiseChallenge(box: HTMLElement | null, tries = 10) {
  if (!box?.closest('dialog[open]')) return
  const el = challengeFrame()
  if (!el) {
    if (tries > 0) requestAnimationFrame(() => raiseChallenge(box, tries - 1))
    return
  }
  if (typeof el.showPopover !== 'function') return
  el.setAttribute('popover', 'manual')
  el.classList.add('hcaptcha-raised')
  try {
    el.showPopover()
  } catch {}
}

function lowerChallenge() {
  for (const el of document.querySelectorAll<HTMLElement>('.hcaptcha-raised')) {
    try {
      el.hidePopover()
    } catch {}
    el.removeAttribute('popover')
    el.classList.remove('hcaptcha-raised')
  }
}

// The hCaptcha checkbox. Calls onToken with a token when solved and with null when it expires
// or errors. Bump `resetKey` to clear it (tokens are single use).
export function HCaptcha({
  siteKey,
  onToken,
  resetKey,
}: {
  siteKey: string
  onToken: (token: string | null) => void
  resetKey: number
}) {
  const box = useRef<HTMLDivElement>(null)
  const widget = useRef<string | null>(null)
  const onTokenRef = useRef(onToken)

  useEffect(() => {
    onTokenRef.current = onToken
  })

  useEffect(() => {
    let cancelled = false
    loadHCaptcha()
      .then((api) => {
        if (cancelled || !box.current) return
        widget.current = api.render(box.current, {
          sitekey: siteKey,
          theme: 'dark',
          callback: (token: string) => {
            lowerChallenge()
            onTokenRef.current(token)
          },
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => {
            lowerChallenge()
            onTokenRef.current(null)
          },
          'open-callback': () => raiseChallenge(box.current),
          'close-callback': () => lowerChallenge(),
          'chalexpired-callback': () => lowerChallenge(),
        })
      })
      .catch(() => onTokenRef.current(null))
    return () => {
      cancelled = true
      lowerChallenge()
      if (widget.current && window.hcaptcha) window.hcaptcha.remove(widget.current)
      widget.current = null
    }
  }, [siteKey])

  useEffect(() => {
    if (resetKey > 0 && widget.current && window.hcaptcha) {
      window.hcaptcha.reset(widget.current)
      onTokenRef.current(null)
    }
  }, [resetKey])

  return <div ref={box} />
}
