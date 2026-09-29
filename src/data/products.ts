export type ProductPalette = {
  bg: string
  fg: string
  accent: string
  // Text on the accent (the call to action).
  onAccent: string
}

export type Product = {
  id: 'origan' | 'rigseed' | 'riggit' | 'mehfil'
  name: string
  platform: string
  pitch: string
  line: string
  meta: string
  cta: string
  // Coming-soon products link to their landing page once it exists.
  url: string | null
  status: 'live' | 'coming-soon'
  // How search engines should read it: an app, or a service sold as a partnership.
  kind: 'app' | 'service'
  palette: ProductPalette
  // The nav switches to its light palette over this product (Mehfil's cream).
  light: boolean
}

// Copy comes from each product's landing page (spec 6.04), except Mehfil's pitch, which is
// placeholder (docs/STATUS.md, Waiting on Rigan). Origan leads.
export const products: Product[] = [
  {
    id: 'origan',
    name: 'Origan',
    platform: 'web · for colleges',
    pitch: 'Four years, not four weeks.',
    line: 'Software placement preparation for engineering colleges: a consultant on campus, and a platform students use from their first semester to the final drive.',
    meta: 'a multi-year partnership for engineering colleges',
    cta: 'Visit Origan ↗',
    url: 'https://verastack-labs.github.io/origan/',
    status: 'live',
    kind: 'service',
    palette: { bg: '#0D1815', fg: '#EEF3F0', accent: '#5FD9A8', onAccent: '#06251A' },
    light: false,
  },
  {
    id: 'rigseed',
    name: 'rigseed',
    platform: 'desktop · tauri',
    pitch: 'Torrents, finally worth looking at.',
    line: 'rigseed puts a modern interface on qBittorrent, and brings its own daemon.',
    meta: 'v0.1.3 · Windows, macOS and Linux',
    cta: 'Visit rigseed ↗',
    url: 'https://verastack-labs.github.io/rigseed/',
    status: 'live',
    kind: 'app',
    palette: { bg: '#0E1318', fg: '#E6EDF3', accent: '#8FB0CB', onAccent: '#0E1318' },
    light: false,
  },
  {
    id: 'riggit',
    name: 'Riggit',
    platform: 'desktop · tauri',
    pitch: 'Own your GitHub timeline.',
    line: 'Commit at any date and time. Backfill the week you worked offline and make the graph tell the truth.',
    meta: 'three commits free · from $2.49 a month',
    cta: 'Visit Riggit ↗',
    url: 'https://verastack-labs.github.io/riggit/',
    status: 'live',
    kind: 'app',
    palette: { bg: '#08120E', fg: '#E7F5EE', accent: '#34D399', onAccent: '#08120E' },
    light: false,
  },
  {
    id: 'mehfil',
    name: 'Mehfil',
    platform: 'pwa · coming soon',
    pitch: 'Chai in ten? Rally the group.',
    line: 'Mehfil turns the most ignored question in your group chat into a plan: one time, two answers, and a live list of who is actually coming.',
    meta: 'progressive web app · in development',
    cta: 'Join the waitlist ↗',
    url: 'https://verastack-labs.github.io/mehfil/',
    status: 'coming-soon',
    kind: 'app',
    palette: { bg: '#F4EBDA', fg: '#1A1410', accent: '#B93E29', onAccent: '#F4EBDA' },
    light: true,
  },
]
