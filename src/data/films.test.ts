import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { allFilms } from '@/data/films'

const EM_DASH = String.fromCodePoint(0x2014)

describe('films', () => {
  it('has unique ids and every file on disk', () => {
    expect(new Set(allFilms.map((f) => f.id)).size).toBe(allFilms.length)
    for (const f of allFilms) for (const file of [f.src, f.poster, f.captions]) expect(existsSync(join(process.cwd(), 'public', file)), `${f.id}: ${file}`).toBe(true)
  })

  it('marks vertical films as portrait', () => {
    for (const f of allFilms) expect(!!f.portrait, f.id).toBe(f.formats.length === 1 && f.formats[0] === '9:16')
  })

  it('labels concepts and unofficial films with a trademark line', () => {
    for (const f of allFilms.filter((x) => /\((concept|unofficial)\)/.test(x.title))) expect(f.note, f.id).toMatch(/marks belong to/)
  })

  it('never uses an em dash', () => {
    expect(JSON.stringify(allFilms)).not.toContain(EM_DASH)
  })
})
