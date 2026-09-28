'use client'

import { useRef } from 'react'
import { contact } from '@/data/contact'
import { booking, site } from '@/data/site'
import { BookCall } from '@/components/book-call'
import { VariableProximity } from '@/components/variable-proximity'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'
import { SentenceForm } from '@/scenes/contact/sentence-form'
import styles from '@/scenes/contact/contact.module.css'

// Spec 6.07. The booking card is always shown; the email line appears once an email is set.
export function Contact() {
  const mode = useMotionPreference()
  const section = useRef<HTMLElement>(null)

  return (
    <section id="contact" ref={section} className={styles.contact}>
      <p className={styles.label}>
        /contact <em>{'//'}</em> start a project
      </p>
      <h2 className={styles.headline}>
        <VariableProximity text={contact.headline} host={section} active={mode === 'full'} />
      </h2>
      <div className={styles.grid} data-side>
        <SentenceForm />
        <div className={styles.side}>
          <p className={styles.label}>or skip the form</p>
          <BookCall
            href={booking.href}
            external={booking.external}
            title={contact.booking.title}
            sub={contact.booking.sub}
            words={contact.booking.words}
          />
          {site.email && (
            <p className={styles.mail}>
              or write to <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
