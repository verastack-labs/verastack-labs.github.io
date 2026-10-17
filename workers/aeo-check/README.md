# AI search check Worker

The server behind https://verastack.dev/ai-search-check. `GET https://api.verastack.dev/aeo-check?url=example.com`
fetches that page with its robots.txt, llms.txt and sitemap.xml and returns a score out of 100,
the top three fixes and all twelve checks as JSON.

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
