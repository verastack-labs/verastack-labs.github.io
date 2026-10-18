import { describe, expect, it } from 'vitest'
import { aboutSentence, blankOrg, orgJsonLd, orgNotes, platform, webAddress, type OrgInput } from '@/lib/org-schema'

const parse = (tag: string) => JSON.parse(tag.replace(/^<script type="application\/ld\+json">\n|\n<\/script>$/g, ''))
const acme: OrgInput = {
  ...blankOrg(),
  name: 'Acme',
  what: 'booking software for clinics',
  url: 'acme.com',
  logo: 'https://acme.com/logo.png',
  founded: '2024',
  city: 'Bengaluru',
  country: 'India',
  founders: 'Asha Rao, Ben Lee',
  email: 'hello@acme.com',
  profiles: ['linkedin.com/company/acme', 'https://x.com/acme', 'not a url', 'https://x.com/acme'],
}

describe('Organization markup generator', () => {
  it('writes the about line', () => {
    expect(aboutSentence(acme)).toBe('Acme makes booking software for clinics, founded in 2024 and based in Bengaluru, India.')
    expect(aboutSentence({ ...blankOrg(), name: 'Acme', what: 'booking software' })).toBe('Acme makes booking software.')
  })

  it('builds Organization JSON-LD with clean, de-duplicated profiles', () => {
    const json = parse(orgJsonLd(acme))
    expect(json).toMatchObject({ '@type': 'Organization', name: 'Acme', url: 'https://acme.com', foundingDate: '2024' })
    expect(json.address).toEqual({ '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressCountry: 'India' })
    expect(json.founder).toHaveLength(2)
    expect(json.contactPoint.email).toBe('hello@acme.com')
    expect(json.sameAs).toEqual(['https://linkedin.com/company/acme', 'https://x.com/acme'])
  })

  it('cannot be broken out of', () => {
    expect(orgJsonLd({ ...acme, name: '</script><script>x</script>' }).match(/<\/script>/g)).toHaveLength(1)
  })

  it('reads addresses and platforms', () => {
    expect(webAddress('acme.com/')).toBe('https://acme.com')
    expect(webAddress('hello')).toBeNull()
    expect(platform('https://www.linkedin.com/company/acme')).toBe('LinkedIn')
    expect(platform('https://twitter.com/acme')).toBe('X')
    expect(platform('https://acme.com')).toBeNull()
  })

  it('asks for what tells you apart', () => {
    expect(orgNotes(blankOrg())).toHaveLength(5)
    expect(orgNotes(acme)).toEqual(['One of the profile links is not a web address.'])
  })
})
