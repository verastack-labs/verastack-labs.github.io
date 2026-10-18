# Summarises the studios scan: python docs/study/studios-2026-10/summary.py
import collections, glob, json, os, statistics

here = os.path.dirname(os.path.abspath(__file__))
rows = []
for f in glob.glob(os.path.join(here, '*.json')):
    d = json.load(open(f, encoding='utf8'))
    if 'checks' not in d:
        print('ERROR', os.path.basename(f), d)
        continue
    rows.append((os.path.basename(f)[:-5], d['score'], {c['id']: c['status'] for c in d['checks']}))
rows.sort(key=lambda r: r[1])
print(len(rows), 'sites, median', statistics.median([r[1] for r in rows]))
print([(r[0], r[1]) for r in rows])
cnt = collections.Counter()
for _, _, checks in rows:
    for k, v in checks.items():
        if v != 'pass':
            cnt[(k, v)] += 1
for k in sorted({k for k, _ in cnt}):
    print(f'{k}: fail {cnt[(k, "fail")]}, warn {cnt[(k, "warn")]}')
print('under 75:', sum(r[1] < 75 for r in rows))
print('identity fail (no Organization at all):', cnt[('identity', 'fail')])
