export type ProductPalette = {
  bg: string
  fg: string
  accent: string
  // Text on the accent (the call to action).
  onAccent: string
}

export type Product = {
  id: 'rigseed' | 'riggit' | 'mehfil'
  name: string
  platform: string
  pitch: string
  line: string
  meta: string
  cta: string
  url: string | null
  status: 'live' | 'coming-soon'
  palette: ProductPalette
  // The nav switches to its light palette over this product (Mehfil's cream).
  light: boolean
}

// Copy for rigseed and Riggit comes from their landing pages (spec 6.04). Mehfil's pitch is
// placeholder (docs/STATUS.md, Waiting on Rigan).
export const products: Product[] = [
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
    palette: { bg: '#08120E', fg: '#E7F5EE', accent: '#34D399', onAccent: '#08120E' },
    light: false,
  },
  {
    id: 'mehfil',
    name: 'Mehfil',
    platform: 'pwa · coming soon',
    pitch: 'Chai in ten? Rally the group.',
    line: 'A lightweight way to gather people for chai breaks, dinner in ten minutes or a cards night.',
    meta: 'progressive web app · in development',
    cta: 'Coming soon',
    url: null,
    status: 'coming-soon',
    palette: { bg: '#F4EBDA', fg: '#1A1410', accent: '#B93E29', onAccent: '#F4EBDA' },
    light: true,
  },
]
