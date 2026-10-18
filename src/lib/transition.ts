// When a link gets the page curtain: only for a click that leaves for another page of this site.
// Same page, a hash on the same page, other sites, new tabs and files are left to the browser.

const pathOf = (p: string) => (p.endsWith('/') ? p : `${p}/`)

export function shouldCurtain(from: string, to: string, firstLoad: boolean): boolean {
  if (firstLoad) return false
  let url: URL
  let here: URL
  try {
    here = new URL(from, 'https://verastack.dev')
    url = new URL(to, here)
  } catch {
    return false
  }
  if (url.origin !== here.origin) return false
  if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) return false
  return pathOf(url.pathname) !== pathOf(here.pathname)
}

// Curtain timing, in ms: it covers, the route changes underneath, then it lifts away. Keep in step with
// the animation durations in transition.module.css (slowed twice on 2026-10-18 at Rigan's request).
export const CURTAIN_IN_MS = 475
export const CURTAIN_OUT_MS = 775
