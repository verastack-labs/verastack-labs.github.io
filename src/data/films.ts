// The films page (/films): the studio's own film up top, then the films we have made. Files live in
// public/films and public/founder. Lengths are what the player shows before metadata loads.

export type Chapter = { at: number; label: string }

export type FilmCut = { src: string; poster: string }
// A film made in light and dark, each as a vertical and a square cut. The player shows the pair side
// by side, with a switch for the cut (and, on phones, for the version).
export type FilmVersions = Record<'light' | 'dark', Record<'tall' | 'square', FilmCut>>

export type FilmEntry = {
  id: string
  title: string
  line: string
  length: string
  // ISO 8601 duration, for VideoObject structured data.
  duration: string
  src: string
  poster: string
  captions: string
  formats: string[]
  // Vertical films play in a tall player and sit on a blurred backdrop in the grid.
  portrait?: boolean
  versions?: FilmVersions
  // Seconds into the film where the card's hover preview starts.
  previewAt: number
  note?: string
  chapters?: Chapter[]
  uploaded: string
}

export const studioFilm: FilmEntry = {
  id: 'verastack-launch',
  title: 'VeraStack Labs in 90 seconds',
  line: 'We design it, build it and get it found: the work, the proof, our own products and the Launch Kit.',
  length: '1:30',
  duration: 'PT1M30S',
  src: '/films/verastack-launch.mp4',
  poster: '/films/verastack-launch.jpg',
  captions: '/films/verastack-launch.vtt',
  formats: ['16:9', '9:16', '12 s loop'],
  previewAt: 6,
  note: "The 70,000+ bookings are Ultraviolette's, through configurators our founder built there as an employee, before the studio. Music: “Voyage” by AudioClubz, via Pixabay.",
  // From the film's captions.
  chapters: [
    { at: 0, label: 'Countdown' },
    { at: 3.4, label: 'VeraStack Labs' },
    { at: 13.7, label: 'Design' },
    { at: 17.1, label: 'Build' },
    { at: 30.9, label: 'Market' },
    { at: 37.7, label: 'One team' },
    { at: 46.3, label: 'Proof' },
    { at: 61.7, label: 'Our products' },
    { at: 75.4, label: 'Launch Kit' },
    { at: 84, label: "Let's launch something" },
  ],
  uploaded: '2026-10-23',
}

export const films: FilmEntry[] = [
  {
    id: 'ozer-launch',
    title: 'Ozer film (concept)',
    line: 'A 17-second concept for a business you run from iMessage: the morning brief lands, the founder answers with a tapback and two words.',
    length: '0:17',
    duration: 'PT17S',
    // The light vertical cut stands for the film in the grid preview and structured data; the card
    // poster is light and dark split down the middle.
    src: '/films/ozer-light-9x16.mp4',
    poster: '/films/ozer-split.jpg',
    captions: '/films/ozer.vtt',
    formats: ['9:16', '1:1', 'light and dark'],
    portrait: true,
    versions: {
      light: { tall: { src: '/films/ozer-light-9x16.mp4', poster: '/films/ozer-light-9x16.jpg' }, square: { src: '/films/ozer-light-1x1.mp4', poster: '/films/ozer-light-1x1.jpg' } },
      dark: { tall: { src: '/films/ozer-dark-9x16.mp4', poster: '/films/ozer-dark-9x16.jpg' }, square: { src: '/films/ozer-dark-1x1.mp4', poster: '/films/ozer-dark-1x1.jpg' } },
    },
    previewAt: 4,
    note: 'A concept by VeraStack Labs, not commissioned by or affiliated with Ozer. Ozer and its marks belong to Ozer Labs, Inc. Numbers are illustrative. Music: “Lofi Upbeat” by Kulakovka, via Pixabay.',
    chapters: [
      { at: 0, label: 'Morning brief' },
      { at: 1.95, label: 'The brief' },
      { at: 4, label: 'One tapback' },
      { at: 5.95, label: 'Two words' },
      { at: 8.05, label: 'By 11:40' },
      { at: 11, label: 'Everything else' },
      { at: 12.95, label: 'End card' },
    ],
    uploaded: '2026-10-29',
  },
  {
    // An unofficial film, not made with or for the Hallmark team; the note says so.
    id: 'hallmark-launch',
    title: 'Hallmark film (unofficial)',
    line: 'An unofficial launch film for Hallmark v2, the open-source design skill that stops AI-made sites all looking the same.',
    length: '0:28',
    duration: 'PT28S',
    src: '/films/hallmark-launch.mp4',
    poster: '/films/hallmark-launch.jpg',
    captions: '/films/hallmark-launch.vtt',
    formats: ['16:9'],
    previewAt: 15,
    note: 'Made on our own, not for or with the Hallmark team; Hallmark and its marks belong to their owners. Music: “Energetic Upbeat Future Bass” by prettyjohn1, via Pixabay.',
    chapters: [
      { at: 0, label: 'Hook' },
      { at: 3.7, label: 'Key message' },
      { at: 14, label: 'Example' },
      { at: 24, label: 'Outro' },
    ],
    uploaded: '2026-10-29',
  },
  {
    id: 'whispr-teaser',
    title: 'Whispr teaser (concept)',
    line: 'A 15-second concept for a conversation-first social app where you meet minds first: the profile photo is the words he wrote.',
    length: '0:15',
    duration: 'PT15S',
    src: '/films/whispr-teaser.mp4',
    poster: '/films/whispr-teaser.jpg',
    captions: '/films/whispr-teaser.vtt',
    formats: ['9:16'],
    portrait: true,
    previewAt: 8,
    note: 'A concept by VeraStack Labs, not commissioned by or affiliated with Whispr; Whispr and its marks belong to their owner. Names and messages are placeholders. Music: “Love Books” by ProducesPlatinum, via Pixabay.',
    uploaded: '2026-10-27',
  },
  {
    id: 'rigseed-launch',
    title: 'rigseed launch film',
    line: 'A modern face for qBittorrent, shown off in thirty seconds.',
    length: '0:30',
    duration: 'PT30S',
    src: '/films/rigseed-launch.mp4',
    poster: '/films/rigseed-launch.jpg',
    captions: '/films/rigseed-launch.vtt',
    formats: ['full', '30 s', '9:16'],
    previewAt: 3,
    uploaded: '2026-10-14',
  },
  {
    id: 'origan-explainer',
    title: 'Origan explainer',
    line: 'Placement prep for engineering colleges, from first semester to the final drive.',
    length: '1:22',
    duration: 'PT1M22S',
    src: '/films/origan-explainer.mp4',
    poster: '/films/origan-explainer.jpg',
    captions: '/films/origan-explainer.vtt',
    formats: ['16:9', '9:16', 'short'],
    previewAt: 4,
    uploaded: '2026-10-14',
  },
  {
    id: 'founder-film',
    title: 'The founder, in 51 seconds',
    line: 'Who you work with: launch work, the numbers behind it and the products we make.',
    length: '0:51',
    duration: 'PT51S',
    src: '/founder/founder-film.mp4',
    poster: '/founder/founder-film-poster.jpg',
    captions: '/founder/founder-film.vtt',
    formats: ['16:9'],
    previewAt: 4,
    note: "The client work in the film is Rigan Burnwal's own, from before the studio; the 70,000+ bookings are Ultraviolette's. Music: “Fresh” by Bransboynd, via Pixabay.",
    uploaded: '2026-10-19',
  },
  {
    // An independent film, not made with or for the Bruno team; the card says so.
    id: 'bruno-launch',
    title: 'Bruno film (independent)',
    line: 'An unofficial film for the open-source API client, made on our own, not for the Bruno team.',
    length: '0:50',
    duration: 'PT50S',
    src: '/films/bruno-launch.mp4',
    poster: '/films/bruno-launch.jpg',
    captions: '/films/bruno-launch.vtt',
    formats: ['16:9'],
    previewAt: 3,
    uploaded: '2026-10-14',
  },
]

export const allFilms = [studioFilm, ...films]

// How a film gets made, shown under the gallery.
export const filmSteps = [
  {
    title: 'A short call',
    text: 'What is launching, who it is for and where the film will run. We leave with the one thing the film has to make people understand.',
  },
  {
    title: 'Script and style',
    text: "We write the script and storyboard, and take the look from the product itself: its colours, its type and its real screens, so the film feels like the product rather than a template.",
  },
  {
    title: 'Edit and cuts',
    text: 'We animate and edit the main film with captions, then cut versions for each feed: wide for the site and YouTube, vertical for phones, and a short loop.',
  },
]

// Questions on the films page, shown as a list and labelled with FAQPage structured data.
export const filmQuestions = [
  {
    q: 'What kind of films do you make?',
    a: 'Launch films, product explainers and founder films, plus the cut-downs that go with them. Everything on this page was made by our team: for our own products, independently like the Bruno and Hallmark films, or as concepts like the Whispr and Ozer films.',
  },
  {
    q: 'Do we need a camera crew or a shoot?',
    a: "Usually not. Our films are built from the product itself: screen captures, its interface and type, and motion graphics. If a founder wants to appear, we plan for it in the script.",
  },
  {
    q: 'What do we get at the end?',
    a: 'The main film with captions, and cuts for each place it will run: 16:9 for your site and YouTube, 9:16 for phones, and short versions for LinkedIn, X and your launch post.',
  },
  {
    q: 'How long does it take?',
    a: 'In the Launch Kit the film takes one of the four weeks: script, capture and edit, after the brand and the site are in place. A film on its own is scheduled after a short call.',
  },
  {
    q: 'How do we get one?',
    a: 'A 60-second launch film comes with the Launch Kit, alongside the brand and the site. You can also ask for a film on its own; book a 30-minute call and we will scope it with you.',
  },
]
