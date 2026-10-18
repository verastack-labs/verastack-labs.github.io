# AI search check Worker

The server behind https://verastack.dev/ai-search-check. `GET https://api.verastack.dev/aeo-check?url=example.com`
fetches that page with its robots.txt, llms.txt and sitemap.xml and returns a score out of 100,
the top three fixes and a count of the rest as JSON. Every check's finding and fix together are
the audit, so only requests carrying the studio key in an `X-Report-Key` header get all sixteen:
`node full-report.mjs example.com` prints them, and the study scan uses the same key.
`node report-email.mjs example.com [first name]` drafts the complete-report email a visitor asked
for (sent by hand from rigan@verastack.dev): it prints the subject and writes the HTML body to
`emails/<host>.html`, which is not in git.

The key lives in `.report-key` here (not in git) and on the Worker as a secret:

```bash
npx wrangler secret put REPORT_KEY < .report-key
```

- `src/guard.ts`: which addresses may be fetched (public hostnames only; every redirect rechecked).
- `src/robots.ts`: robots.txt rules per crawler (RFC 9309).
- `src/html.ts`: what the server HTML says (title, description, canonical, JSON-LD types, words).
- `src/score.ts`: the checks, their weights and the fixes. The page copy in
  `src/data/ai-search-check.ts` lists the same checks; a test keeps them in step.
- `src/index.ts`: CORS (verastack.dev and localhost), rate limit, cache and fetching.

Tests run with the site's own `npm test`. Deploy by hand, from this folder:

```bash
npm install
npx wrangler deploy
```
