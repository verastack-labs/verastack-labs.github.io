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
}

// Everything here was done by the founder personally, credited as such (spec 4.4).
export const work: WorkEntry[] = [
  {
    id: 'ultraviolette',
    client: 'Ultraviolette',
    project: 'X-47 and Tesseract configurators',
    year: '2025',
    role: 'employee',
    stack: ['Next.js', 'TypeScript', 'AWS Lambda'],
    // X-47 as a full-time employee; Tesseract as a contract employee. Both are "as an employee".
    summary: 'Configurators for the X-47 and the Tesseract that drive direct-to-consumer sales.',
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
