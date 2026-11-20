// The films page (/films): the studio's own film up top, then the films we have made. Files live in
// public/films and public/founder. Lengths are what the player shows before metadata loads.

export type Chapter = { at: number; label: string }

export type FilmCut = { src: string; poster: string }
// A film made in light and dark, each as a vertical and a square cut. The player shows the pair side
// by side, with a switch for the cut (and, on phones, for the version).
export type FilmVersions = Record<'light' | 'dark', Record<'tall' | 'square', FilmCut>>
// A film in one version, cut vertical and square. The player shows one cut at a time, with a switch.
export type FilmCuts = Record<'tall' | 'square', FilmCut>

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
  cuts?: FilmCuts
  // Seconds into the film where the card's hover preview starts.
  previewAt: number
  note?: string
  chapters?: Chapter[]
  // The film's own page on YouTube, for the channels we run there.
  youtube?: string
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
    id: 'verastack-reel',
    title: 'VeraStack Labs in 60 seconds',
    line: 'The launch film cut for Reels: every chapter, with whole beats dropped rather than sped up, and a softer finish.',
    length: '0:59',
    duration: 'PT59S',
    src: '/films/verastack-reel.mp4',
    poster: '/films/verastack-reel.jpg',
    captions: '/films/verastack-reel.vtt',
    formats: ['9:16'],
    portrait: true,
    previewAt: 6,
    note: "The 70,000+ bookings are Ultraviolette's, through configurators our founder built there as an employee, before the studio. Music: “Voyage” by AudioClubz, via Pixabay.",
    uploaded: '2026-11-18',
  },
  {
    id: 'kulra-launch',
    title: 'Kulra launch film (concept)',
    line: 'A 26-second film for a made-up stoneware brand: the cup slumps back to clay, then is thrown, fired and glazed as the page scrolls, and you pick the glaze.',
    length: '0:26',
    duration: 'PT26S',
    src: '/films/kulra-launch.mp4',
    poster: '/films/kulra-launch.jpg',
    captions: '/films/kulra-launch.vtt',
    formats: ['9:16', '1:1'],
    portrait: true,
    cuts: {
      tall: { src: '/films/kulra-launch.mp4', poster: '/films/kulra-launch.jpg' },
      square: { src: '/films/kulra-launch-1x1.mp4', poster: '/films/kulra-launch-1x1.jpg' },
    },
    previewAt: 8,
    note: 'A concept for a made-up brand, built by the team. The cup is the concept page’s own 3D experience, drawn in code with no model files. Music: “Monsoon Metro Drift” by kaazoom, via Pixabay.',
    uploaded: '2026-11-14',
  },
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

// Our own short pieces, shown in their own group so nobody reads them as client work. The dated news
// films and the poll stay off this page: they suit a feed, not a page that lasts.
export const shorts: FilmEntry[] = [
  {
    id: 'sameface-short',
    title: 'AI-built sites all look the same',
    line: 'A bingo card for the new landing page: a nameless site builds itself and every cliche gets stamped.',
    length: '0:29',
    duration: 'PT29S',
    src: '/films/sameface-short.mp4',
    poster: '/films/sameface-short.jpg',
    captions: '/films/sameface-short.vtt',
    formats: ['16:9', '9:16'],
    previewAt: 6,
    note: 'The site in the film is made up; no real brand appears. Music: “Comedy Jazz” by Tunetank, via Pixabay.',
    uploaded: '2026-11-04',
  },
  {
    id: 'deploy-short',
    title: '2 AM deploy',
    line: 'A chai, a rocket and a calm robot meet a 502 in the middle of the night.',
    length: '0:21',
    duration: 'PT21S',
    src: '/films/deploy-short.mp4',
    poster: '/films/deploy-short.jpg',
    captions: '/films/deploy-short.vtt',
    formats: ['16:9', '9:16'],
    previewAt: 8,
    note: 'Music: “Playful Marimba Background” by JorisVermeer, via Pixabay.',
    uploaded: '2026-11-04',
  },
  {
    id: 'horror-short',
    title: 'Homepage horror stories',
    line: 'Three true homepage mistakes told by candlelight, with no names.',
    length: '0:34',
    duration: 'PT34S',
    src: '/films/horror-short.mp4',
    poster: '/films/horror-short.jpg',
    captions: '/films/horror-short.vtt',
    formats: ['16:9', '9:16'],
    previewAt: 12,
    note: 'From our own site checks, October 2026; the sample sentence is rewritten at its real length. Music: “Unspoken (Tense Underscore)” by Hot_Dope, via Pixabay.',
    uploaded: '2026-11-04',
  },
  {
    id: 'aisees-short',
    title: 'What AI sees',
    line: 'A homepage as a person sees it, and as an AI crawler reads it before any JavaScript runs.',
    length: '0:41',
    duration: 'PT41S',
    src: '/films/aisees-short.mp4',
    poster: '/films/aisees-short.jpg',
    captions: '/films/aisees-short.vtt',
    formats: ['16:9', '9:16'],
    previewAt: 12,
    note: 'The empty page is a typical example, not a named product. The 30 of 226 figure is from our study of YC S26 homepages, October 2026. The voice is synthetic. Music: “Dark Ambient Drone” by Liecio, via Pixabay.',
    uploaded: '2026-11-04',
  },
  {
    id: 'geo-short',
    title: 'GEO is the new SEO',
    line: 'AI answers lift passages, not pages. What that asks of your homepage, in 47 seconds.',
    length: '0:47',
    duration: 'PT47S',
    src: '/films/geo-short.mp4',
    poster: '/films/geo-short.jpg',
    captions: '/films/geo-short.vtt',
    formats: ['16:9', '9:16'],
    previewAt: 10,
    note: 'The answer on screen is a schematic, not a real one. The voice is synthetic. Music: “Lofi Chill HipHop Lo-Fi” by DELOSound, via Pixabay.',
    uploaded: '2026-11-04',
  },
  {
    id: 'git-short',
    title: 'Git does not store diffs',
    line: 'Commits, trees and blobs, drawn from a real repo, and why a rename costs nothing.',
    length: '0:43',
    duration: 'PT43S',
    src: '/films/git-short.mp4',
    poster: '/films/git-short.jpg',
    captions: '/films/git-short.vtt',
    formats: ['16:9', '9:16'],
    previewAt: 12,
    note: 'The hashes and output are from a real run on git 2.46. The voice is synthetic. Music: “Lofi Study” by FASSounds, via Pixabay.',
    uploaded: '2026-11-04',
  },
  {
    id: 'float-short',
    title: '0.1 + 0.2',
    line: 'Why a computer adds these two and gets 0.30000000000000004, and what to compare instead.',
    length: '0:38',
    duration: 'PT38S',
    src: '/films/float-short.mp4',
    poster: '/films/float-short.jpg',
    captions: '/films/float-short.vtt',
    formats: ['16:9', '9:16'],
    previewAt: 10,
    note: 'Every result on screen is from a real run on node 22. The voice is synthetic. Music: “Reflective Piano” by AtlasAudio, via Pixabay.',
    uploaded: '2026-11-04',
  },
  {
    id: 'switch-short',
    title: 'The Switch, lesson 9: any vs unknown',
    line: 'One toggle, one broken call: what any lets through and unknown refuses. From The Open Shelf, free.',
    length: '0:24',
    duration: 'PT24S',
    src: '/films/switch-short.mp4',
    poster: '/films/switch-short.jpg',
    captions: '/films/switch-short.vtt',
    formats: ['9:16', '1:1'],
    portrait: true,
    previewAt: 6,
    note: 'The Switch is the JavaScript to TypeScript course on The Open Shelf, our free reading. Sound made in code.',
    uploaded: '2026-11-04',
  },
  {
    id: 'quiz-short',
    title: 'What does this print?',
    line: 'A Java HashMap quiz with six seconds on the clock. The answer comes from a real run.',
    length: '0:18',
    duration: 'PT18S',
    src: '/films/quiz-short.mp4',
    poster: '/films/quiz-short.jpg',
    captions: '/films/quiz-short.vtt',
    formats: ['9:16', '1:1', '18 s loop'],
    portrait: true,
    previewAt: 2,
    note: 'Compiled and run on JDK 21. Music: “Retro Game Arcade Short” by moodmode, via Pixabay.',
    uploaded: '2026-11-04',
  },
]

// The channels we are trying on YouTube, each a section of its own on /films.
export type Channel = {
  id: string
  // The heading; kind follows it in the accent face.
  name: string
  kind: string
  line: string
  films: FilmEntry[]
}

export const channels: Channel[] = [
  {
    id: 'daily-diff',
    name: 'The Daily Diff (working title)',
    kind: 'AI news shorts',
    line: 'A daily AI news short, vertical only, made to start a conversation in the comments. The facts are sourced; the jokes are marked as jokes. A channel we are trying on YouTube.',
    films: [
      {
        id: 'diff-e1',
        title: 'India just beat America. On ChatGPT.',
        line: "India is now ChatGPT's biggest market by weekly users. Do you actually pay for it?",
        length: '0:30',
        duration: 'PT30S',
        src: '/films/diff-e1.mp4',
        poster: '/films/diff-e1.jpg',
        captions: '/films/diff-e1.vtt',
        formats: ['9:16'],
        portrait: true,
        previewAt: 1.5,
        note: "Synthetic voice (Kokoro). Source: OpenAI India's MD, reported 3 Nov 2026. Music: Cybertech Tense News by Tunetank, via Pixabay.",
        uploaded: '2026-11-15',
      },
      {
        id: 'diff-e2',
        title: 'OpenAI breaks up its robot team',
        line: 'Booth 208. No logo. No demo. Now the chatbot is the robot department.',
        length: '0:31',
        duration: 'PT31S',
        src: '/films/diff-e2.mp4',
        poster: '/films/diff-e2.jpg',
        captions: '/films/diff-e2.vtt',
        formats: ['9:16'],
        portrait: true,
        previewAt: 6.5,
        note: "Satire on a Fortune report, 13 Nov 2026; 'the chatbot is the robot department' is our joke, not a reported claim. Synthetic voice (Kokoro). Music: So Easy by BombinSound, via Pixabay.",
        uploaded: '2026-11-15',
      },
      {
        id: 'diff-e3',
        title: 'California sues OpenAI over agents that got out',
        line: "California's Attorney General is suing OpenAI, saying hundreds of its AI agents escaped a test lab and attacked Hugging Face. The school props are our satire; the claims are allegations, nothing decided.",
        length: '0:30',
        duration: 'PT30S',
        src: '/films/diff-e3.mp4',
        poster: '/films/diff-e3.jpg',
        captions: '/films/diff-e3.vtt',
        formats: ['9:16'],
        portrait: true,
        previewAt: 6.5,
        note: "Source: the California Attorney General's lawsuit against OpenAI, filed 16 Nov 2026, with OpenAI's quotes as reported by CNBC. These are allegations; nothing has been decided. The school props are our satire, not reported claims. Synthetic voice (Kokoro). Music: So Easy by BombinSound, via Pixabay.",
        uploaded: '2026-11-18',
      },
    ],
  },
  {
    id: 'lamplight',
    name: 'Lamplight',
    kind: 'calm shorts',
    line: 'Calm vertical shorts on a YouTube channel we run as a lab: public-domain archive film, one word on screen at a time, a quiet synthetic voice. Each episode changes one thing and we read the numbers.',
    films: [
      {
        id: 'lamplight-e0',
        title: 'Curiosity',
        line: 'The first episode and the baseline every experiment is measured against.',
        length: '0:46',
        duration: 'PT46S',
        src: '/films/lamplight-e0.mp4',
        poster: '/films/lamplight-e0.jpg',
        captions: '/films/lamplight-e0.vtt',
        formats: ['9:16'],
        portrait: true,
        previewAt: 3.6,
        note: "Voice: synthetic (Kokoro, am_michael). Music: a pad made in code. Film: Build Your Vocabulary, A Date With Your Family, The Librarian, Habit Patterns, Have I Told You Lately That I Love You?, Young Man's Fancy, The Home Economics Story; public domain, Prelinger Archives (Internet Archive).",
        youtube: 'https://youtube.com/shorts/3p57lBfjx58',
        uploaded: '2026-10-31',
      },
      {
        id: 'lamplight-e5',
        title: 'Cartoons',
        line: "The topic test: public-domain cartoons, and the channel's most-viewed short.",
        length: '0:42',
        duration: 'PT42S',
        src: '/films/lamplight-e5.mp4',
        poster: '/films/lamplight-e5.jpg',
        captions: '/films/lamplight-e5.vtt',
        formats: ['9:16'],
        portrait: true,
        previewAt: 6,
        note: 'Voice: synthetic (Kokoro, am_michael). Music: a pad made in code. Film: Why Play Leap Frog?, Going Places, A is for Atom; public domain, Prelinger Archives (Internet Archive).',
        youtube: 'https://youtube.com/shorts/R8SKzAqYpCM',
        uploaded: '2026-11-05',
      },
      {
        id: 'lamplight-e9',
        title: 'Mother',
        line: 'The voice test: the same recipe read by a female synthetic voice.',
        length: '0:50',
        duration: 'PT50S',
        src: '/films/lamplight-e9.mp4',
        poster: '/films/lamplight-e9.jpg',
        captions: '/films/lamplight-e9.vtt',
        formats: ['9:16'],
        portrait: true,
        previewAt: 6,
        note: 'Voice: synthetic (Kokoro, af_nicole). Music: a pad made in code. Film: Good Eating Habits, Joan Avoids a Cold, Mind Your Manners; public domain, Prelinger Archives (Internet Archive).',
        youtube: 'https://youtube.com/shorts/Cmt--JOhVfo',
        uploaded: '2026-11-09',
      },
      {
        id: 'lamplight-e13',
        title: '11:42',
        line: 'The script test: a scene with no lesson, in place of the early template.',
        length: '0:52',
        duration: 'PT52S',
        src: '/films/lamplight-e13.mp4',
        poster: '/films/lamplight-e13.jpg',
        captions: '/films/lamplight-e13.vtt',
        formats: ['9:16'],
        portrait: true,
        previewAt: 6,
        note: "Voice: synthetic (Kokoro, am_michael). Music: a pad made in code. Film: Who's Boss?, Our Changing Family Life, The Children Must Learn, This Charming Couple, Eat for Health, Habit Patterns; public domain, Prelinger Archives (Internet Archive).",
        youtube: 'https://youtube.com/shorts/3w8rPJSaF2E',
        uploaded: '2026-11-15',
      },
      {
        id: 'lamplight-e21',
        title: "Two voices",
        line: "The repeat test: the cartoon recipe again, to see whether it wins twice.",
        length: '0:50',
        duration: 'PT50S',
        src: '/films/lamplight-e21.mp4',
        poster: '/films/lamplight-e21.jpg',
        captions: '/films/lamplight-e21.vtt',
        formats: ['9:16'],
        portrait: true,
        previewAt: 1.2,
        note: "Voice: synthetic (Kokoro, am_michael). Music: a pad made in code. Film: Going Places, Why Play Leap Frog?, It's Everybody's Business, What Makes Us Tick; public domain, Prelinger Archives (Internet Archive).",
        youtube: 'https://youtube.com/shorts/D0fgpAtW2U4',
        uploaded: '2026-11-16',
      },
      {
        id: 'lamplight-e14',
        title: "Number fifty-one",
        line: "A true story told from one small clue: in May 1952, a photograph took 62 hours to expose.",
        length: '0:58',
        duration: 'PT58S',
        src: '/films/lamplight-e14.mp4',
        poster: '/films/lamplight-e14.jpg',
        captions: '/films/lamplight-e14.vtt',
        formats: ['9:16'],
        portrait: true,
        previewAt: 8,
        note: "Script-shape experiment. Archive footage is illustrative and does not show the people named. Public-domain film from the Prelinger Archives (Internet Archive). Synthetic voice (Kokoro, am_michael); music made in code.",
        youtube: 'https://youtube.com/shorts/0Ms4OwnVKbU',
        uploaded: '2026-11-17',
      },
      {
        id: 'lamplight-e17',
        title: "Meet Walter",
        line: "A mock 1950s guidance film about Walter, read over the classroom films it parodies.",
        length: '0:56',
        duration: 'PT56S',
        src: '/films/lamplight-e17.mp4',
        poster: '/films/lamplight-e17.jpg',
        captions: '/films/lamplight-e17.vtt',
        formats: ['9:16'],
        portrait: true,
        previewAt: 3,
        note: "Script-shape experiment. Public-domain film from the Prelinger Archives (Internet Archive). Synthetic voice (Kokoro, am_michael); music made in code.",
        youtube: 'https://youtube.com/shorts/6e1hCkSm_s0',
        uploaded: '2026-11-18',
      },
      {
        id: 'lamplight-e22',
        title: "Home at five",
        line: "In old cartoons, a whistle blew at five, and everyone went home.",
        length: '0:56',
        duration: 'PT56S',
        src: '/films/lamplight-e22.mp4',
        poster: '/films/lamplight-e22.jpg',
        captions: '/films/lamplight-e22.vtt',
        formats: ['9:16'],
        portrait: true,
        previewAt: 15,
        note: "Colour experiment: E21's cartoon recipe kept in colour under one dusk grade. Public-domain animation from the Prelinger Archives (Internet Archive). Synthetic voice (Kokoro, am_michael); music made in code.",
        youtube: 'https://youtube.com/shorts/wFh1rqSsC7c',
        uploaded: '2026-11-19',
      },
    ],
  },
]

export const allFilms = [studioFilm, ...films, ...shorts, ...channels.flatMap((c) => c.films)]

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
    a: 'Launch films, product explainers and founder films, plus the cut-downs that go with them. Everything on this page was made by our team: for our own products, independently like the Bruno and Hallmark films, or as concepts like the Whispr and Ozer films. The studio shorts are our own explainers and jokes, not client work.',
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
