'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { booking } from '@/data/site'
import type { Post } from '@/lib/blog'
import styles from '@/app/blog/blog.module.css'

// The highlighted hook: one line that invites a founder in, and its button.
export function PostHook({ hook }: { hook: NonNullable<Post['hook']> }) {
  const call = hook.href === 'call'
  const href = call ? booking.href : hook.href
  return (
    <aside className={styles.hook}>
      <p>{hook.text}</p>
      {href.startsWith('/') ? (
        <Link className={styles.hookCta} href={href}>
          {hook.label}
        </Link>
      ) : (
        <a className={styles.hookCta} href={href} {...(call && booking.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
          {hook.label}
        </a>
      )}
    </aside>
  )
}

// The inline check at the end of every post: an address goes straight to the AI search check.
export function PostCheck({ compare }: { compare: string | null }) {
  const router = useRouter()
  const [url, setUrl] = useState('')
  return (
    <section className={styles.check} aria-labelledby="post-check-title">
      <h2 id="post-check-title">How does your site read to AI search?</h2>
      <p>{compare ?? 'Sixteen checks, a score out of 100 and your top three fixes, in about ten seconds. Free.'}</p>
      <form
        className={styles.checkForm}
        onSubmit={(e) => {
          e.preventDefault()
          if (url.trim()) router.push(`/ai-search-check/?url=${encodeURIComponent(url.trim())}`)
        }}
      >
        <label className="sr-only" htmlFor="post-check-url">
          Website address
        </label>
        <input
          id="post-check-url"
          type="text"
          inputMode="url"
          autoComplete="url"
          spellCheck={false}
          placeholder="yourproduct.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit" disabled={!url.trim()}>
          Check it
        </button>
      </form>
    </section>
  )
}
