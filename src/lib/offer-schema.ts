// The product and service markup generator (/tools/product-schema): describes what a business sells
// as JSON-LD (SoftwareApplication, Service or Product) and, more important, as the plain sentence to
// put on the page, which is what an AI answer can quote. Pure functions shared with the tests.

export type Kind = 'software' | 'service' | 'product'
export type Plan = { name: string; price: string; period: 'month' | 'year' | 'once' }

export type OfferInput = {
  kind: Kind
  name: string
  // What it is, for whom: "booking software for clinics".
  what: string
  url: string
  company: string
  currency: string
  plans: Plan[]
  // Software: the category; service: the service type; product: the brand.
  category: string
  // Service only: where it is offered.
  area: string
  // Product only.
  availability: 'InStock' | 'PreOrder' | 'OutOfStock'
}

export const blankOffer = (kind: Kind): OfferInput => ({
  kind,
  name: '',
  what: '',
  url: '',
  company: '',
  currency: 'USD',
  plans: [{ name: kind === 'product' ? '' : 'Starter', price: '', period: kind === 'product' ? 'once' : kind === 'service' ? 'once' : 'month' }],
  category: kind === 'software' ? 'BusinessApplication' : '',
  area: '',
  availability: 'InStock',
})

export const softwareCategories = [
  'BusinessApplication',
  'DeveloperApplication',
  'DesignApplication',
  'FinanceApplication',
  'EducationalApplication',
  'HealthApplication',
  'CommunicationApplication',
  'SecurityApplication',
  'UtilitiesApplication',
]

const t = (s: string) => s.replace(/\s+/g, ' ').trim()
const priced = (plans: Plan[]) => plans.filter((p) => t(p.price) !== '' && !Number.isNaN(Number(t(p.price))))
const money = (price: string, currency: string) => {
  const n = Number(price)
  const symbol: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', INR: '₹' }
  const amount = Number.isInteger(n) ? n.toLocaleString('en-US') : n.toFixed(2)
  return symbol[currency] ? `${symbol[currency]}${amount}` : `${amount} ${currency}`
}
const per = (p: Plan['period']) => (p === 'month' ? ' a month' : p === 'year' ? ' a year' : '')

// The sentence for the page: what it is, for whom, and where the price starts.
export function plainSentence(o: OfferInput): string {
  const name = t(o.name) || 'Your product'
  const what = t(o.what).replace(/\.$/, '')
  // Used as written: "booking software for clinics", "an online course platform".
  const first = what ? `${name} is ${what}.` : `${name} is …`
  const plans = priced(o.plans)
  if (!plans.length) return first
  const lowest = plans.reduce((a, b) => (Number(a.price) <= Number(b.price) ? a : b))
  if (Number(lowest.price) === 0) return `${first} There is a free plan${plans.length > 1 ? `; paid plans start at ${money(String(Math.min(...plans.filter((p) => Number(p.price) > 0).map((p) => Number(p.price)))), o.currency)}${per(plans.find((p) => Number(p.price) > 0)?.period ?? 'month')}` : ''}.`
  const lead = o.kind === 'service' ? 'Projects start at' : o.kind === 'product' ? 'It costs' : 'Plans start at'
  return `${first} ${lead} ${money(lowest.price, o.currency)}${per(lowest.period)}.`
}

function offers(o: OfferInput) {
  const list = priced(o.plans).map((p) => ({
    '@type': 'Offer',
    ...(t(p.name) ? { name: t(p.name) } : {}),
    price: t(p.price),
    priceCurrency: o.currency,
    ...(o.kind === 'product' ? { availability: `https://schema.org/${o.availability}` } : {}),
    ...(p.period !== 'once'
      ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: t(p.price), priceCurrency: o.currency, unitText: p.period.toUpperCase() } }
      : {}),
  }))
  return list.length === 0 ? {} : { offers: list.length === 1 ? list[0] : list }
}

export function offerJsonLd(o: OfferInput): string {
  const base = {
    '@context': 'https://schema.org',
    name: t(o.name),
    ...(t(o.what) ? { description: plainSentence({ ...o, plans: [] }) } : {}),
    ...(t(o.url) ? { url: t(o.url) } : {}),
  }
  const company = t(o.company) ? { '@type': 'Organization', name: t(o.company) } : undefined
  const data =
    o.kind === 'software'
      ? { ...base, '@type': 'SoftwareApplication', applicationCategory: o.category || 'BusinessApplication', operatingSystem: 'Web', ...(company ? { publisher: company } : {}), ...offers(o) }
      : o.kind === 'service'
        ? { ...base, '@type': 'Service', ...(t(o.category) ? { serviceType: t(o.category) } : {}), ...(t(o.area) ? { areaServed: t(o.area) } : {}), ...(company ? { provider: company } : {}), ...offers(o) }
        : { ...base, '@type': 'Product', ...(t(o.category) ? { brand: { '@type': 'Brand', name: t(o.category) } } : {}), ...offers(o) }
  const json = JSON.stringify(data, null, 2).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">\n${json}\n</script>`
}

// What is missing for the description to be useful.
export function offerNotes(o: OfferInput): string[] {
  const notes: string[] = []
  if (!t(o.name)) notes.push('Add the name.')
  if (!t(o.what)) notes.push('Say what it is and who it is for: this is the line an AI answer can quote.')
  else if (t(o.what).split(' ').length < 3) notes.push('Say a little more: what it is and who it is for, in a few words.')
  if (!priced(o.plans).length) notes.push('Add a price, or a starting price. Buyers ask, and answers quote it.')
  if (t(o.url) && !/^https?:\/\//.test(t(o.url))) notes.push('Start the address with https://.')
  return notes
}
