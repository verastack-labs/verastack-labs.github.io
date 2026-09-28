'use client'

import { useRef } from 'react'
import { contact } from '@/data/contact'
import { site } from '@/data/site'
import { BookCall } from '@/components/book-call'
import { VariableProximity } from '@/components/variable-proximity'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'
import { SentenceForm } from '@/scenes/contact/sentence-form'
import styles from '@/scenes/contact/contact.module.css'

// Spec 6.07. The booking card and the email line appear only once their values are set.
export function Contact() {
  const mode = useMotionPreference()
  const section = useRef<HTMLElement>(null)
  const side = site.calLink || site.email

  return (
    <section id="contact" ref={section} className={styles.contact}>
      <p className={styles.label}>
        /contact <em>{'//'}</em> start a project
      </p>
      <h2 className={styles.headline}>
        <VariableProximity text={contact.headline} host={section} active={mode === 'full'} />
      </h2>
      <div className={styles.grid} data-side={!!side}>
        <SentenceForm />
        {side && (
          <div className={styles.side}>
            <p className={styles.label}>or skip the form</p>
            {site.calLink && (
              <BookCall href={site.calLink} title={contact.booking.title} sub={contact.booking.sub} words={contact.booking.words} />
            )}
            {site.email && (
              <p className={styles.mail}>
                or write to <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
