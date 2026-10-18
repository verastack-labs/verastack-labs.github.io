// The FAQ markup generator (/tools/faq-schema): turns question and answer pairs into FAQPage
// JSON-LD and matching HTML. Pure functions, so the browser tool and the tests share them.

export type Qa = { q: string; a: string }

export const MAX_QUESTIONS = 20

// Starting questions per kind of business; the answers stay blank, with a hint of what to write.
export const faqTemplates: { id: string; name: string; items: { q: string; hint: string }[] }[] = [
  {
    id: 'saas',
    name: 'SaaS',
    items: [
      { q: 'What does [product] do?', hint: 'One sentence a stranger understands: what it is, for whom, the result.' },
      { q: 'Who is [product] for?', hint: 'The team, role or company size it fits best, and who it is not for.' },
      { q: 'How much does [product] cost?', hint: 'Your plans and prices, or the starting price, and whether there is a free plan or trial.' },
      { q: 'How is [product] different from [alternative]?', hint: 'The one or two real differences a buyer would notice.' },
      { q: 'Is my data secure with [product]?', hint: 'Where data is stored, certifications, and who can see it.' },
    ],
  },
  {
    id: 'studio',
    name: 'Studio or agency',
    items: [
      { q: 'What do you build?', hint: 'Your services in one line each: apps, websites, AI, design.' },
      { q: 'How much does a project cost?', hint: 'A typical range or a starting price, and what changes it.' },
      { q: 'How long does a project take?', hint: 'A typical timeline from kick-off to launch.' },
      { q: 'Do you work with startups?', hint: 'Who you usually work with, by stage, size or industry.' },
      { q: 'Who will I work with?', hint: 'The people on a project, and how you keep clients updated.' },
    ],
  },
  {
    id: 'store',
    name: 'Online store',
    items: [
      { q: 'What is [product] made from?', hint: 'The materials or ingredients, plainly.' },
      { q: 'How long does delivery take?', hint: 'Delivery times by region, and the shipping cost.' },
      { q: 'What is your return policy?', hint: 'How many days, who pays for the return, and how to start one.' },
      { q: 'Is [product] right for [use or person]?', hint: 'Who it suits, and who should pick something else.' },
      { q: 'Where can I buy [product]?', hint: 'Your store, marketplaces and any shops that stock it.' },
    ],
  },
  { id: 'blank', name: 'Start blank', items: [{ q: '', hint: 'Answer in one or two sentences.' }] },
]

const clean = (s: string) => s.replace(/\s+/g, ' ').trim()

export function usable(items: Qa[]): Qa[] {
  return items.map((i) => ({ q: clean(i.q), a: clean(i.a) })).filter((i) => i.q && i.a).slice(0, MAX_QUESTIONS)
}

// FAQPage JSON-LD as a script tag, safe to paste into any page: no closing tag can appear inside.
export function faqJsonLd(items: Qa[]): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: usable(items).map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
  }
  const json = JSON.stringify(data, null, 2).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">\n${json}\n</script>`
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// The same questions as visible HTML. Engines expect the marked-up answers to be on the page too.
export function faqHtml(items: Qa[]): string {
  const rows = usable(items).map((i) => `  <details>\n    <summary>${escapeHtml(i.q)}</summary>\n    <p>${escapeHtml(i.a)}</p>\n  </details>`)
  return `<section class="faq">\n  <h2>Questions</h2>\n${rows.join('\n')}\n</section>`
}

// Gentle checks on each pair, the things that make an answer easy or hard for an engine to quote.
export function faqNotes(item: Qa): string[] {
  const q = clean(item.q)
  const a = clean(item.a)
  const notes: string[] = []
  if (/\[[^\]]+\]/.test(q) || /\[[^\]]+\]/.test(a)) notes.push('Replace the [placeholder] with your own words.')
  if (q && !q.endsWith('?')) notes.push('Phrase it as the question a buyer would type, ending in a question mark.')
  if (a && a.split(/\s+/).length < 8) notes.push('A little short: one or two full sentences quote best.')
  if (a.length > 320) notes.push('Long: engines quote short answers; aim for under 300 characters.')
  return notes
}
