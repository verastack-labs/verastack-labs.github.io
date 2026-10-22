// The founder page (docs/superpowers/specs/2026-10-17-founder-page-design.md). The letter and the
// questions are Rigan's agreed words; the numbers point at entries in work.ts, and a test holds
// each one to that entry's own text so the two never disagree.
import { mods } from '@/data/mods'
import { products } from '@/data/products'
import { site } from '@/data/site'
import { work, type WorkEntry } from '@/data/work'

const entry = (id: string): WorkEntry => {
  const found = work.find((w) => w.id === id)
  if (!found) throw new Error(`No work entry ${id}`)
  return found
}

// Whose work it was, said every time it appears (the founder's own work, never the studio's).
export const ownership = (w: WorkEntry) => (w.role === 'employee' ? 'as an employee' : 'independent client work')

const list = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items.at(-1)}` : items.join(''))

const uv = entry('ultraviolette')
const e3 = entry('e3-trion')

export const founder = {
  path: '/founder',
  title: 'Rigan Burnwal, founder of VeraStack Labs',
  description:
    'Who you work with at VeraStack Labs: Rigan Burnwal, on every call, shipping launches end to end, design to code, with AI search and product videos built in.',
  photo: { src: '/founder/rigan-burnwal.webp', width: 894, height: 922, alt: 'Rigan Burnwal in a VeraStack Labs hoodie' },
  sameAs: ['https://riganb.github.io', 'https://github.com/riganb', 'https://www.linkedin.com/in/rigan-burnwal/'],
  letter: [
    "Before you hand anyone your launch, you should know who'll be on the other side of the table. At VeraStack Labs, that's me, on every call and in every meeting, from the first sketch to the day it goes live.",
    'We design it, build it and get it found, end to end and in the same hands, so nothing gets lost between a mockup and a handover. Getting found comes built in at every turn: AI search, so you get named when buyers ask ChatGPT, a film for the launch itself, and launch marketing when you want it.',
  ],
  // `source` is the work entry each figure comes from; `evidence` must appear in that entry's text.
  metrics: [
    { value: '70,000+', label: `bookings behind the configurators he built at Ultraviolette, ${ownership(uv)}`, source: uv, evidence: '70,000+' },
    { value: 'Day 1', label: `paid pre-bookings on the E3 TRION launch, ${ownership(e3)}`, source: e3, evidence: 'paid pre-bookings on launch day' },
    { value: '3,000+', label: `X-47 bookings in its first 24 hours, ${ownership(uv)}`, source: uv, evidence: 'X-47 3,000+' },
  ],
  rail: [
    { name: 'Ultraviolette X-47', line: `configurator · 3,000+ bookings in its first 24 hours · ${ownership(uv)}`, detail: `Built with ${list(uv.stack)}.` },
    { name: 'Ultraviolette Tesseract and Shockwave', line: `configurators and booking flows · 67,000+ bookings · ${ownership(uv)}`, detail: 'Two more launches on the same configurator, each with its own booking flow, and both covered across the Indian auto press.' },
    { name: 'E3 TRION', line: `launch site with a custom configurator · paid pre-bookings on day one · ${ownership(e3)}`, detail: `Built with ${list(e3.stack)}.` },
    {
      name: site.name,
      line: 'sites, apps, AI search and product films, for clients and our own products',
      detail: `Our own products: ${list(products.map((p) => p.name))}, plus open-source Claude Code mods (${list(mods.map((m) => m.name))}).`,
    },
    { name: 'Your launch', line: 'design to code, with the founder on every call', you: true },
  ] as { name: string; line: string; detail?: string; you?: boolean }[],
}

export const founderQuestions: { q: string; a: string }[] = [
  { q: 'Will you really be on my calls?', a: 'Yes. Every call and every meeting, from the first sketch to launch day.' },
  { q: 'Do you design, or just build?', a: 'Both, in the same hands: design and code are the core of every launch we ship.' },
  {
    q: 'Are AI search and a launch video extra work for me?',
    a: "No. They're built into the launch as we go, so you're findable and have a film the day you go live.",
  },
  { q: 'What does it cost?', a: 'Every project is quoted after a free 30-minute call, once we know what the launch needs.' },
  {
    q: 'What have you launched before?',
    a: `The configurators behind 70,000+ Ultraviolette bookings (${ownership(uv)}) and the E3 TRION launch, which took paid pre-bookings on day one (${ownership(e3)}). Alongside them, smaller builds for clients: Maven Consultancy's event registration with emailed QR passes, Pee Empro Exports' Android QR attendance app, Suggaa Ventures' payments and cancellations, and Cold Stone Creamery Arabia's website and CMS (built, launching soon).`,
  },
]

// Every outlet once, linking to the first article listed for it.
export function pressOutlets(): { outlet: string; url: string }[] {
  const seen = new Map<string, string>()
  for (const w of work) for (const p of w.press ?? []) if (!seen.has(p.outlet)) seen.set(p.outlet, p.url)
  return [...seen].map(([outlet, url]) => ({ outlet, url }))
}
