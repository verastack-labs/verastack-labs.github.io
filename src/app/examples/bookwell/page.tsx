import type { Metadata } from 'next'
import { Sora } from 'next/font/google'
import Link from 'next/link'
import { shareImage, site } from '@/data/site'
import { jsonLd, studioNode } from '@/lib/structured-data'
import styles from '@/app/examples/bookwell/bookwell.module.css'

// An example launch page for a made-up product, built for the blog post "Spot the slop". It shows
// what we would ship for a client: its own brand, copy that says what the product does, real text in
// the HTML, structured data, an FAQ, and honest placeholders where a new product has no proof yet.
// Bookwell is not a real company; the banner says so, and it stays out of the sitemap.

const display = Sora({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-bw-display', display: 'swap' })

const title = 'Bookwell: appointment booking for small clinics (example)'
const description =
  'Bookwell lets patients book a clinic appointment in under a minute and sends reminders that cut no-shows. An example page for a made-up product, by VeraStack Labs.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/examples/bookwell' },
  openGraph: { title, description, url: `${site.url}/examples/bookwell/`, siteName: site.name, type: 'website', images: [shareImage] },
  twitter: { card: 'summary_large_image', title, description, images: [shareImage] },
}

const faqs = [
  {
    q: 'Do my patients need to download an app?',
    a: 'No. They book from a link on your website, Google profile or WhatsApp, on any phone, without an account.',
  },
  {
    q: 'Will it work with how my front desk works today?',
    a: 'Yes. Staff see the same calendar, can still add phone bookings by hand, and can block time for walk-ins.',
  },
  {
    q: 'How do reminders work?',
    a: 'Bookwell sends a reminder the day before and two hours before, by SMS or WhatsApp, with a link to confirm or reschedule.',
  },
  {
    q: 'What does it cost?',
    a: 'One plan per clinic, with every feature included and no setup fee. The price below is an example for this page.',
  },
  {
    q: 'Where is patient data kept?',
    a: 'Only the details a booking needs: name, phone number and the slot. Nothing about the visit itself.',
  },
]

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    studioNode(),
    {
      '@type': 'SoftwareApplication',
      name: 'Bookwell (example)',
      url: `${site.url}/examples/bookwell/`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'An example product page for a made-up appointment booking app, built by VeraStack Labs for a blog post.',
      author: { '@id': `${site.url}/#organization` },
    },
    { '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ],
}

export default function BookwellExample() {
  return (
    <main id="main" className={`${styles.page} ${display.variable}`}>
      <span id="top" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />

      <p className={styles.banner}>
        An example page for a made-up product, built for our post{' '}
        <Link href="/blog/spot-the-slop">Spot the slop</Link>. Bookwell is not a real company.
      </p>

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
        <p className={styles.brand}>
          <span aria-hidden="true" className={styles.mark} /> Bookwell
        </p>
        <h1>Appointment booking for small clinics.</h1>
        <p className={styles.lede}>
          Patients book a slot in under a minute, from your website or WhatsApp. Your front desk stops playing phone tag, and
          reminders go out the day before, so fewer people miss their appointment.
        </p>
        <div className={styles.ctas}>
          <a className={styles.primary} href="#pricing">
            See the price
          </a>
          <a className={styles.secondary} href="#how">
            How it works
          </a>
        </div>
        <ul className={styles.facts}>
          <li>No app for patients to download</li>
          <li>Reminders by SMS and WhatsApp</li>
          <li>Live the same day you sign up</li>
        </ul>
        </div>
        <BookingVisual />
      </header>

      <section id="how" className={styles.section}>
        <h2>How it works</h2>
        <ol className={styles.steps}>
          <li>
            <b>Share one link.</b> Put it on your website, your Google profile and your WhatsApp greeting. That is where patients
            book.
          </li>
          <li>
            <b>Patients pick a slot.</b> They see only the times your doctors are free, choose one, and leave a name and a
            phone number. No account, no password.
          </li>
          <li>
            <b>Bookwell does the chasing.</b> A reminder goes out the day before and two hours before, with a link to confirm or
            move the appointment, so the gap can go to someone else.
          </li>
        </ol>
      </section>

      <section className={styles.section}>
        <h2>What it does</h2>
        <div className={styles.grid}>
          <div data-icon="calendar">
            <h3>One calendar for the whole clinic</h3>
            <p>Every doctor&apos;s hours in one place. The front desk adds phone bookings by hand and blocks time for walk-ins.</p>
          </div>
          <div data-icon="bell">
            <h3>Fewer no-shows</h3>
            <p>Reminders with a one-tap confirm. A slot freed the day before can be offered to the next patient on the waitlist.</p>
          </div>
          <div data-icon="phone">
            <h3>Works on any phone</h3>
            <p>Booking takes a few taps on the cheapest Android phone, on a slow connection, in English or Hindi.</p>
          </div>
          <div data-icon="sheet">
            <h3>A day sheet each morning</h3>
            <p>One page of who is coming when, ready at opening time, so nobody has to scroll a shared spreadsheet.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Who it is for</h2>
        <p className={styles.prose}>
          Bookwell is built for clinics with one to ten doctors: a dental practice, a physiotherapy centre, a family clinic,
          where the person at the front desk also answers the phone. It is not a hospital system, and it does not keep medical
          records. If your clinic already lives in a hospital information system, you do not need Bookwell.
        </p>
      </section>

      <section id="pricing" className={styles.section}>
        <h2>Pricing</h2>
        <div className={styles.price}>
          <p className={styles.amount}>
            ₹1,499 <span>a month, per clinic</span>
          </p>
          <p>Every feature, unlimited bookings, no setup fee, cancel any month. (Example pricing for this page.)</p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>What clinics say</h2>
        <p className={styles.prose}>
          Bookwell launches with three pilot clinics. When they have used it for a month, their words and their no-show
          numbers go here, with their names. Until then, this space stays honest and empty.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Questions</h2>
        <dl className={styles.faq}>
          {faqs.map((f) => (
            <div key={f.q}>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.cta}>
        <h2>Give your front desk its mornings back.</h2>
        <a className={styles.primary} href="#pricing">
          See the price
        </a>
      </section>
    </main>
  )
}


// What booking looks like for a patient, drawn in code: a phone with the slot picker, and the
// reminder that arrives the day before. Decorative; the page text says the same in words.
const SLOTS = [
  { time: '9:30', state: 'open' },
  { time: '10:00', state: 'taken' },
  { time: '10:30', state: 'picked' },
  { time: '11:00', state: 'open' },
  { time: '11:30', state: 'taken' },
  { time: '12:00', state: 'open' },
]

function BookingVisual() {
  return (
    <div className={styles.visual} aria-hidden="true">
      <div className={styles.phone}>
        <div className={styles.notch} />
        <p className={styles.phoneTitle}>Book a visit</p>
        <p className={styles.phoneSub}>Your clinic · General check-up</p>
        <div className={styles.days}>
          {['Mon 20', 'Tue 21', 'Wed 22'].map((d, i) => (
            <span key={d} data-on={i === 1}>
              {d}
            </span>
          ))}
        </div>
        <div className={styles.slots}>
          {SLOTS.map((slot) => (
            <span key={slot.time} data-state={slot.state}>
              {slot.time}
            </span>
          ))}
        </div>
        <span className={styles.confirm}>Confirm 10:30</span>
      </div>
      <div className={styles.bubble}>
        <b>Bookwell</b>
        Reminder: your visit is tomorrow at 10:30. Reply 1 to confirm, 2 to move it.
        <span>9:00 am ✓✓</span>
      </div>
    </div>
  )
}
