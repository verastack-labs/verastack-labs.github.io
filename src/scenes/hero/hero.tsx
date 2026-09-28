import { hero } from '@/data/hero'
import { site } from '@/data/site'
import { DotMatrix } from '@/scenes/hero/dot-matrix'
import styles from '@/scenes/hero/hero.module.css'

export function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <DotMatrix />
      <p className={styles.label}>
        / <em>{'//'}</em> {hero.label}
      </p>
      <h1 className={styles.headline}>
        {hero.lead}
        <em>{hero.accent}</em>
        {hero.tail}
      </h1>
      <div className={styles.row}>
        <div className={styles.ctas}>
          <a className={styles.primary} href={hero.primary.href}>
            {hero.primary.label}
          </a>
          <a className={styles.secondary} href={hero.secondary.href}>
            {hero.secondary.label}
          </a>
        </div>
        <div className={styles.meta}>
          {site.availability && (
            <span className={styles.status}>
              <b aria-hidden="true">●</b>
              {site.availability}
            </span>
          )}
          <span aria-hidden="true">scroll ↓</span>
        </div>
      </div>
    </section>
  )
}
