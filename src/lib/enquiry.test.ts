import { describe, expect, it } from 'vitest'
import { filledCount, isEmail, mailtoHref, problemMessage, problems, sentence, type Enquiry } from '@/lib/enquiry'

const base: Enquiry = {
  name: 'Asha',
  company: '',
  service: 'a configurator',
  budget: '₹2-5L',
  timeline: 'within 3 months',
  email: 'asha@example.com',
  note: '',
}

describe('enquiry validation', () => {
  it('accepts ordinary addresses and rejects broken ones', () => {
    expect(isEmail('asha@example.com')).toBe(true)
    expect(isEmail(' asha@example.co.in ')).toBe(true)
    expect(isEmail('asha@example')).toBe(false)
    expect(isEmail('asha example.com')).toBe(false)
    expect(isEmail('')).toBe(false)
  })

  it('needs a name and a valid email, nothing else', () => {
    expect(problems(base)).toEqual({})
    expect(problems({ ...base, name: '  ' })).toEqual({ name: 'empty' })
    expect(problems({ ...base, email: '' })).toEqual({ email: 'empty' })
    expect(problems({ ...base, email: 'asha@' })).toEqual({ email: 'email' })
  })

  it('says what is wrong in the voice of the form', () => {
    expect(problemMessage({})).toBeNull()
    expect(problemMessage({ email: 'email' })).toBe("that email doesn't look right")
    expect(problemMessage({ name: 'empty' })).toBe('a couple of blanks are still empty')
    expect(problemMessage({ name: 'empty', email: 'email' })).toBe('a couple of blanks are still empty')
  })

  it('counts the typed blanks, company included', () => {
    expect(filledCount({ name: '', company: '', email: '' })).toBe(0)
    expect(filledCount(base)).toBe(2)
    expect(filledCount({ ...base, company: 'Acme' })).toBe(3)
  })
})

describe('the sentence', () => {
  it('reads as the form reads, leaving out an empty company', () => {
    expect(sentence(base)).toBe(
      "Hi, I'm Asha. We need a configurator with a budget of ₹2-5L, ideally live by within 3 months. Reach me at asha@example.com.",
    )
    expect(sentence({ ...base, company: 'Acme' })).toContain("I'm Asha from Acme.")
  })

  it('adds the note on its own paragraph', () => {
    expect(sentence({ ...base, note: 'see example.com' })).toMatch(/\.\n\nsee example\.com$/)
  })

  it('pre-fills a mailto with the sentence as the body', () => {
    const href = mailtoHref('hello@studio.test', base)
    expect(href.startsWith('mailto:hello@studio.test?subject=Project%20enquiry%20from%20Asha&body=')).toBe(true)
    expect(decodeURIComponent(href.split('body=')[1])).toBe(sentence(base))
  })
})
