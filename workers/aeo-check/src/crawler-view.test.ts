import { describe, expect, it } from 'vitest'
import { crawlerView } from './crawler-view'

describe('crawler view', () => {
  it('reads headings, paragraphs and list items in order, skipping scripts', () => {
    const v = crawlerView(`<html><head><title>Acme &amp; co</title><meta name="description" content="Booking software."></head><body>
      <script>window.app = "Not text"</script><h1>Acme</h1><p>Booking software for <b>clinics</b>.</p>
      <ul><li><p>Fast</p></li><li>Cheap</li></ul><div>Loose words here</div><noscript>Enable JS</noscript></body></html>`)
    expect(v.title).toBe('Acme & co')
    expect(v.description).toBe('Booking software.')
    expect(v.blocks).toEqual([
      { tag: 'h1', text: 'Acme' },
      { tag: 'p', text: 'Booking software for clinics.' },
      { tag: 'li', text: 'Fast' },
      { tag: 'li', text: 'Cheap' },
    ])
    expect(v.words).toBe(10)
  })

  it('shows a JavaScript-only page as nearly blank', () => {
    const v = crawlerView('<html><body><div id="root"></div><script src="/app.js"></script></body></html>')
    expect(v.blocks).toEqual([])
    expect(v.words).toBe(0)
  })
})
