import gaps from '@/data/scan-gaps.json'

// Numbers for the tool pages: per check, how many of the homepages we have scanned fail it or do not
// fully pass it. The per-site study data is private (social-docs research/studies); these totals
// are regenerated from it with `node scripts/study-gaps.mjs`, so a page never quotes a figure the
// data does not hold.
export type GapStat = { total: number; none: number; notPassing: number; nonePct: number; notPassingPct: number }

export function gap(checkId: string): GapStat {
  const c = (gaps.checks as Record<string, { total: number; none: number; notPassing: number }>)[checkId]
  if (!c) throw new Error(`No scan totals for the ${checkId} check`)
  const pct = (n: number) => Math.round((n / c.total) * 100)
  return { ...c, nonePct: pct(c.none), notPassingPct: pct(c.notPassing) }
}
