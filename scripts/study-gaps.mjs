// Totals for the tool pages, from the private study data in social-docs: per check, how many
// homepages were checked, how many fail it outright and how many do not fully pass. No site names
// leave the private repo; only these counts are committed here.
// node scripts/study-gaps.mjs [study root, default ../social-docs/research/studies]
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(process.argv[2] ?? join(here, '..', '..', 'social-docs', 'research', 'studies'))
const homepages = []
const take = (r) => r.checks && homepages.push(Object.fromEntries(r.checks.map((c) => [c.id, c.status])))

for (const dir of readdirSync(root, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue
  const folder = join(root, dir.name)
  const scan = join(folder, 'scan.json')
  if (existsSync(scan)) {
    for (const r of JSON.parse(readFileSync(scan, 'utf8')).results ?? []) take(r)
    continue
  }
  for (const f of readdirSync(folder)) if (f.endsWith('.json') && f !== 'companies.json') take(JSON.parse(readFileSync(join(folder, f), 'utf8')))
}

const ids = [...new Set(homepages.flatMap((h) => Object.keys(h)))].sort()
const checks = Object.fromEntries(
  ids.map((id) => {
    const all = homepages.filter((h) => h[id])
    return [id, { total: all.length, none: all.filter((h) => h[id] === 'fail').length, notPassing: all.filter((h) => h[id] !== 'pass').length }]
  }),
)
const out = join(here, '..', 'src', 'data', 'scan-gaps.json')
writeFileSync(out, `${JSON.stringify({ homepages: homepages.length, updated: new Date().toISOString().slice(0, 10), checks }, null, 2)}\n`)
console.log(`${homepages.length} homepages, ${ids.length} checks -> ${out}`)
