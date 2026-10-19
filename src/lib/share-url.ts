// A tool that reads a site keeps that site in the address bar (?url=), so sharing or bookmarking
// the page shares that site's result, and opening the link runs it again.

// The address as people type it: no scheme, no trailing slash, so links read /…?url=example.com.
export function shareValue(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/$/, '')
}

// The ?url= value from a query string, or null when there is none worth running.
export function readShared(search: string): string | null {
  const value = new URLSearchParams(search).get('url')?.trim()
  return value ? value : null
}

// The current address with ?url= set to the site, every other part kept.
export function withShared(href: string, input: string): string {
  const next = new URL(href)
  next.searchParams.set('url', shareValue(input))
  return `${next.pathname}${next.search}${next.hash}`
}

// Writes it without a reload or a new history entry.
export function writeShared(input: string) {
  if (!shareValue(input)) return
  const next = withShared(window.location.href, input)
  if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`)
    window.history.replaceState(window.history.state, '', next)
}
