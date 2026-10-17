// Decides which addresses the checker may fetch. It only visits public websites by name: no IP
// addresses, no internal or local names, no odd ports and no credentials in the URL. Every
// redirect is checked again before it is followed.

const BLOCKED_SUFFIXES = ['.local', '.localhost', '.internal', '.lan', '.home', '.corp', '.intranet', '.test', '.example', '.invalid', '.arpa']

export function normaliseInput(input: string): string {
  const trimmed = input.trim()
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export function publicUrl(input: string, selfHost?: string): URL | null {
  let url: URL
  try {
    url = new URL(input)
  } catch {
    return null
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
  if (url.username || url.password) return null
  if (url.port && url.port !== '80' && url.port !== '443') return null

  const host = url.hostname.toLowerCase().replace(/\.$/, '')
  // IPv6 literals arrive in brackets; IPv4 literals and bare numbers are refused outright.
  if (host.startsWith('[') || /^[\d.]+$/.test(host) || /^0x/i.test(host)) return null
  if (!host.includes('.') || host === 'localhost') return null
  if (BLOCKED_SUFFIXES.some((s) => host.endsWith(s))) return null
  if (!/^[a-z0-9.-]+$/.test(host) || !/\.[a-z][a-z0-9-]*[a-z0-9]$/.test(host)) return null
  if (selfHost && host === selfHost) return null
  url.hash = ''
  return url
}
