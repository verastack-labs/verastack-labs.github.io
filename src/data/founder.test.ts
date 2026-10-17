import { describe, expect, it } from 'vitest'
import { founder, founderQuestions, pressOutlets } from '@/data/founder'
import { work } from '@/data/work'

describe('founder page data', () => {
  it('holds every metric to the work entry it comes from, labelled with whose work it was', () => {
    expect(founder.metrics.map((m) => m.value)).toEqual(['70,000+', 'Day 1', '3,000+'])
    for (const m of founder.metrics) {
      expect(`${m.source.result ?? ''} ${m.source.summary}`).toContain(m.evidence)
      expect(m.label).toMatch(m.source.role === 'employee' ? /as an employee$/ : /independent client work$/)
    }
  })

  it('labels the founder’s own work on the rail', () => {
    const own = founder.rail.filter((r) => /Ultraviolette|TRION/.test(r.name))
    expect(own).toHaveLength(3)
    for (const r of own) expect(r.line).toMatch(/as an employee|independent client work/)
    expect(founder.rail.at(-1)).toMatchObject({ name: 'Your launch', you: true })
  })

  it('names every live or launching supporting client in "What have you launched before?"', () => {
    const answer = founderQuestions.find((f) => f.q === 'What have you launched before?')!.a
    for (const w of work.filter((x) => x.tier === 'supporting' && !/in progress/i.test(x.summary))) expect(answer).toContain(w.client)
    expect(founderQuestions).toHaveLength(5)
  })

  it('lists each press outlet once', () => {
    const outlets = pressOutlets().map((p) => p.outlet)
    expect(new Set(outlets).size).toBe(outlets.length)
    expect(outlets.length).toBe(new Set(work.flatMap((w) => (w.press ?? []).map((p) => p.outlet))).size)
  })

  it('has no em dash and no resume link', () => {
    const all = JSON.stringify({ founder: { ...founder, metrics: founder.metrics.map(({ value, label }) => ({ value, label })) }, founderQuestions })
    expect(all).not.toContain(String.fromCodePoint(0x2014))
    expect(all.toLowerCase()).not.toContain('resume')
  })
})
