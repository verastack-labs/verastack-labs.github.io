// Everything on /work: client work, our own products and concept samples (spec
// docs/superpowers/specs/2026-10-27-work-and-concepts-routes-design.md). Client work is the founder's
// own from before the studio, so it links out to his case studies and gets no page here. Each piece
// page wears the piece's own theme (Rigan, 2026-10-28).
import { products, type Product } from '@/data/products'
import { work, type WorkEntry } from '@/data/work'
import { contrastRatio } from '@/lib/contrast'

export type Discipline = 'design' | 'development' | 'films' | 'ai-search'
export type Kind = 'client' | 'product' | 'concept'

// Faces a piece borrows from its own brand: `font` for the page, `mono` for labels and numbers.
export type PieceFont = 'house' | 'sora' | 'jakarta' | 'archivo' | 'inter' | 'geist' | 'space-grotesk'
export type PieceMono = 'house' | 'azeret' | 'jetbrains' | 'geist-mono'
// How frames and buttons are drawn: soft (round), card (small radius), sheet (a drawing sheet's
// hairlines), brutal (ink border and a hard offset shadow).
export type PieceShape = 'soft' | 'card' | 'sheet' | 'brutal'
// The drawing in the hero, taken from the piece's own world (piece-motif.tsx).
export type PieceMotif = 'typing' | 'slots' | 'notice' | 'survey' | 'commits' | 'speed'

export type PieceTheme = {
  bg: string
  fg: string
  muted: string
  accent: string
  // Text on the accent (buttons, the concept tag).
  onAccent: string
  font: PieceFont
  mono?: PieceMono
  shape?: PieceShape
  motif?: PieceMotif
}

export type Shot = { src: string; alt: string; note?: string }
export type Section = {
  idea: string
  shots: Shot[]
  // Portrait frames (film stills, phones) sit in a row instead of the grid.
  strip?: boolean
}

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
  // The screen a card scrolls to on hover. Defaults to the first shot that is not the cover.
  peek?: string
  credit: string
  external?: { label: string; url: string }
  // False: the card links straight to `external`.
  page: boolean
  theme: PieceTheme
  // What the piece had to do, in two or three sentences.
  brief?: string
  // Short label and value pairs shown under the title. No prices.
  facts?: { label: string; value: string }[]
  // The idea in a sentence or two, then the finished screens.
  sections?: Partial<Record<Discipline, Section>>
  // Small craft details worth noticing, one sentence each.
  details?: string[]
  concept?: {
    // The client's name when named, an industry when anonymised, a made-up brand when our own.
    for: string
    visibility: 'own' | 'anonymised' | 'named'
    // For named samples: what the client was told, if anything. Clients need not be told or asked
    // before a concept goes public (Rigan, 2026-10-29).
    consent?: string
    // For named samples: who owns the name and marks, for the trademark line. Their real logo is
    // never reproduced; we draw our own version and use the name in plain text.
    owner?: string
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

type ProductExtras = Pick<Piece, 'brief' | 'facts' | 'details' | 'sections'> & { look: Pick<PieceTheme, 'font' | 'mono' | 'shape' | 'motif'> }

function productPiece(id: Product['id'], date: string, { sections, look, ...more }: ProductExtras): Piece {
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
    cover: sections?.design?.shots[0]?.src ?? null,
    credit: 'VeraStack Labs',
    external: { label: p.status === 'live' ? `Visit ${p.name}` : 'Join the waitlist', url: p.url },
    page: true,
    theme: { bg, fg, muted: productMuted[id], accent, onAccent, ...look },
    sections,
    ...more,
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
    peek: '/work/whispr/page.webp',
    credit: 'Concept by VeraStack Labs',
    external: { label: 'See the concept', url: 'https://concepts.verastack.dev/whispr/' },
    page: true,
    theme: { bg: '#1A0F11', fg: '#F6E9E7', muted: '#C9AFAD', accent: '#FF5F6D', onAccent: '#261818', font: 'jakarta', shape: 'soft', motif: 'typing' },
    brief: 'Whispr leads with what people write, not how they look. Its launch needed a teaser that says so in fifteen seconds, on a feed full of faces, without showing a single one.',
    facts: [
      { label: 'Format', value: '15-second vertical Reel' },
      { label: 'Frames', value: 'Seven, each a still post too' },
      { label: 'Sound', value: 'Works on mute' },
      { label: 'Status', value: 'Concept, not commissioned' },
    ],
    sections: {
      films: {
        idea: 'Whispr asks people to meet minds before faces, so the film never shows one. A question types itself, an answer lands, and the reveal is a name, never a photo. It hooks in the first second and works with the sound off.',
        strip: true,
        shots: [
          shot('whispr', 'frame-1.webp', 'An empty profile frame. No photo, just a question.', '0:00'),
          shot('whispr', 'frame-2.webp', 'The question fills the frame', '0:01'),
          shot('whispr', 'frame-3.webp', 'Their answer becomes the photo', '0:03'),
          shot('whispr', 'frame-4.webp', 'It keeps going past midnight', '0:06'),
          shot('whispr', 'frame-5.webp', 'Both decide to reveal', '0:08'),
          shot('whispr', 'frame-6.webp', 'His photo is everything he said', '0:10'),
          shot('whispr', 'frame-7.webp', 'Meet minds first. Join Wave 1.', '0:12'),
        ],
      },
      design: {
        idea: 'Built in Whispr’s own colours and type, not ours: the crimson, the blush and the lowercase wordmark, so it reads as their launch from the first frame.',
        shots: [shot('whispr', 'page.webp', 'The concept page, in Whispr’s crimson and blush, with the frames ready to download')],
      },
    },
    details: [
      'No faces, ever. The only portrait in the film is made of words.',
      'Made for the sound off, because most Reels start on mute.',
      'Every frame also works as a post on its own, and all seven download in one go.',
    ],
    concept: {
      for: 'Whispr',
      visibility: 'named',
      consent: 'Published without asking; clients need not be told (Rigan, 2026-10-29); taken down the same day if they object.',
      owner: 'their owner',
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
    peek: '/work/bookwell/how.webp',
    credit: 'Concept by VeraStack Labs',
    external: { label: 'See the concept', url: '/examples/bookwell/' },
    page: true,
    theme: { bg: '#16213E', fg: '#F3F1EC', muted: '#B5BCCB', accent: '#E4572E', onAccent: '#0E1426', font: 'sora', shape: 'card', motif: 'slots' },
    brief: 'Made for our “Spot the slop” post: the launch page we would build for a real clinic booking app, start to finish. Its own brand, copy a clinic owner understands on the first read, and nothing invented to fill the gaps.',
    facts: [
      { label: 'For', value: 'A made-up clinic booking app' },
      { label: 'Pieces', value: 'Brand, copy and launch page' },
      { label: 'Built with', value: 'Next.js, structured data' },
      { label: 'Status', value: 'Concept' },
    ],
    sections: {
      design: {
        idea: 'Its own brand, not ours: a warm paper page, a navy ink and one coral for the action, the way a clinic wants to feel calm and quick at once.',
        shots: [
          shot('bookwell', 'page.webp', 'The Bookwell launch page with its booking slots and reminder message'),
          shot('bookwell', 'how.webp', 'How it works in three steps, then what it does in four cards'),
          shot('bookwell', 'mobile.webp', 'The page on a phone, where most patients will see it'),
        ],
      },
      'ai-search': {
        idea: 'Every claim is real text in the page, with structured data and an FAQ that answers what a clinic owner actually asks, and honest placeholders where a new product has no proof yet.',
        shots: [],
      },
    },
    details: [
      'The reviews section stays empty on purpose: it says the pilot clinics’ words go there after a month, with their names.',
      'Each step in “How it works” starts with the action in bold, so the page reads in a skim.',
      'The FAQ answers the questions a front desk asks first, like whether patients need an app. They don’t.',
    ],
    concept: {
      for: 'a made-up clinic booking app',
      visibility: 'own',
      takes: 'Your own brand, copy and launch page, built to read well to people and to AI answers.',
    },
  },
  productPiece('mehfil', '2026-10', {
    look: { font: 'space-grotesk', shape: 'brutal', motif: 'notice' },
    brief: 'Somebody types “chai?” in the group chat and it scrolls away before anyone answers. Mehfil turns that into one time, two answers and a live list of who is coming. The page had to feel like the hostel notice board the idea comes from.',
    facts: [
      { label: 'Platform', value: 'Progressive web app' },
      { label: 'Built with', value: 'Next.js' },
      { label: 'Answers', value: 'Two: in, or later' },
      { label: 'Status', value: 'In development' },
    ],
    sections: {
      design: {
        idea: 'Neobrutal on purpose: hard borders, offset shadows and a live “who’s in” board. Loud, for an app about saying yes fast. The countdown owns the screen and answering is two taps wide.',
        shots: [
          shot('mehfil', 'cover.webp', 'The Mehfil landing page'),
          shot('mehfil', 'one-notice.webp', 'One notice at a time: the old ones are taken down'),
          shot('mehfil', 'invite-code.webp', 'The whole invite is a code, on tear-off tabs'),
          shot('mehfil', 'mobile.webp', 'The landing page on a phone'),
          shot('mehfil', 'sign-in.webp', 'The way in: one button and one sentence', MEHFIL_NOTE),
          shot('mehfil', 'group-live.webp', 'A live mehfil with its countdown and who is coming', MEHFIL_NOTE),
        ],
      },
    },
    details: [
      'A group has exactly one plan at a time, and the database enforces it, not just the screen.',
      'There is no “maybe”. You are in, or you are later.',
      'The invite is a short code passed into the group chat that already exists.',
      'Paper, pins, torn tabs and hard shadows: everything on the page is more notice board, never a second style.',
    ],
  }),
  productPiece('origan', '2026-10', {
    look: { font: 'archivo', mono: 'azeret', shape: 'sheet', motif: 'survey' },
    brief: 'Most colleges prepare students for placements in the last few weeks. Origan is four years instead. The site had to survive the search a dean runs after a meeting and give a placement officer something to forward, with no product demo and no proof to cite yet.',
    facts: [
      { label: 'Platform', value: 'Web, for engineering colleges' },
      { label: 'Built with', value: 'Next.js' },
      { label: 'Site', value: 'Six pages' },
      { label: 'Status', value: 'Live' },
    ],
    sections: {
      design: {
        idea: 'Drawn like a survey. The product is named after surveying instruments, so the whole brand speaks that language: bearings, contour lines and sheets you page through. One record, two readers: the placement cell sees cohorts, never names; the student sees their own gaps first.',
        shots: [
          shot('origan', 'cover.webp', 'The Origan landing site, drawn like a survey sheet'),
          shot('origan', 'problems.webp', 'Four problems a placement cell knows, and the answer to each'),
          shot('origan', 'strands.webp', 'Four strands, woven through every semester'),
          shot('origan', 'cohort.webp', 'The placement cell dashboard: four years as a grid of weeks', ILLUSTRATIVE),
          shot('origan', 'student.webp', 'A student’s own record with one next step', ILLUSTRATIVE),
          shot('origan', 'phone.webp', 'Origan on a phone, with the sheet switcher at the thumb'),
        ],
      },
    },
    details: [
      'Every mark is one a surveyor really draws: station marks, bench marks, bearings. Nothing is invented to look technical.',
      'The scroll readout is chainage, a surveyor’s distance along a line.',
      'Each page closes with a title block, the way a drawing sheet does.',
      'Dark is the default and light is a choice, with its own palette rather than an inverted one.',
    ],
  }),
  productPiece('riggit', '2026-09', {
    look: { font: 'geist', mono: 'geist-mono', shape: 'card', motif: 'commits' },
    brief: 'Work offline for a week, import an old project or forget to push, and your contribution graph tells a different story from your work. Riggit lets developers commit at any date and time. The site had to make that feel like a discovery.',
    facts: [
      { label: 'Platform', value: 'Desktop: macOS, Windows, Linux' },
      { label: 'Built with', value: 'Tauri and React' },
      { label: 'Trial', value: 'Three commits, no account' },
      { label: 'Status', value: 'Live' },
    ],
    sections: {
      design: {
        idea: 'The hero is a commit graph that fills its own gaps: the product’s promise as a picture.',
        shots: [
          shot('riggit', 'cover.webp', 'The Riggit site with its commit graph hero'),
          shot('riggit', 'problem.webp', 'Three ways a graph goes wrong, each with its own strip of missing days'),
          shot('riggit', 'grid.webp', 'The commit graph filling in a missed week'),
          shot('riggit', 'mobile.webp', 'Riggit on a phone'),
        ],
      },
    },
    details: [
      'The graph is the payoff, so it is the hero, not the app window.',
      'One emerald accent on near-black, and nothing else competes with it.',
      'The free trial is spelled out under the button: three commits, no account.',
    ],
  }),
  productPiece('rigseed', '2026-09', {
    look: { font: 'inter', mono: 'jetbrains', shape: 'card', motif: 'speed' },
    brief: 'qBittorrent is the engine power users trust, behind an interface from another decade. rigseed puts a modern front end on it and ships its own copy of the engine. The site had to prove the difference at a glance.',
    facts: [
      { label: 'Platform', value: 'Desktop: Windows, macOS, Linux' },
      { label: 'Built with', value: 'Tauri and React' },
      { label: 'Version', value: 'v0.1.7' },
      { label: 'Status', value: 'Live, one download, no account' },
    ],
    sections: {
      design: {
        idea: 'A modern interface on the torrent daemon people already trust. Dense cards with progress, speed and state, a sidebar of filters and a live speed graph: everything a power user checks, without the 2005 table. The light theme has its own palette, not an inverted one.',
        shots: [
          shot('rigseed', 'cover.webp', 'The rigseed site, leading with the real app'),
          shot('rigseed', 'comparison.webp', 'Stock qBittorrent on the left, rigseed on the right, on the same downloads'),
          shot('rigseed', 'theming.webp', 'Picking an accent retints the whole app'),
          shot('rigseed', 'dark.webp', 'rigseed transfers in the dark theme'),
          shot('rigseed', 'light.webp', 'rigseed transfers in the light theme'),
        ],
      },
    },
    details: [
      'A drag handle compares the old interface and the new one on the same downloads.',
      'There are eight accents, and picking one tints every neutral, so it reads as a new skin, not a new button colour.',
      'Every number is set in a monospace face, so live figures stay lined up as they change.',
      'Warm, low-contrast surfaces, because people leave it open all day.',
    ],
  }),
  clientPiece('e3-trion', ['design', 'development'], 'Assisted the design of the glassmorphic elements, and developed the whole website for the launch, with a configurator that took paid pre-bookings.', '2026-01'),
  clientPiece('ultraviolette', ['development'], 'The configurators and booking flows for three launches: the X-47, the Tesseract and the Shockwave.', '2025-01'),
]

export const pieces: Piece[] = [...unsorted].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))

export const pagePieces = pieces.filter((p) => p.page)

// The second screen a card shows on hover, if the piece has one.
export function peekOf(p: Piece): string | null {
  if (!p.cover) return null
  if (p.peek) return p.peek
  const shots = Object.values(p.sections ?? {}).flatMap((s) => s?.shots ?? [])
  return shots.find((s) => s.src !== p.cover)?.src ?? null
}

export type Facet = { slug: string; label: string; title: string; lede: string; filter: (p: Piece) => boolean }

export const facets: Facet[] = [
  { slug: 'clients', label: 'Clients', title: 'Client work', lede: 'Launches our founder built for clients, before and alongside the studio.', filter: (p) => p.kind === 'client' },
  { slug: 'products', label: 'Products', title: 'Our products', lede: 'Apps and services we design, build and run ourselves.', filter: (p) => p.kind === 'product' },
  { slug: 'design', label: 'Design', title: 'Design', lede: 'Finished screens and the ideas behind them.', filter: (p) => p.disciplines.includes('design') },
  { slug: 'development', label: 'Development', title: 'Development', lede: 'Sites, apps and configurators, built to launch.', filter: (p) => p.disciplines.includes('development') },
  { slug: 'films', label: 'Films', title: 'Films', lede: 'Launch films and teasers.', filter: (p) => p.disciplines.includes('films') },
  { slug: 'ai-search', label: 'AI search', title: 'AI search', lede: 'Pages written and built to be read well by search engines and AI answers.', filter: (p) => p.disciplines.includes('ai-search') },
]

// `lab` and `concepts` stay free for a later index; the Lab (the concepts gallery) lives at
// concepts.verastack.dev for now (named the Lab by Rigan, 28 Oct 2026).
export const RESERVED: readonly string[] = [...facets.map((f) => f.slug), 'lab', 'concepts']

export const liveFacets = facets.filter((f) => pieces.some(f.filter))

// Every slug under /work/: the filtered views first, then the piece pages.
export const workSlugs = (): string[] => [...liveFacets.map((f) => f.slug), ...pagePieces.map((p) => p.slug)]

export const conceptsGallery = 'https://concepts.verastack.dev/'
