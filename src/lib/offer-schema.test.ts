import { describe, expect, it } from 'vitest'
import { blankOffer, offerJsonLd, offerNotes, plainSentence, type OfferInput } from '@/lib/offer-schema'

const parse = (tag: string) => JSON.parse(tag.replace(/^<script type="application\/ld\+json">\n|\n<\/script>$/g, ''))
const saas: OfferInput = {
  ...blankOffer('software'),
  name: 'Acme',
  what: 'booking software for clinics',
  url: 'https://acme.example.com',
  company: 'Acme Inc',
  plans: [
    { name: 'Starter', price: '29', period: 'month' },
    { name: 'Team', price: '99', period: 'month' },
  ],
}

describe('product and service markup generator', () => {
  it('writes the plain sentence for the page', () => {
    expect(plainSentence(saas)).toBe('Acme is booking software for clinics. Plans start at $29 a month.')
    expect(plainSentence({ ...saas, what: 'an online course platform', plans: [] })).toBe('Acme is an online course platform.')
    expect(plainSentence({ ...saas, plans: [{ name: 'Free', price: '0', period: 'month' }, { name: 'Pro', price: '12', period: 'month' }] })).toBe(
      'Acme is booking software for clinics. There is a free plan; paid plans start at $12 a month.',
    )
    expect(plainSentence({ ...blankOffer('service'), name: 'Studio X', what: 'a web design studio for startups', currency: 'INR', plans: [{ name: '', price: '400000', period: 'once' }] })).toBe(
      'Studio X is a web design studio for startups. Projects start at ₹400,000.',
    )
  })

  it('builds SoftwareApplication with every priced plan as an offer', () => {
    const json = parse(offerJsonLd(saas))
    expect(json['@type']).toBe('SoftwareApplication')
    expect(json.publisher).toEqual({ '@type': 'Organization', name: 'Acme Inc' })
    expect(json.offers).toHaveLength(2)
    expect(json.offers[0].priceSpecification.unitText).toBe('MONTH')
  })

  it('builds Service and Product too', () => {
    expect(parse(offerJsonLd({ ...blankOffer('service'), name: 'Audit', what: 'an SEO audit', area: 'Worldwide', category: 'SEO' }))).toMatchObject({ '@type': 'Service', serviceType: 'SEO', areaServed: 'Worldwide' })
    const product = parse(offerJsonLd({ ...blankOffer('product'), name: 'Hair oil', category: 'Brandy', plans: [{ name: '', price: '12.5', period: 'once' }] }))
    expect(product).toMatchObject({ '@type': 'Product', brand: { name: 'Brandy' }, offers: { price: '12.5', availability: 'https://schema.org/InStock' } })
  })

  it('cannot be broken out of', () => {
    expect(offerJsonLd({ ...saas, name: '</script><script>alert(1)</script>' }).match(/<\/script>/g)).toHaveLength(1)
  })

  it('asks for what an answer needs', () => {
    expect(offerNotes(blankOffer('software'))).toHaveLength(3)
    expect(offerNotes(saas)).toEqual([])
  })
})
