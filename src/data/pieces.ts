// Everything on /work: client work, our own products and concept samples (spec
// docs/superpowers/specs/2026-10-27-work-and-concepts-routes-design.md). Client work is the founder's
// own from before the studio, so it links out to his case studies and gets no page here. Each piece
// page wears the piece's own theme (Rigan, 2026-10-28).
import { products, type Product } from '@/data/products'
import { work, type WorkEntry } from '@/data/work'
import { contrastRatio } from '@/lib/contrast'

export type Discipline = 'design' | 'development' | 'films' | 'ai-search'
export type Kind = 'client' | 'product' | 'concept'

export type PieceTheme = {
  bg: string
  fg: string
  muted: string
  accent: string
  // Text on the accent (buttons, the concept tag).
  onAccent: string
  font: 'house' | 'sora' | 'jakarta'
}

export type Shot = { src: string; alt: string; note?: string }

export type Piece = {
  slug: string
  kind: Kind
  title: string
  line: string
  disciplines: Discipline[]
  // yyyy-mm, for ordering. Client work shows the year only.
  date: string
  // A finished screen or film frame. Never a design system image.
  cover: string | null
  credit: string
  external?: { label: string; url: string }
  // False: the card links straight to `external`.
  page: boolean
  theme: PieceTheme
  // The idea in a sentence or two, then the finished screens.
  sections?: Partial<Record<Discipline, { idea: string; shots: Shot[] }>>
  concept?: {
    // The client's name when named, an industry when anonymised, a made-up brand when our own.
    for: string
    visibility: 'own' | 'anonymised' | 'named'
    // For named samples: the heads-up the client got (Rigan, 2026-10-28: no OK needed).
    consent?: string
    // What the paid version adds. No prices.
    takes: string
  }
}

export const disciplineLabel: Record<Discipline, string> = {
  design: 'design',
  development: 'development',
  films: 'films',
  'ai-search': 'AI search',
}

export const kindLabel: Record<Kind, string> = { client: 'Client', product: 'Product', concept: 'Concept' }

const shot = (slug: string, file: string, alt: string, note?: string): Shot => ({ src: `/work/${slug}/${file}`, alt, ...(note ? { note } : {}) })

// Dark or light text on an accent, whichever reads better.
const onAccentFor = (accent: string, dark: string) => (contrastRatio(accent, dark) >= contrastRatio(accent, '#F4F2FA') ? dark : '#F4F2FA')

function clientPiece(id: WorkEntry['id'], disciplines: Discipline[], line: string, date: string): Piece {
  const w = work.find((x) => x.id === id)
  if (!w?.caseStudyUrl || !w.art) throw new Error(`pieces: ${id} needs a case study and artwork`)
  return {
    slug: w.id,
    kind: 'client',
    title: `${w.client}: ${w.project}`,
    line,
    disciplines,
    date,
    cover: null,
    credit: `Rigan Burnwal, ${w.role === 'employee' ? 'as an employee' : 'freelance'}`,
    external: { label: 'Read the case study', url: w.caseStudyUrl },
    page: false,
    theme: { bg: w.art.to, fg: '#EDEBF2', muted: '#A9A6B4', accent: w.art.glow, onAccent: onAccentFor(w.art.glow, w.art.to), font: 'house' },
  }
}

// Muted text per product, picked against each product's own background.
const productMuted: Record<Product['id'], string> = { origan: '#9DB3AA', rigseed: '#9AA8B5', riggit: '#94B0A3', mehfil: '#B4B9AE' }

function productPiece(id: Product['id'], date: string, sections: NonNullable<Piece['sections']>): Piece {
  const p = products.find((x) => x.id === id)
  if (!p?.url) throw new Error(`pieces: ${id} needs a URL`)
  const { bg, fg, accent, onAccent } = p.palette
  return {
    slug: p.id,
    kind: 'product',
    title: p.name,
    line: p.line,
    disciplines: ['design', 'development'],
    date,
    cover: sections.design?.shots[0]?.src ?? null,
    credit: 'VeraStack Labs',
    external: { label: p.status === 'live' ? `Visit ${p.name}` : 'Join the waitlist', url: p.url },
    page: true,
    theme: { bg, fg, muted: productMuted[id], accent, onAccent, font: 'house' },
    sections,
  }
}

const ILLUSTRATIVE = 'Illustrative data, not a real college.'
const MEHFIL_NOTE = 'In development, not launched. Real app screens with invented sample data.'

const unsorted: Piece[] = [
  {
    slug: 'whispr',
    kind: 'concept',
    title: 'Whispr launch teaser (concept)',
    line: 'A 15-second Reel for a conversation-first social app, where the profile photo is replaced by what someone writes.',
    disciplines: ['films', 'design'],
    date: '2026-10',
    cover: '/work/whispr/cover.webp',
    credit: 'Concept by VeraStack Labs',
    external: { label: 'See the concept', url: 'https://concepts.verastack.dev/whispr/' },
    page: true,
    theme: { bg: '#1A0F11', fg: '#F6E9E7', muted: '#C9AFAD', accent: '#FF5F6D', onAccent: '#261818', font: 'jakarta' },
    sections: {
      films: {
        idea: 'Whispr asks people to meet minds before faces, so the film never shows one. A question types itself, an answer lands, and the reveal is a name, never a photo. It hooks in the first second and works with the sound off.',
        shots: [
          shot('whispr', 'frame-1.webp', 'The opening question typing itself on a dark screen'),
          shot('whispr', 'frame-4.webp', 'An answer arriving in the conversation'),
          shot('whispr', 'frame-7.webp', 'The closing card asking viewers to join Wave 1'),
        ],
      },
      design: {
        idea: 'Built in Whispr’s own colours and type, not ours: the crimson, the blush and the lowercase wordmark, so it reads as their launch from the first frame.',
        shots: [],
      },
    },
    concept: {
      for: 'Whispr',
      visibility: 'named',
      consent: 'A heads-up to the founder once the gallery went live; we take it down the same day if they ask (Rigan, 2026-10-28).',
      takes: 'The finished film: licensed music, a voiceover if you want one, cut-downs for every platform and a 4K master.',
    },
  },
  {
    slug: 'bookwell',
    kind: 'concept',
    title: 'Bookwell launch page (concept)',
    line: 'A launch page for a made-up clinic booking app: its own brand, copy that says what the product does, and real text for search and AI answers.',
    disciplines: ['design', 'development', 'ai-search'],
    date: '2026-10',
    cover: '/work/bookwell/cover.webp',
    credit: 'Concept by VeraStack Labs',
    external: { label: 'See the concept', url: '/examples/bookwell/' },
    page: true,
    theme: { bg: '#16213E', fg: '#F3F1EC', muted: '#B5BCCB', accent: '#E4572E', onAccent: '#0E1426', font: 'sora' },
    sections: {
      design: {
        idea: 'Its own brand, not ours: a warm paper page, a navy ink and one coral for the action, the way a clinic wants to feel calm and quick at once.',
        shots: [shot('bookwell', 'page.webp', 'The Bookwell launch page with its booking slots and reminder message')],
      },
      'ai-search': {
        idea: 'Every claim is real text in the page, with structured data and an FAQ that answers what a clinic owner actually asks, and honest placeholders where a new product has no proof yet.',
        shots: [],
      },
    },
    concept: {
      for: 'a made-up clinic booking app',
      visibility: 'own',
      takes: 'Your own brand, copy and launch page, built to read well to people and to AI answers.',
    },
  },
  productPiece('mehfil', '2026-10', {
    design: {
      idea: 'Neobrutal on purpose: hard borders, offset shadows and a live “who’s in” board. Loud, for an app about saying yes fast. The countdown owns the screen and answering is two taps wide.',
      shots: [
        shot('mehfil', 'cover.webp', 'The Mehfil landing page'),
        shot('mehfil', 'sign-in.webp', 'The way in: one button and one sentence', MEHFIL_NOTE),
        shot('mehfil', 'group-live.webp', 'A live mehfil with its countdown and who is coming', MEHFIL_NOTE),
      ],
    },
  }),
  productPiece('origan', '2026-10', {
    design: {
      idea: 'Drawn like a survey. The product is named after surveying instruments, so the whole brand speaks that language: bearings, contour lines and sheets you page through. One record, two readers: the placement cell sees cohorts, never names; the student sees their own gaps first.',
      shots: [
        shot('origan', 'cover.webp', 'The Origan landing site, drawn like a survey sheet'),
        shot('origan', 'cohort.webp', 'The placement cell dashboard: four years as a grid of weeks', ILLUSTRATIVE),
        shot('origan', 'student.webp', 'A student’s own record with one next step', ILLUSTRATIVE),
        shot('origan', 'phone.webp', 'Origan on a phone, with the sheet switcher at the thumb'),
      ],
    },
  }),
  productPiece('riggit', '2026-09', {
    design: {
      idea: 'The hero is a commit graph that fills its own gaps: the product’s promise as a picture.',
      shots: [shot('riggit', 'cover.webp', 'The Riggit site with its commit graph hero'), shot('riggit', 'grid.webp', 'The commit graph filling in a missed week')],
    },
  }),
  productPiece('rigseed', '2026-09', {
    design: {
      idea: 'A modern interface on the torrent daemon people already trust. Dense cards with progress, speed and state, a sidebar of filters and a live speed graph: everything a power user checks, without the 2005 table. The light theme has its own palette, not an inverted one.',
      shots: [
        shot('rigseed', 'cover.webp', 'The rigseed site, leading with the real app'),
        shot('rigseed', 'dark.webp', 'rigseed transfers in the dark theme'),
        shot('rigseed', 'light.webp', 'rigseed transfers in the light theme'),
      ],
    },
  }),
  clientPiece('e3-trion', ['design', 'development'], 'Assisted the design of the glassmorphic elements, and developed the whole website for the launch, with a configurator that took paid pre-bookings.', '2026-01'),
  clientPiece('ultraviolette', ['development'], 'The configurators and booking flows for three launches: the X-47, the Tesseract and the Shockwave.', '2025-01'),
]

export const pieces: Piece[] = [...unsorted].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))

export const pagePieces = pieces.filter((p) => p.page)

export type Facet = { slug: string; label: string; title: string; lede: string; filter: (p: Piece) => boolean }

export const facets: Facet[] = [
  { slug: 'clients', label: 'Clients', title: 'Client work', lede: 'Launches our founder built for clients, before and alongside the studio.', filter: (p) => p.kind === 'client' },
  { slug: 'products', label: 'Products', title: 'Our products', lede: 'Apps and services we design, build and run ourselves.', filter: (p) => p.kind === 'product' },
  { slug: 'design', label: 'Design', title: 'Design', lede: 'Finished screens and the ideas behind them.', filter: (p) => p.disciplines.includes('design') },
  { slug: 'development', label: 'Development', title: 'Development', lede: 'Sites, apps and configurators, built to launch.', filter: (p) => p.disciplines.includes('development') },
  { slug: 'films', label: 'Films', title: 'Films', lede: 'Launch films and teasers.', filter: (p) => p.disciplines.includes('films') },
  { slug: 'ai-search', label: 'AI search', title: 'AI search', lede: 'Pages written and built to be read well by search engines and AI answers.', filter: (p) => p.disciplines.includes('ai-search') },
]

// `concepts` stays free for a later index; the gallery lives at concepts.verastack.dev for now.
export const RESERVED: readonly string[] = [...facets.map((f) => f.slug), 'concepts']

export const liveFacets = facets.filter((f) => pieces.some(f.filter))

export const conceptsGallery = 'https://concepts.verastack.dev/'
