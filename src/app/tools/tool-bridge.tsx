'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { checker } from '@/data/ai-search-check'
import { site } from '@/data/site'
import { setEnquiryPrefill } from '@/lib/enquiry-prefill'
import styles from '@/app/tools/tool.module.css'

// The honest limit of every free tool, and the way on: the full check (their address carried
// over), the audit through the contact form, the Launch Kit, or a call.
export function ToolBridge({ fixes, detail }: { fixes: string; detail: string }) {
  const router = useRouter()
  const [url, setUrl] = useState('')
  return (
    <section className={styles.bridge} aria-labelledby="bridge-title" data-m="stagger">
      <p className={styles.bridgeTag}>what this tool can&apos;t do</p>
      <h2 id="bridge-title" className={styles.bridgeTitle}>
        {fixes}. <em>The audit covers the rest.</em>
      </h2>
      <p className={styles.bridgeText}>{detail}</p>
      <form
        className={styles.bridgeForm}
        onSubmit={(e) => {
          e.preventDefault()
          if (url.trim()) router.push(`${checker.path}/?url=${encodeURIComponent(url.trim())}`)
        }}
      >
        <label className="sr-only" htmlFor="bridge-url">
          Your website
        </label>
        <input id="bridge-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="yourproduct.com" inputMode="url" />
        <button type="submit" disabled={!url.trim()}>
          Run the full check
        </button>
      </form>
      <div className={styles.bridgeLinks}>
        <Link href="/#contact" onClick={() => setEnquiryPrefill('ai-search')}>
          Have us fix it all →
        </Link>
        <Link href="/launch-kit">Launching soon? See the Launch Kit →</Link>
        {site.calLink && (
          <a href={site.calLink} target="_blank" rel="noopener">
            Book a 30-min call ↗
          </a>
        )}
      </div>
    </section>
  )
}
