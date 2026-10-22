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
    { at: 84, label: "Let's build something" },
  ],
  uploaded: '2026-10-23',
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
    a: 'Launch films, product explainers and founder films, plus the cut-downs that go with them. Everything on this page was made by our team, either for our own products or, like the Bruno film, independently.',
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
