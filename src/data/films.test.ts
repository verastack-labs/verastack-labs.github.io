import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { allFilms, shorts } from '@/data/films'

const EM_DASH = String.fromCodePoint(0x2014)

describe('films', () => {
  it('has unique ids and every file on disk', () => {
    expect(new Set(allFilms.map((f) => f.id)).size).toBe(allFilms.length)
    for (const f of allFilms) {
      const cuts = f.versions ? Object.values(f.versions).flatMap((v) => Object.values(v)) : []
      for (const file of [f.src, f.poster, f.captions, ...cuts.flatMap((c) => [c.src, c.poster])]) expect(existsSync(join(process.cwd(), 'public', file)), `${f.id}: ${file}`).toBe(true)
    }
  })

  it('marks vertical-first films as portrait', () => {
    for (const f of allFilms) expect(!!f.portrait, f.id).toBe(f.formats[0] === '9:16')
  })

  it('lists both cuts and both versions as formats', () => {
    for (const f of allFilms.filter((x) => x.versions)) expect(f.formats, f.id).toEqual(expect.arrayContaining(['9:16', '1:1', 'light and dark']))
  })

  it('labels concepts and unofficial films with a trademark line', () => {
    for (const f of allFilms.filter((x) => /\((concept|unofficial)\)/.test(x.title))) expect(f.note, f.id).toMatch(/marks belong to/)
  })

  it('labels The Switch as The Open Shelf, not Origan', () => {
    const film = shorts.find((f) => f.id === 'switch-short')
    expect(`${film?.line} ${film?.note}`).toContain('The Open Shelf')
    expect(JSON.stringify(film)).not.toMatch(/origan/i)
  })

  it('never uses an em dash', () => {
    expect(JSON.stringify(allFilms)).not.toContain(EM_DASH)
  })
})
