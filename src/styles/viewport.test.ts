import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, sep } from 'node:path'
import { describe, expect, it } from 'vitest'

// dvh grows and shrinks as a phone's address bar hides and shows, shifting everything below it.
// Page sections use svh; only dialogs, which have nothing flowing beneath them, may use dvh.
const DIALOGS = ['src/components/offer/offer.module.css', 'src/app/tools/ai-search-check/checker.module.css', 'src/components/nav/full-menu.module.css']

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? files(path) : /\.(css|tsx?)$/.test(name) && !name.includes('.test.') ? [path] : []
  })
}

describe('viewport units', () => {
  it('keeps dvh out of everything but dialogs', () => {
    const offenders = files('src')
      .map((p) => p.split(sep).join('/'))
      .filter((p) => !DIALOGS.includes(p) && /\b\d+dvh\b|-dvh\b/.test(readFileSync(p, 'utf8')))
    expect(offenders).toEqual([])
  })
})
