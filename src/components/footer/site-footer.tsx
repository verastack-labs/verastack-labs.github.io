import { products } from '@/data/products'
import { booking, site } from '@/data/site'
import { GiantWordmark } from '@/components/footer/giant-wordmark'
import { IndiaClock } from '@/components/footer/india-clock'
import styles from '@/components/footer/footer.module.css'

export function SiteFooter() {
  const year = 2026
  return (
    <footer className={styles.footer}>
      <div className={styles.cols}>
        <div className={`${styles.col} ${styles.lead}`}>
          <h3>start a project</h3>
          {site.email ? (
            <a className={styles.mail} href={`mailto:${site.email}`}>
              {site.email}
            </a>
          ) : (
            <a className={styles.mail} href="#contact">
              Start a project
            </a>
          )}
          <div>
            or{' '}
            <a href={booking.href} {...(booking.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
              book a 20-min call ↗
            </a>
          </div>
        </div>
        <div className={styles.col}>
          <h3>products</h3>
          <ul className="m-0 list-none p-0">
            {products.map((p) => (
              <li key={p.name}>
                {p.url ? <a href={p.url}>{p.name} ↗</a> : p.name}
                {p.status === 'coming-soon' && <span className={styles.soon}> soon</span>}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.col}>
          <h3>elsewhere</h3>
          <a href={site.githubUrl}>GitHub ↗</a>
          <br />
          <a href={site.founderUrl}>founder&apos;s portfolio ↗</a>
        </div>
        <div className={styles.col}>
          <h3>studio</h3>
          <IndiaClock />
          <br />
          based in {site.basedIn}
        </div>
      </div>
      <div className={styles.bar}>
        <span>
          © {year} {site.name}
        </span>
        <a className={styles.top} href="#top">
          back to top ↑
        </a>
      </div>
      <GiantWordmark />
    </footer>
  )
}
