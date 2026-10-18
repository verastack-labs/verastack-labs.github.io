import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// Numbers for the tool pages, counted at build time from every homepage we have scanned
// (docs/study/*/), so a page never quotes a figure the data does not hold.
type Checks = Record<string, 'pass' | 'warn' | 'fail'>

const STUDY = join(process.cwd(), 'docs', 'study')

function homepages(): Checks[] {
  const out: Checks[] = []
  const toChecks = (r: { checks?: { id: string; status: 'pass' | 'warn' | 'fail' }[] }) =>
    r.checks ? Object.fromEntries(r.checks.map((c) => [c.id, c.status])) : null
  for (const dir of readdirSync(STUDY, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue
    const folder = join(STUDY, dir.name)
    const scan = join(folder, 'scan.json')
    if (existsSync(scan)) {
      for (const r of JSON.parse(readFileSync(scan, 'utf8')).results ?? []) {
        const c = toChecks(r)
        if (c) out.push(c)
      }
      continue
    }
    for (const f of readdirSync(folder)) {
      if (!f.endsWith('.json')) continue
      const c = toChecks(JSON.parse(readFileSync(join(folder, f), 'utf8')))
      if (c) out.push(c)
    }
  }
  return out
}

export type GapStat = { total: number; none: number; notPassing: number; nonePct: number; notPassingPct: number }

// How many scanned homepages fail a check outright (`none`) or do not fully pass it.
export function gap(checkId: string): GapStat {
  const all = homepages().filter((c) => c[checkId])
  const none = all.filter((c) => c[checkId] === 'fail').length
  const notPassing = all.filter((c) => c[checkId] !== 'pass').length
  const pct = (n: number) => Math.round((n / all.length) * 100)
  return { total: all.length, none, notPassing, nonePct: pct(none), notPassingPct: pct(notPassing) }
}
