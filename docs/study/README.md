# Study data

The per-site data behind the blog's studies (every homepage's check-by-check results) lives in the
private social-docs repo, under `research/studies/`, because it includes low scores we only share
with each company privately. Each published post carries a "How we measured" box instead.

- Run a study: `node scripts/study-scan.mjs ../social-docs/research/studies/<study>` (reads
  `brands.csv` there, writes `scan.json` there; needs `workers/aeo-check/.report-key`).
- Refresh the totals the tool pages quote: `node scripts/study-gaps.mjs`, which writes
  `src/data/scan-gaps.json` (counts per check, no site names).
