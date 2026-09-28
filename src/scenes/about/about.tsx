'use client'

import { products } from '@/data/products'
import { site } from '@/data/site'
import { team } from '@/data/team'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'
import { CapabilitiesRow } from '@/scenes/about/capabilities-row'
import styles from '@/scenes/about/about.module.css'

// Unpinned on purpose: the page's breather after four pinned scenes (spec 5.3, 6.06).
export function About() {
  const mode = useMotionPreference()
  return (
    <section id="about" className={styles.about}>
      <p className={styles.label}>
        /about <em>{'//'}</em> the studio
      </p>
      <h2 className={styles.headline}>
        Design and engineering. <em>One studio.</em>
      </h2>
      <p className={styles.statement}>
        {site.name} is a design and engineering studio.{' '}
        <b>We build web experiences, apps, content systems and 3D on the web for clients, and our own products alongside them.</b>{' '}
        Design and build happen in the same hands, so nothing gets lost between a mockup and a handover.
      </p>
      <CapabilitiesRow key={mode} animate={mode !== 'static'} />
      {team.length > 0 && (
        <ul className={styles.team}>
          {team.map((m) => (
            <li key={m.name}>
              {m.link ? (
                <a href={m.link} target="_blank" rel="noopener">
                  {m.name}
                </a>
              ) : (
                m.name
              )}
              <span>{m.role}</span>
            </li>
          ))}
        </ul>
      )}
      <p className={styles.foot}>
        <span>
          founded by <b>{site.founderName}</b>
        </span>
        <span>
          based in <b>{site.basedIn}</b>
        </span>
        <span>
          products <b>{products.map((p) => p.name).join(' · ')}</b>
        </span>
        <a href={site.founderUrl} target="_blank" rel="noopener">
          {site.founderUrl.replace('https://', '')} ↗
        </a>
      </p>
    </section>
  )
}
