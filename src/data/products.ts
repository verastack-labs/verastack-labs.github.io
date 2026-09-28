export type Product = {
  name: string
  platform: string
  url: string | null
  status: 'live' | 'coming-soon'
}

// Extended with palettes, pitches and mockups in phase 4 (spec 6.04).
export const products: Product[] = [
  { name: 'rigseed', platform: 'Desktop · Tauri', url: 'https://verastack-labs.github.io/rigseed/', status: 'live' },
  { name: 'Riggit', platform: 'Desktop · Tauri', url: 'https://verastack-labs.github.io/riggit/', status: 'live' },
  { name: 'Mehfil', platform: 'Progressive web app', url: null, status: 'coming-soon' },
]
