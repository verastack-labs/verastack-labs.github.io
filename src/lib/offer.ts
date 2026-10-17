// When the site-wide offer may open by itself (src/components/offer). Never on load: it waits for
// half the page scrolled, 30 seconds on the page or, on desktop, the pointer leaving through the
// top, and then opens at most once per visitor every 7 days.
export const OFFER_KEY = 'verastack:offer-shown'
export const OFFER_EVERY_MS = 7 * 24 * 60 * 60 * 1000
export const OFFER_DELAY_MS = 30_000
export const OFFER_SCROLL = 0.5

// lastShown is the stored timestamp, or null when there is none or it cannot be read.
export function offerDue(lastShown: number | null, now: number): boolean {
  if (lastShown === null || !Number.isFinite(lastShown)) return true
  // A timestamp in the future means a changed clock; treat it as stale rather than block forever.
  if (lastShown > now) return true
  return now - lastShown >= OFFER_EVERY_MS
}

// How far down the page the visitor has scrolled, 0 to 1. A page that does not scroll counts as 0,
// so the timer and exit intent decide there.
export function scrollDepth(scrollY: number, viewport: number, docHeight: number): number {
  const room = docHeight - viewport
  if (room <= 0) return 0
  return Math.min(1, Math.max(0, scrollY / room))
}

// Local storage can be missing or blocked (private windows, strict settings); both fail quietly.
export function readLastShown(): number | null {
  try {
    const raw = localStorage.getItem(OFFER_KEY)
    return raw === null ? null : Number(raw)
  } catch {
    return null
  }
}

export function writeLastShown(now: number) {
  try {
    localStorage.setItem(OFFER_KEY, String(now))
  } catch {}
}
