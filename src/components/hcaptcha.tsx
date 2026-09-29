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
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => onTokenRef.current(null),
        })
      })
      .catch(() => onTokenRef.current(null))
    return () => {
      cancelled = true
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
