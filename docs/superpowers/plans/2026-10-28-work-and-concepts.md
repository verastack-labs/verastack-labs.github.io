# Work section and concepts gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/work/` on verastack.dev (client work, products and concept samples, each piece page in its own theme) and a public samples gallery at the root of concepts.verastack.dev, with Whispr as its first pitch sample.

**Architecture:** One data module (`src/data/pieces.ts`) derives pieces from `work.ts` and `products.ts` and adds concepts. A single dynamic route `src/app/work/[slug]/page.tsx` renders either a filtered index (reserved facet slugs) or a piece page; `/work/` is the full index. In the concepts repo, `public.json` lists public samples and `build.mjs` generates the gallery, robots.txt and per-path header overrides from it.

**Tech Stack:** Next.js 16 static export, React 19, CSS modules, Vitest; concepts repo is plain Node 22 (`build.mjs`) on Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-10-27-work-and-concepts-routes-design.md`

## Global Constraints

- No em dashes anywhere (copy, comments, commits, PR text). No AI attribution in commits or PRs.
- Builds run on Opus 5.5 or Fable, never Sonnet (Rigan, 2026-10-28). Subagents get `model: "opus"` explicitly.
- Concepts read as concepts: every concept card and page leads with the "Concept" tag, and its title ends in "(concept)". Never "client", never presented as live or past client work.
- Reports (findings, reviews, audits) never public. Ginkvora, Farm Advisors and Cold Stone appear nowhere public.
- No design system images (palettes, tokens, component sheets) on any page.
- No prices on concept pages. Never claim markup gets a site cited.
- "3D experiences", never bare "3D". Never call the studio "small".
- Pre-studio client work is Rigan's own and credited "Rigan Burnwal, as an employee" or "Rigan Burnwal, freelance"; client cards link out to riganb.github.io case studies; no piece page for them.
- Origan demo shots carry "illustrative data, not a real college"; Mehfil says "in development".
- E3 credit wording only: "assisted the design of the glassmorphic elements, and developed the whole website for the launch".
- Soft contrast: no #000/#FFF; piece theme text on background at least 7:1, accent text pair at least 4.5:1.
- One branch per task group, PR, `if gh pr checks --watch --fail-fast; then gh pr merge --squash --delete-branch; fi` (no checks configured means merge directly). Run `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` before each PR.

## Review Focus

1. A facet slug colliding with a piece slug (a piece named `design`) would silently shadow the index: test reserved slugs.
2. A concept whose folder in the concepts repo is listed public but still carries the noindex meta tag: the build check must fail.
3. A private concept folder (ginkvora, farm-advisors) leaking into the gallery, robots.txt or the `/work/` index: test both repos.
4. A light or low-contrast piece theme making the site header or body text unreadable: contrast test on every theme.
5. A discipline filter with no pieces rendering an empty page: facets with zero pieces are not generated and not linked.

---

### Task 1: Pieces data

**Files:**
- Create: `src/data/pieces.ts`, `src/data/pieces.test.ts`

**Interfaces:**
- Consumes: `work`, `WorkEntry` from `@/data/work`; `products`, `Product` from `@/data/products`; `contrastRatio` from `@/lib/contrast`.
- Produces:
  ```ts
  export type Discipline = 'design' | 'development' | 'films' | 'ai-search'
  export type Kind = 'client' | 'product' | 'concept'
  export type PieceTheme = { bg: string; fg: string; muted: string; accent: string; onAccent: string; font: 'house' | 'sora' | 'jakarta' }
  export type Piece = {
    slug: string; kind: Kind; title: string; line: string; disciplines: Discipline[]; date: string // yyyy-mm
    cover: string | null; credit: string; external?: { label: string; url: string }
    page: boolean // false = card links to external only
    theme: PieceTheme
    sections?: Partial<Record<Discipline, { idea: string; shots: { src: string; alt: string; note?: string }[] }>>
    concept?: { for: string; visibility: 'own' | 'anonymised' | 'named'; consent?: string; takes: string }
  }
  export const facets: { slug: string; label: string; filter: (p: Piece) => boolean }[] // clients, products, design, development, films, ai-search
  export const RESERVED: readonly string[] // facets' slugs plus 'concepts'
  export const pieces: Piece[] // newest first
  export const pagePieces: Piece[] // page === true
  export const liveFacets: typeof facets // facets with at least one piece
  ```

Seed content (values pinned here; copy lines may be tightened but claims may not grow):
- Clients (page false, from `work.ts` headliners only): `ultraviolette` (design? no: `['development']`, external case study), `e3-trion` (`['design','development']`, credit "Rigan Burnwal, freelance", line uses the E3 credit wording). Theme from each entry's `art` (`bg: art.to`, accent `art.glow`), cover null.
- Products (page true): `origan`, `rigseed`, `riggit`, `mehfil` with `theme` from `palette` (`muted` derived per product, checked by test), credit "VeraStack Labs", external the product URL, disciplines `['design','development']` (Mehfil line says "in development"). Sections: design shots from `public/work/<slug>/` (Task 3 copies them).
- Concepts:
  - `whispr`: title "Whispr launch teaser (concept)", kind concept, `['films','design']`, date 2026-10, visibility named, `for: 'Whispr'`, consent "heads-up via WhatsApp after the gallery went live (Rigan, 2026-10-28: no OK needed)", external `{ label: 'See the concept', url: 'https://concepts.verastack.dev/whispr/' }`, theme dark crimson `{ bg: '#1A0F11', fg: '#F6E9E7', muted: '#C9AFAD', accent: '#FF5F6D', onAccent: '#261818', font: 'jakarta' }`, takes: "The finished film: licensed music, a voiceover if you want one, cut-downs for every platform and a 4K master."
  - `bookwell`: title "Bookwell launch page (concept)", `['design','development','ai-search']`, visibility own, `for: 'a made-up clinic booking app'`, external `/examples/bookwell/`, theme navy `{ bg: '#16213E', fg: '#F3F1EC', muted: '#B5BCCB', accent: '#E4572E', onAccent: '#16213E', font: 'sora' }`, takes: "Your own brand, copy and launch page, built to read well to people and to AI answers."

- [ ] **Step 1: Write the failing tests** in `src/data/pieces.test.ts`:
  - `has unique slugs and none reserved`: slugs unique; no slug in `RESERVED`.
  - `labels every concept`: each `kind === 'concept'` has `concept`, `title` ends with `(concept)`, `credit` starts with `Concept`.
  - `keeps private and excluded work out`: no slug or title matches `/ginkvora|farm|cold stone|cold-stone/i`.
  - `credits client work to Rigan and links it out`: every client has `page === false`, `external.url` starts with `https://riganb.github.io/work/`, credit matches `/^Rigan Burnwal, (as an employee|freelance)$/`.
  - `keeps every theme readable`: `contrastRatio(fg,bg) >= 7`, `contrastRatio(muted,bg) >= 4.5`, `contrastRatio(onAccent,accent) >= 4.5`; no colour is `#000000` or `#FFFFFF` (case-insensitive).
  - `gives every page piece a section for each discipline it claims` only where `sections` is set: keys are a subset of `disciplines`.
  - `orders pieces newest first`: `date` non-increasing.
  - `liveFacets drops empty facets`.
  - No copy string in pieces contains an em dash (U+2014).
- [ ] **Step 2:** `npx vitest run src/data/pieces.test.ts` → FAIL (module missing).
- [ ] **Step 3:** Implement `src/data/pieces.ts` with the interfaces and seed content above.
- [ ] **Step 4:** Re-run → PASS. Then `npm test` (all green).
- [ ] **Step 5:** Commit `feat(work): pieces data for client work, products and concepts`.

### Task 2: Work index and facet routes

**Files:**
- Create: `src/app/work/page.tsx`, `src/app/work/[slug]/page.tsx`, `src/app/work/work-index.tsx`, `src/app/work/work.module.css`
- Modify: `src/components/nav/site-header.tsx` (PageHeader for `/work` before the generic matches), `src/app/sitemap.ts`, `src/data/studio-links.ts` (add `{ href: '/work', label: 'work', isNew: true }` first), `src/lib/structured-data.ts` only if `llmsText` lists pages.
- Test: `src/app/work/work-routes.test.ts`

**Interfaces:**
- Consumes: Task 1 exports.
- Produces: `WorkIndex({ title: string; lede: string; items: Piece[]; active: string | null }): JSX.Element`; `[slug]/page.tsx` exports `generateStaticParams()` returning `liveFacets` slugs plus `pagePieces` slugs, `dynamicParams = false`, and `generateMetadata`.

Behaviour: `/work/` title "Work · VeraStack Labs", h1 "Everything we make, *in one place.*", label `/work // clients, products and concepts`. Filter row of links: All, Clients, Products, then discipline facets, then "Concepts ↗" linking to `https://concepts.verastack.dev/`. Card: cover or theme-coloured block with the title word, kind tag ("Client", "Product", "Concept"; Concept tag in `--signal`), title, line, discipline chips. Card links to `/work/<slug>/` when `page`, else to `external.url` (new tab). Facet pages reuse `WorkIndex` with their own h1 and lede. JSON-LD `ItemList` like `/tools`.

- [ ] **Step 1: Failing test** `work-routes.test.ts`: `generateStaticParams()` contains every `liveFacets` slug and every `pagePieces` slug, contains no duplicates, and excludes client slugs; sitemap contains `${site.url}/work/` and each param URL.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement routes, index component, CSS (house tokens), header, sitemap, studio link.
- [ ] **Step 4:** Tests pass; `npm run build` produces `out/work/index.html`, `out/work/design/index.html`, `out/work/whispr/index.html`.
- [ ] **Step 5:** Commit `feat(work): /work index and facet pages`.

### Task 3: Piece pages in their own theme

**Files:**
- Create: `src/app/work/piece-page.tsx`, `src/app/work/piece.module.css`, `src/app/work/fonts.ts`, `public/work/<slug>/*.jpg|webp`
- Modify: `src/app/work/[slug]/page.tsx` (render `PiecePage` for piece slugs)

**Interfaces:**
- Consumes: Task 1 `Piece`, Task 2 route.
- Produces: `PiecePage({ piece }: { piece: Piece }): JSX.Element`; `fonts.ts` exports `pieceFont(font: PieceTheme['font']): string` returning a next/font className (Sora 600-800, Plus Jakarta Sans 600-800; `house` returns '').

Layout per spec "Page types / Piece": header (kind tag, title, line, credit, date, external link button), one section per discipline (idea sentence, shots in a grid with captions), concept box "What the full version takes" with `concept.takes` and the CTA "Want one for your launch?" to `/#contact`, then previous/next within the same kind. Theme applied as CSS custom properties (`--p-bg`, `--p-fg`, `--p-muted`, `--p-accent`, `--p-on-accent`) on `<main>`, which also sets the body background for the page. JSON-LD `CreativeWork` with `creator` studio node, `name`, `url`, `image` cover.

Assets (copy, convert to webp under 300 KB each with `sharp` already in node_modules or `npx sharp-cli`; if neither exists use the jpgs as-is):
- origan: `o-land.jpg` (cover), `o-cohort.jpg`, `o-student.jpg`, `o-phone.jpg`, `o-shelf.jpg` from `../proposals/design-work/src/img/`; captions on the dashboard shots say "Illustrative data, not a real college."
- rigseed: `rigseed.jpg` (cover), `rs-dark.jpg`, `rs-light.jpg`, `rs-appear.jpg`.
- riggit: `riggit.jpg` (cover), `riggit-grid.jpg`.
- mehfil: `mehfil.jpg` (cover), `mf-01..04.jpg`; caption "In development, not launched. Real app screens with invented sample data."
- bookwell: `bookwell.jpg` (cover), `p-bookwell.jpg`.
- whispr: `../concepts/whispr/film/cover.webp` (cover) and three frames from `../concepts/whispr/download/whispr-teaser-frame-{1,4,7}.png`.

- [ ] **Step 1: Failing test** in `work-routes.test.ts`: every `cover` and every shot `src` in `pagePieces` exists under `public/`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Copy assets, implement `PiecePage`, fonts and CSS. Section ideas name the thinking (design parallels, statements) and never show a design system.
- [ ] **Step 4:** Tests and build pass. Visual check with the dev server (`verastack-dev`, port 3100) at 1440 and 390 wide on `/work/`, `/work/whispr/`, `/work/bookwell/`, `/work/origan/`: theme applied, header readable, no horizontal scroll, reduced motion respected.
- [ ] **Step 5:** Commit `feat(work): themed piece pages with design, film and build sections`.

### Task 4: Home links and status

**Files:**
- Modify: `src/scenes/work/work.tsx` (link "See all work →" to `/work/` after the list), `src/scenes/products/products.tsx` (secondary link "How we made it" to `/work/<id>/` on each product card), `docs/STATUS.md`, `src/app/llms.txt` if it lists pages.

- [ ] **Step 1:** Add the links; keep the existing tests green (`content.test.ts` section order unchanged).
- [ ] **Step 2:** lint, typecheck, test, build.
- [ ] **Step 3:** STATUS: mark the work routes item done (with what shipped), keep deep dives and the section name as open items.
- [ ] **Step 4:** Commit, PR "feat: /work section with themed piece pages", merge.

### Task 5: Concepts gallery (concepts repo)

**Files (in `../concepts`, its own branch and PR):**
- Create: `public.json`, `_root/gallery.css` (optional, may be inline), `check-public.test.mjs` or a check inside `build.mjs`
- Modify: `build.mjs`, `_root/index.html` (becomes a template or is generated), `_root/_headers`, `_root/robots.txt` (generated), `whispr/index.html`, `PRODUCT.md`

**Interfaces:**
- Produces: `public.json` = `[{ slug, title, for, what, month, cover, url }]`; first entries `whispr` (url `/whispr/`, cover `/whispr/film/cover.webp`) and `bookwell` (url `https://verastack.dev/examples/bookwell/`, cover copied to `_root/covers/bookwell.jpg`).

Rules:
- `build.mjs` after copying: writes `dist/index.html` as the gallery (title "Concepts · VeraStack Labs", h1 "Concepts we make to show what a launch could look like.", grid of cards from `public.json`, footer link to `https://verastack.dev/work/`), in the concepts site's own neutral paper/ink style, indexable.
- Writes `dist/robots.txt`: `User-agent: *`, `Allow: /$`, one `Allow: /<slug>/` per local public sample, `Disallow: /`.
- Appends to `dist/_headers`, for `/` and each local public slug path (`/<slug>/*` and `/<slug>/`): `! X-Robots-Tag` (Cloudflare Pages detach syntax). Private paths keep the site-wide noindex.
- Check (fails the build): every local slug in `public.json` exists, has no `noindex` meta, and is not in a `REPORTS` set (`ginkvora`, `farm-advisors`); no private folder name appears in the gallery HTML.
- `whispr/index.html`: drop the robots meta; banner "Concept by VeraStack Labs for Whispr: launch teaser, October 2026" stays (named); add a footer link to `https://verastack.dev/work/whispr/`.
- `PRODUCT.md`: public samples rule (samples public via `public.json`; reports never; private pitch pages unchanged).

- [ ] **Step 1:** Write the check first; run `node build.mjs` with whispr still noindex and `public.json` listing it → build FAILS with a clear message.
- [ ] **Step 2:** Remove the noindex from whispr; build passes; inspect `dist/index.html`, `dist/robots.txt`, `dist/_headers`.
- [ ] **Step 3:** Open `dist/index.html` locally in the browser pane at 1440 and 390 wide.
- [ ] **Step 4:** Commit, PR, merge; after Cloudflare deploys, `curl -sI https://concepts.verastack.dev/whispr/` shows no `X-Robots-Tag`, `curl -sI https://concepts.verastack.dev/ginkvora/` still shows it, and the root lists Whispr and Bookwell only.

### Task 6: Hand-offs and the schedule

- [ ] **Step 1:** Message the Social media plans chat: gallery URL, `/work/` and `/work/whispr/` URLs, safe claims (concepts are labelled; Whispr is a spec teaser), no-gos (never "client work", no prices, no Ginkvora or Farm Advisors), posting OK. Tell the Personal Portfolio chat about the new section.
- [ ] **Step 2:** Create a fortnightly scheduled task (Thursdays, 11:00 IST, first run 12 Nov 2026) "Own concept": pick an invented brand in an industry from our lead lists, build a sample in the concepts repo following `PRODUCT.md` (own theming, no report), add it to `public.json` and a `pieces.ts` concept entry plus covers here, PR and merge both, then tell the Social chat. Runs on Opus 5.5.
- [ ] **Step 3:** STATUS "Planned": own concepts schedule recorded with the task name.
