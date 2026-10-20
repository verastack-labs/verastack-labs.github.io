// The films page (/films): the studio's own film up top, then the films we have made. Files live in
// public/films and public/founder. Lengths are what the player shows before metadata loads.

export type Chapter = { at: number; label: string }

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
  // Seconds into the film where the card's hover preview starts.
  previewAt: number
  note?: string
  chapters?: Chapter[]
  uploaded: string
}

export const studioFilm: FilmEntry = {
  id: 'verastack-launch',
  title: 'VeraStack Labs in 90 seconds',
  line: 'What we design and build, the AI search work, the films, our own products and the Launch Kit.',
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
    { at: 14.2, label: 'Services' },
    { at: 38.2, label: 'One team' },
    { at: 46.8, label: 'Proof' },
    { at: 62.2, label: 'Our products' },
    { at: 75.9, label: 'Launch Kit' },
    { at: 84.3, label: 'Sign-off' },
  ],
  uploaded: '2026-10-21',
}

export const films: FilmEntry[] = [
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
