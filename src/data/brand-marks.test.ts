import { createHash } from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import marks from '../../scripts/brand-marks.json'

// Every image of our work the site serves carries "By VeraStack Labs" (Rigan, 2026-10-31): either from
// its source, or put there by scripts/brand-mark.py, whose hash must still match the file.
const served = ['public/work', 'public/blog'].flatMap((dir) =>
  readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) => readdirSync(join(dir, d.name)).filter((f) => f.endsWith('.webp')).map((f) => `${dir}/${d.name}/${f}`)),
)
const marked = marks.marked as Record<string, string>

describe('brand marks', () => {
  it('has the studio mark on every served image', () => {
    for (const f of served) expect(marks.atSource.includes(f) || f in marked, `${f}: run python scripts/brand-mark.py`).toBe(true)
  })

  it('has not changed an image since it was marked', () => {
    for (const [f, hash] of Object.entries(marked)) expect(createHash('sha256').update(readFileSync(f)).digest('hex'), `${f}: run python scripts/brand-mark.py`).toBe(hash)
  })
})
