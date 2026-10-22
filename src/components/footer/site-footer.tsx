import Link from 'next/link'
import { hero } from '@/data/hero'
import { products } from '@/data/products'
import { booking, site } from '@/data/site'
import { CopyEmail } from '@/components/footer/copy-email'
import { GiantWordmark } from '@/components/footer/giant-wordmark'
import { IndiaClock } from '@/components/footer/india-clock'
import styles from '@/components/footer/footer.module.css'

// Studio pages and profiles, in the "elsewhere" column. External ones open with an arrow.
const elsewhere = [
  { href: '/launch-kit', label: 'SaaS launch kit' },
  { href: '/films', label: 'films' },
  { href: '/blog', label: 'blog' },
  { href: '/tools', label: 'free tools' },
  { href: '/founder', label: 'founder' },
  { href: site.githubUrl, label: 'GitHub', external: true },
  { href: site.founderUrl, label: "founder's portfolio", external: true },
]

const Ext = () => (
  <span className={styles.ext} aria-hidden="true">
    ↗
  </span>
)

export function SiteFooter() {
  const year = 2026
  return (
    <footer className={styles.footer}>
      <div className={styles.cols}>
        <div className={`${styles.col} ${styles.lead}`}>
          <h3>start a project</h3>
          <p className={styles.line}>
            {hero.lead}
            <em>{hero.accent}</em>
            {hero.tail}
          </p>
          {site.email ? (
            <div className={styles.mailRow}>
              <a className={styles.mail} href={`mailto:${site.email}`}>
                {site.email}
                <span className={styles.mailArrow} aria-hidden="true">
                  →
                </span>
              </a>
              <CopyEmail email={site.email} />
            </div>
          ) : (
            <a className={styles.mail} href="#contact">
              Start a project
            </a>
          )}
          <a className={styles.call} href={booking.href} {...(booking.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
            <b aria-hidden="true" />
            book a 30-min call
            <Ext />
          </a>
        </div>
        <div className={styles.col}>
          <h3>products</h3>
          <ul className={styles.links}>
            {products.map((p) => (
              <li key={p.name}>
                {p.url ? (
                  <a href={p.url}>
                    {p.name}
                    <Ext />
                  </a>
                ) : (
                  p.name
                )}
                {p.status === 'coming-soon' && <span className={styles.soon}>soon</span>}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.col}>
          <h3>elsewhere</h3>
          <ul className={styles.links}>
            {elsewhere.map((l) => (
              <li key={l.href}>
                {l.external ? (
                  <a href={l.href}>
                    {l.label}
                    <Ext />
                  </a>
                ) : (
                  <Link href={l.href}>{l.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.col}>
          <h3>studio</h3>
          <IndiaClock />
          <br />
          based in {site.basedIn}
          <br />
          working with clients anywhere
        </div>
      </div>
      <div className={styles.bar}>
        <span>
          © {year} {site.name}
        </span>
        <a className={styles.top} href="#top">
          back to top <span aria-hidden="true">↑</span>
        </a>
      </div>
      <GiantWordmark />
    </footer>
  )
}
