// The full report for one address, for writing the summary a visitor asked for.
// node workers/aeo-check/full-report.mjs example.com
// Needs the studio's key in workers/aeo-check/.report-key (not in git; `npx wrangler secret put
// REPORT_KEY` sets the same value on the Worker).
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const key = readFileSync(join(here, '.report-key'), 'utf8').trim()
const url = process.argv[2]
if (!url) throw new Error('Pass an address, like example.com')

const res = await fetch(`https://api.verastack.dev/aeo-check?url=${encodeURIComponent(url)}&fresh=1`, {
  headers: { Origin: 'https://verastack.dev', 'X-Report-Key': key },
})
const report = await res.json()
if (report.error) throw new Error(report.error)
console.log(`${report.url}: ${report.score}/100\n`)
for (const c of report.checks) {
  console.log(`[${c.status}] ${c.label}\n  ${c.detail}${c.status === 'pass' ? '' : `\n  Fix: ${c.fix}`}\n`)
}
