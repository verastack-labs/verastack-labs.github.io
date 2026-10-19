// Part A of the D2C AI-visibility study: runs every brand's homepage through the live AI search
// check (the same scoring visitors get) and saves the full reports.
//
//   node docs/study/d2c-ai-visibility/scan.mjs [study-folder]
//
// Reads brands.csv in the study folder (this one by default) and writes scan.json there. Paced
// at one check every 7 seconds to stay under the checker's limit of 10 a minute.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// The study folder lives in the private social-docs repo (research/studies/<study>); pass it.
if (!process.argv[2]) throw new Error('Pass the study folder, e.g. ../social-docs/research/studies/yc-s26')
const here = process.argv[2]
const repo = join(dirname(fileURLToPath(import.meta.url)), '..')
const ENDPOINT = 'https://api.verastack.dev/aeo-check'
const PAUSE_MS = 7000

const brands = readFileSync(join(here, 'brands.csv'), 'utf8')
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((line) => {
    const [brand, domain] = line.split(',')
    return { brand, domain }
  })

// Resumable: brands already in scan.json without an error are kept and skipped.
// Studies need every check, so this sends the studio's key (workers/aeo-check/.report-key).
const REPORT_KEY = readFileSync(join(repo, 'workers/aeo-check/.report-key'), 'utf8').trim()

let results = []
try {
  results = JSON.parse(readFileSync(join(here, 'scan.json'), 'utf8')).results.filter((r) => !r.error)
} catch {}
const done = new Set(results.map((r) => r.domain))

for (const [i, { brand, domain }] of brands.entries()) {
  if (done.has(domain)) continue
  let report
  try {
    const res = await fetch(`${ENDPOINT}?url=${encodeURIComponent(domain)}&fresh=1`, { headers: { Origin: 'https://verastack.dev', 'X-Report-Key': REPORT_KEY } })
    report = await res.json()
  } catch (e) {
    report = { error: String(e) }
  }
  results.push({ brand, domain, ...report })
  console.log(`${i + 1}/${brands.length} ${domain}: ${report.error ?? report.score}`)
  writeFileSync(join(here, 'scan.json'), JSON.stringify({ scannedAt: new Date().toISOString(), results }, null, 2))
  if (i < brands.length - 1) await new Promise((r) => setTimeout(r, PAUSE_MS))
}
