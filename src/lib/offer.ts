// When the site-wide offer may open by itself (src/components/offer), agreed with Rigan on
// 2026-10-17: once, at a natural pause, never mid-scroll and never on load.
//
// - At most once every 14 days per visitor, and never again once they have applied for a video or
//   run the AI search check.
// - On a laptop, the pointer leaving through the top (heading for the tabs) always counts.
// - Otherwise only when the visitor has stopped scrolling for a moment, and then either:
//   on the home page, once they have read past the Work section; or, from the second page of a
//   visit, after 45 seconds on the page. The page someone lands on from a search stays clean.
export const OFFER_KEY = 'verastack:offer-shown'
export const OFFER_DONE_KEY = 'verastack:offer-done'
export const OFFER_PAGES_KEY = 'verastack:pages'
export const OFFER_EVERY_MS = 14 * 24 * 60 * 60 * 1000
export const OFFER_READ_MS = 45_000
export const OFFER_IDLE_MS = 1500

// lastShown is the stored timestamp, or null when there is none or it cannot be read.
export function offerDue(lastShown: number | null, now: number, done = false): boolean {
  if (done) return false
  if (lastShown === null || !Number.isFinite(lastShown)) return true
  // A timestamp in the future means a changed clock; treat it as stale rather than block forever.
  if (lastShown > now) return true
  return now - lastShown >= OFFER_EVERY_MS
}

export type OfferMoment = {
  exitIntent: boolean
  // Milliseconds since the last scroll.
  idleMs: number
  onHome: boolean
  // The visitor has read past the Work section (home only).
  pastWork: boolean
  // Milliseconds on this page.
  readMs: number
  // Pages seen in this visit, counting this one.
  pagesThisVisit: number
}

export function offerMoment(m: OfferMoment): boolean {
  if (m.exitIntent) return true
  if (m.idleMs < OFFER_IDLE_MS) return false
  if (m.onHome && m.pastWork) return true
  return m.pagesThisVisit >= 2 && m.readMs >= OFFER_READ_MS
}

// Storage can be missing or blocked (private windows, strict settings); every access fails quietly.
function read(store: () => Storage, key: string): string | null {
  try {
    return store().getItem(key)
  } catch {
    return null
  }
}

function write(store: () => Storage, key: string, value: string) {
  try {
    store().setItem(key, value)
  } catch {}
}

export function readLastShown(): number | null {
  const raw = read(() => localStorage, OFFER_KEY)
  return raw === null ? null : Number(raw)
}

export const writeLastShown = (now: number) => write(() => localStorage, OFFER_KEY, String(now))
export const offerDone = () => read(() => localStorage, OFFER_DONE_KEY) === '1'
// They applied for a video or ran the check: the offer has done its job.
export const markOfferDone = () => write(() => localStorage, OFFER_DONE_KEY, '1')

// Counts pages in this visit (per tab); returns the count including the current page.
export function countPage(): number {
  const n = Number(read(() => sessionStorage, OFFER_PAGES_KEY)) || 0
  write(() => sessionStorage, OFFER_PAGES_KEY, String(n + 1))
  return n + 1
}
