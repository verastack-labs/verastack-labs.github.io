import { describe, expect, it } from 'vitest'
import { faqHtml, faqJsonLd, faqNotes, MAX_QUESTIONS, usable } from '@/lib/faq-schema'
import { gap } from '@/lib/scan-stats'

describe('FAQ markup generator', () => {
  it('builds valid FAQPage JSON-LD from complete pairs only', () => {
    const tag = faqJsonLd([
      { q: ' What is it? ', a: 'A tool  that does one thing well.' },
      { q: 'Half done?', a: '' },
    ])
    const json = JSON.parse(tag.replace(/^<script type="application\/ld\+json">\n|\n<\/script>$/g, ''))
    expect(json['@type']).toBe('FAQPage')
    expect(json.mainEntity).toEqual([{ '@type': 'Question', name: 'What is it?', acceptedAnswer: { '@type': 'Answer', text: 'A tool that does one thing well.' } }])
  })

  it('cannot be broken out of: no closing script tag inside, HTML escaped', () => {
    const evil = { q: 'Is </script><b>x</b> safe?', a: 'Yes "really" & <i>truly</i>, it is safe for everyone.' }
    expect(faqJsonLd([evil]).match(/<\/script>/g)).toHaveLength(1)
    expect(faqHtml([evil])).toContain('&lt;/script&gt;')
    expect(faqHtml([evil])).not.toContain('<i>')
  })

  it('caps the number of questions', () => {
    const many = Array.from({ length: 30 }, (_, i) => ({ q: `Question ${i}?`, a: 'An answer long enough to count here.' }))
    expect(usable(many)).toHaveLength(MAX_QUESTIONS)
  })

  it('flags placeholders, missing question marks and very short answers', () => {
    expect(faqNotes({ q: 'What does [product] do', a: 'Stuff.' })).toHaveLength(3)
    expect(faqNotes({ q: 'What does it do?', a: 'It turns your questions into markup that AI answers can quote.' })).toEqual([])
  })

  it('reads the FAQ gap from the scan data', () => {
    const faq = gap('faq')
    expect(faq.total).toBeGreaterThan(300)
    expect(faq.nonePct).toBeGreaterThan(50)
  })
})
