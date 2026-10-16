export type WorkMedia = { poster: string; mp4: string; webm?: string }

export type WorkEntry = {
  id: string
  client: string
  project: string
  year: string | null
  role: 'employee' | 'freelance'
  stack: string[]
  summary: string
  liveUrl: string | null
  caseStudyUrl: string | null
  // Screen recording with a poster frame. Null until the recording exists (docs/STATUS.md).
  media: WorkMedia | null
  // Stand-in artwork for a headliner until its recording arrives. Abstract, never a fake screenshot.
  art?: { from: string; to: string; glow: string; word: string }
  tier: 'headliner' | 'supporting'
  status: 'live' | 'launching'
  // What the work led to, said as the client's numbers, not ours. Only public figures.
  result?: string
  // Press coverage that backs the result, by outlet.
  press?: { outlet: string; url: string }[]
}

// Everything here was done by the founder personally, credited as such (spec 4.4).
export const work: WorkEntry[] = [
  {
    id: 'ultraviolette',
    client: 'Ultraviolette',
    project: 'X-47, Tesseract and Shockwave configurators',
    year: '2024–2026',
    role: 'employee',
    stack: ['Next.js', 'TypeScript', 'AWS Lambda'],
    // X-47 as a full-time employee; Tesseract and Shockwave as a contract employee. All "as an employee".
    summary: 'The configurators and booking flows for three launches: the X-47, the Tesseract and the Shockwave.',
    // Ultraviolette's bookings, taken through flows the founder built. Figures from the press below.
    result: 'Behind 70,000+ bookings: Tesseract 60,000+, Shockwave 7,000+, X-47 3,000+ in its first 24 hours.',
    press: [
      { outlet: 'Autocar India', url: 'https://www.autocarindia.com/bike-news/ultraviolette-tesseract-electric-scooter-surpasses-50000-bookings-434877' },
      { outlet: 'Mobility Outlook', url: 'https://www.mobilityoutlook.com/news/ultraviolette-tesseract-electric-scooter-garners-60000-bookings-ahead-of-2026-launch/' },
      { outlet: 'Team-BHP', url: 'https://www.team-bhp.com/news/ultraviolette-x-47-surpasses-3000-bookings-24-hours' },
      { outlet: 'BikeWale', url: 'https://www.bikewale.com/news/ultraviolette-shockwave-garners-over-7000-bookings-since-launch/' },
      { outlet: 'Motoroids', url: 'https://www.motoroids.com/news/ultraviolette-tesseract-shockwave-take-india-by-storm-over-67000-bookings-and-counting/' },
    ],
    liveUrl: 'https://www.ultraviolette.com/configure',
    caseStudyUrl: 'https://riganb.github.io/work/ultraviolette/',
    media: null,
    art: { from: '#2A1F52', to: '#07060C', glow: '#6B4FD8', word: 'X-47' },
    tier: 'headliner',
    status: 'live',
  },
  {
    id: 'e3-trion',
    client: 'E3 Electric.AI',
    project: 'TRION launch',
    year: '2026',
    role: 'freelance',
    stack: ['Framer', 'React configurator', 'Razorpay'],
    summary: 'A launch site with a custom configurator that took paid pre-bookings on launch day.',
    // No public booking count exists, so none is claimed; the coverage is of the launch itself.
    press: [
      { outlet: 'Autocar India', url: 'https://www.autocarindia.com/bike-news/e3-trion-electric-scooter-launched-at-rs-1-lakh-440423' },
      { outlet: 'Autocar Pro', url: 'https://www.autocarpro.in/news/e3-electricai-launches-e3-trion-electric-scooter-starting-at-rs-99999-133951' },
      { outlet: 'BikeDekho', url: 'https://www.bikedekho.com/news/category-launch-news/breaking-e3-trion-launched-at-rs-99999-full-details-here-19979' },
      { outlet: 'EVreporter', url: 'https://evreporter.com/e3-electric-ai-launches-e3-trion-electric-scooter-priced-from-%E2%82%B999999/' },
    ],
    liveUrl: 'https://e3electric.ai/',
    caseStudyUrl: 'https://riganb.github.io/work/e3-trion/',
    media: null,
    art: { from: '#0D1F1A', to: '#050A09', glow: '#35E0B4', word: 'TRION' },
    tier: 'headliner',
    status: 'live',
  },
  {
    id: 'cold-stone',
    client: 'Cold Stone Creamery Arabia',
    project: 'Website and CMS',
    year: '2026',
    role: 'freelance',
    stack: ['Next.js', 'Prisma', 'MariaDB'],
    summary: 'website and CMS · 76 stores in six countries',
    liveUrl: null,
    caseStudyUrl: null,
    media: null,
    tier: 'supporting',
    status: 'launching',
  },
  {
    id: 'maven',
    client: 'Maven Consultancy',
    project: 'Event registration',
    year: null,
    role: 'freelance',
    stack: [],
    summary: 'event registration · emailed QR passes',
    liveUrl: null,
    caseStudyUrl: null,
    media: null,
    tier: 'supporting',
    status: 'live',
  },
  {
    id: 'pee-empro',
    client: 'Pee Empro Exports',
    project: 'Attendance app',
    year: null,
    role: 'freelance',
    stack: ['Android'],
    summary: 'Android QR attendance · CSV export',
    liveUrl: null,
    caseStudyUrl: null,
    media: null,
    tier: 'supporting',
    status: 'live',
  },
  {
    id: 'suggaa',
    client: 'Suggaa Ventures',
    project: 'Payments',
    year: null,
    role: 'freelance',
    stack: [],
    summary: 'payments · cancellations · pricing data',
    liveUrl: null,
    caseStudyUrl: null,
    media: null,
    tier: 'supporting',
    status: 'live',
  },
  {
    id: 'pixelstack',
    client: 'PixelStack Studio',
    project: 'Agency site',
    year: null,
    role: 'freelance',
    stack: [],
    summary: 'agency site · in progress',
    liveUrl: null,
    caseStudyUrl: null,
    media: null,
    tier: 'supporting',
    status: 'live',
  },
]

export const headliners = work.filter((w) => w.tier === 'headliner')
export const supporting = work.filter((w) => w.tier === 'supporting')

export const roleLabel = (role: WorkEntry['role']) => (role === 'employee' ? 'as an employee' : 'freelance')
