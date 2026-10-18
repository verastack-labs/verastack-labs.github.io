'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import type { TitlePart } from '@/lib/blog'
import styles from '@/scenes/notes/notes.module.css'

export type NoteCard = {
  slug: string
  titleParts: TitlePart[]
  description: string
  date: string
  category: string
  stat: { value: string; label: string } | null
}

// The featured card is drawn at random from the newest few posts that carry a headline number, once
// per page load. The server (and search engines) get the newest of them; the section sits far down
// the page and reveals on scroll, so the swap happens before anyone sees it.
const POOL = 4
let draw: number | null = null
const noSubscribe = () => () => {}
const pick = (size: number) => () => {
  if (draw === null) draw = Math.floor(Math.random() * size)
  return draw
}

function Title({ parts }: { parts: TitlePart[] }) {
  return (
    <>
      {parts.map((p, i) =>
        p.hi ? (
          <span key={i} className={styles.hi}>
            {p.text}
          </span>
        ) : (
          p.text
        ),
      )}
    </>
  )
}

export function Notes({ posts }: { posts: NoteCard[] }) {
  const pool = posts.filter((p) => p.stat).slice(0, POOL)
  const index = useSyncExternalStore(noSubscribe, pick(Math.max(pool.length, 1)), () => 0)
  const featured = pool[index] ?? posts[0]
  const rest = posts.filter((p) => p !== featured).slice(0, 3)
  if (!featured) return null

  return (
    <section id="notes" className={styles.notes} aria-labelledby="notes-title">
      <div className={styles.top} data-reveal>
        <div>
          <p className={styles.label}>
            /notes <em>{'//'}</em> from the blog
          </p>
          <h2 id="notes-title" className={styles.headline}>
            We measure <em>before</em>
            <br />
            we pitch.
          </h2>
        </div>
        <Link className={styles.all} href="/blog">
          All notes →
        </Link>
      </div>
      <div className={styles.grid} data-reveal>
        <Link className={styles.feature} href={`/blog/${featured.slug}`}>
          <span className={styles.meta}>
            <span className={styles.chip}>{featured.category}</span>
            {featured.date}
          </span>
          <b className={styles.featureTitle}>
            <Title parts={featured.titleParts} />
          </b>
          <span className={styles.desc}>{featured.description}</span>
          {featured.stat && (
            <span className={styles.stat}>
              {featured.stat.value}
              <small>{featured.stat.label}</small>
            </span>
          )}
          <span className={styles.read}>Read it →</span>
        </Link>
        <ul className={styles.list}>
          {rest.map((p) => (
            <li key={p.slug}>
              <Link className={styles.row} href={`/blog/${p.slug}`}>
                <span className={styles.meta}>
                  <span className={styles.chip}>{p.category}</span>
                  {p.date}
                </span>
                <b>
                  <Title parts={p.titleParts} />
                </b>
                <span className={styles.desc}>{p.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
