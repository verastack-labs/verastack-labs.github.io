export type Service = {
  id: string
  name: string
  // One word for the "keep scrolling for 02 ..." hint.
  short: string
  blurb: string
  proof: string[]
  lead: boolean
}

// Spec 6.02, in this order. Proof lines credit the founder's work (spec voice, section 4.4). The
// first service carries the configurator demo, one example of 3D on the web.
export const services: Service[] = [
  {
    id: 'experiences',
    name: 'Web experiences & 3D',
    short: 'experiences',
    blurb: 'Distinctive, motion-rich sites and 3D on the web: configurators, product stories, interactive pieces.',
    proof: ['Ultraviolette X-47 · Tesseract', 'E3 TRION'],
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
    blurb: 'Marketing sites, rebuilds and launch pages, fast and easy to keep up to date.',
    proof: ['E3 TRION launch', 'PixelStack Studio'],
    lead: false,
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

// Under the index: the list is where we start, not where we stop.
export const servicesMore = 'and whatever else lives on a screen. ask.'
