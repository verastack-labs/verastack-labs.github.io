// A film we made, played in a dialog from its poster. Files live in public/films.
export type Film = {
  id: string
  title: string
  meta: string
  src: string
  poster: string
  captions: string
}

export type Service = {
  id: string
  name: string
  // One word for the "keep scrolling for 02 ..." hint.
  short: string
  blurb: string
  proof: string[]
  lead: boolean
  films?: Film[]
}

// Spec 6.02, in this order. Proof lines credit the founder's work (spec voice, section 4.4). The
// first service carries the configurator demo, one example of 3D on the web.
export const services: Service[] = [
  {
    id: 'experiences',
    name: 'Web experiences & 3D',
    short: 'experiences',
    blurb: 'Distinctive, motion-rich sites and 3D on the web: configurators, product stories, interactive pieces.',
    proof: ['Ultraviolette X-47 · Tesseract · Shockwave, behind 70,000+ bookings', 'E3 TRION'],
    lead: true,
  },
  {
    id: 'web-apps',
    name: 'Web apps & CMS',
    short: 'apps',
    blurb: 'Custom CMS, bookings, payments, dashboards and the internal tools behind a business.',
    proof: ['Cold Stone Creamery Arabia CMS', 'TRION pre-booking · Suggaa · Maven'],
    lead: false,
  },
  {
    id: 'sites',
    name: 'Websites & launches',
    short: 'websites',
    blurb: 'Marketing sites, rebuilds and launch pages, in code or in Framer and Webflow when your team wants to edit it themselves.',
    proof: ['E3 TRION launch', 'PixelStack Studio'],
    lead: false,
  },
  {
    id: 'search',
    name: 'AI search & SEO',
    short: 'search',
    blurb: "Get named when people ask ChatGPT, Perplexity or Google's AI answers. Answer engine optimisation (AEO): structured data, llms.txt and pages written to be quoted, on solid SEO foundations.",
    proof: ['verastack.dev · structured data, llms.txt, answer-ready copy', 'Origan, rigseed, Riggit and Mehfil product pages'],
    lead: false,
  },
  {
    id: 'videos',
    name: 'Product videos',
    short: 'videos',
    blurb: 'Launch films, explainers and ad cuts for SaaS and other products, made in hours and in your brand\'s own style. Priced to test: ship a few versions, keep the one that works.',
    proof: ['rigseed launch film · full, 30 s and vertical cuts', 'Origan explainer · 16:9, 9:16 and a short', 'Bruno, the open-source API client · independent film'],
    lead: false,
    films: [
      {
        id: 'rigseed-launch',
        title: 'rigseed launch film',
        meta: '0:30',
        src: '/films/rigseed-launch.mp4',
        poster: '/films/rigseed-launch.jpg',
        captions: '/films/rigseed-launch.vtt',
      },
      {
        id: 'origan-explainer',
        title: 'Origan explainer',
        meta: '1:22',
        src: '/films/origan-explainer.mp4',
        poster: '/films/origan-explainer.jpg',
        captions: '/films/origan-explainer.vtt',
      },
      {
        // An independent film, not made with or for the Bruno team; the card says so.
        id: 'bruno-launch',
        title: 'Bruno film (independent)',
        meta: '0:50',
        src: '/films/bruno-launch.mp4',
        poster: '/films/bruno-launch.jpg',
        captions: '/films/bruno-launch.vtt',
      },
    ],
  },
  {
    id: 'apps',
    name: 'Desktop & mobile apps',
    short: 'native',
    blurb: 'Small, fast apps for desktop and Android, from internal tools to our own products.',
    proof: ['rigseed · Riggit', 'Pee Empro attendance app'],
    lead: false,
  },
]

// The tools we build with, for search engines and answer engines (JSON-LD, llms.txt).
export const tools = ['Next.js', 'React', 'TypeScript', 'Three.js', 'Framer', 'Webflow', 'Tauri']

// Under the index: the list is where we start, not where we stop.
export const servicesMore = 'and whatever else lives on a screen. ask.'
