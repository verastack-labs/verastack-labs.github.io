# Work, products and concepts: routes and pages

Rigan, 2026-10-27: plan the concepts, work and products routes. Concepts are already being built at
concepts.verastack.dev, and some should be public so our audience can browse them. Even when a concept
never becomes a client, it shows our ideas and what we can make. The gap between real work and concepts
should close: concepts appear as work too. This replaces the "Work architecture brainstorm" item in
STATUS (2026-10-23). Rigan skipped the question round, so every choice below marked **my call** is open
to change.

## What exists today

- **Home `#work`**: client work from `src/data/work.ts` (Ultraviolette, E3 TRION, Cold Stone launching,
  Maven, Pee Empro, Suggaa, Pixelstack). It has no page per piece; case studies link out to
  riganb.github.io/work/<slug>/ because they are Rigan's own work from before the studio.
- **Home `#products`**: Origan, rigseed, Riggit and Mehfil from `src/data/products.ts`. Each links to its
  own subdomain.
- **`/examples/bookwell/`**: a concept in everything but name (our own invented brand, built to compare
  against a one-prompt build).
- **concepts.verastack.dev** (private repo `verastack-labs/concepts`, Cloudflare Pages): one folder per
  prospect, any stack. Today it holds farm-advisors (a live bid), ginkvora (site findings) and whispr (a
  launch teaser). Every page is noindex, carries a "Concept by VeraStack Labs for <client>" banner, is
  never linked publicly, and is retired after the pitch.
- **Planned**: a design work page (2026-10-23) mirroring the private design PDF.

## Goals

1. One section that holds everything we make: client work, our own products and concepts.
2. concepts.verastack.dev becomes the public home for concepts: its root lists every public sample
   (Rigan, 2026-10-27: "can't the concepts be put on concepts?"). The concepts that are samples
   (designs, builds, films) also appear in `/work/` as free case studies, clearly labelled as
   concepts. Reports never go public on either site.
3. Every piece has one address, so links in posts, PDFs and DMs never break.
4. Cuts by discipline (design, development, films, AI search), so the design work page becomes one view
   of the section rather than a separate page.
5. Page types are fixed, so every new piece of work slots in without new design work.

## Non-goals

- Moving concept code into this repo. Concepts keep any stack and stay deployed from the concepts repo,
  which also hosts the public gallery
  (**my call**: building a WordPress export or a Vite app inside the Next.js site would break both
  builds). verastack.dev hosts the page *about* a concept; the concept itself runs at
  concepts.verastack.dev/<slug>/.
- Rewriting Rigan's case studies. Pre-studio client work keeps linking to riganb.github.io.
- Search, tags beyond the four disciplines, or a CMS.

## Anti-goals (failure even if it works)

- A concept reads as a client project or a live site. Every concept card and page says "Concept" before
  anything else, and never "client".
- A report goes public. Findings, reviews and audits (Ginkvora) stay private pitch material on
  concepts.verastack.dev, noindex and unlisted, whatever the client says (Rigan, 2026-10-27: samples
  yes, not reports).
- A public concept gives away paid work (full audit, fix code, the real film).
- Design system images on any of these pages (palettes, tokens, component sheets).
- Farm Advisors (live bid), or Cold Stone before its site is live.

## Routes

**My call on the name: keep `/work`.** It already means "what we make" to visitors, the home section is
`#work`, and it reads naturally for a concept or a product. "Concepts" and "products" become kinds inside
it, not rival sections.

| Route | Page type | What it shows |
| --- | --- | --- |
| `/work/` | Index | Everything, newest first, with two filter rows: kind (all, client, product, concept) and discipline (design, development, films, AI search) |
| `/work/clients/`, `/work/products/` | Index, pre-filtered by kind | Same grid, own title and intro, indexable |
| concepts.verastack.dev/ | Concepts gallery (in the concepts repo) | Every public sample, each opening at concepts.verastack.dev/<slug>/. `/work/?kind=concept` filters the same samples on the main site, and its intro links to the gallery |
| `/work/design/`, `/work/development/`, `/work/films/`, `/work/ai-search/` | Index, pre-filtered by discipline | Same grid. `/work/design/` is the planned design work page |
| `/work/<slug>/` | Piece | One page per piece, with a section per discipline it involved |
| `/work/<slug>/<discipline>/` | Deep dive, optional | Only when a discipline has enough material to need its own page, for example `/work/rigseed/design/` |

Rigan's sketch had `/x/design/rigseed` and `/x/dev/rigseed`. **My call** is to put the piece first
(`/work/rigseed/design/`): each piece then has one home, the discipline pages are children of it, and
nothing has two addresses. The discipline indexes still give the "all our design" view.

Rules:
- Reserved slugs: `clients`, `products`, `concepts` (kept free for a later index), `design`, `development`, `films`, `ai-search`. A
  test fails if a piece uses one.
- Slugs are short names (`rigseed`, not `rigseed-torrent-app`), lowercase, never changed once published.
- Filter state on `/work/` lives in the URL (`?kind=concept`), but the pre-filtered routes above are what
  we share and what search engines index.
- Bookwell (amended 2026-10-28, my call): the running sample stays at `/examples/bookwell/`, the same
  way Whispr runs at concepts.verastack.dev/whispr/, and `/work/bookwell/` is its case study. Nothing
  moves, so no link breaks.
- Filters are links between the static routes above, not query strings (amended 2026-10-28, my call).
  The concept filter links to the concepts gallery.
- Deep dives (`/work/<slug>/<discipline>/`) wait until a piece has the material; the first build ships
  none (amended 2026-10-28).

## One data source

A single `src/data/pieces.ts` (**my call** on the name) replaces nothing at first. It reads `work.ts` and
`products.ts` and adds concepts, so the home sections keep working unchanged.

```ts
type Piece = {
  slug: string
  kind: 'client' | 'product' | 'concept'
  title: string            // "Ginkvora site findings", "rigseed"
  line: string             // one sentence for the card
  disciplines: ('design' | 'development' | 'films' | 'ai-search')[]
  date: string             // yyyy-mm, for ordering
  cover: string | null     // finished screen or film frame; never a design system image
  credit: string           // "Rigan Burnwal, as an employee" | "VeraStack Labs" | "Concept by VeraStack Labs"
  external?: { label: string; url: string }   // live site, case study, or the running concept
  sections?: Partial<Record<Piece['disciplines'][number], { idea: string; shots: string[] }>>
  deep?: Piece['disciplines'][number][]       // disciplines that get /work/<slug>/<discipline>/
  concept?: {
    for: string            // "a D2C coffee brand" or the client's name when public-named
    visibility: 'anonymised' | 'named' | 'own'
    consent?: string       // when and how the client OKed a named concept
  }
}
```

Tests (Vitest, alongside `content.test.ts`): every concept has `concept` set and its credit starts with
"Concept"; no reserved slugs; no duplicate slugs; Farm Advisors
and Cold Stone never appear while excluded; every `deep` discipline has a section.

## Concepts: from private pitch to public sample

Only samples go public: designs, builds, prototypes and film previews. Reports (findings, reviews,
audits, score write-ups) never do; they stay private pitch pages. Each public sample lives on
concepts.verastack.dev, listed in its gallery, and gets a free case study page at `/work/<slug>/` on the
main site that links to it.

Three kinds of public sample, set per concept in `concept.visibility`:

1. **Own** (`own`): made by us for an invented or our own brand, such as Bookwell. Public by default.
2. **Anonymised** (`anonymised`): a pitch concept with the client's name, logo, quotes and identifying
   facts removed, described by industry ("for a B2B sourcing marketplace"). Needs a cleaned copy in the
   concepts repo under a new slug, because the original quotes the client's own site line by line.
3. **Named** (`named`): the pitch concept as made, under the client's name. Amended 2026-10-28 by
   Rigan: no need to wait for the client's OK; the client gets a courtesy heads-up and we take the
   sample down the same day if they object. `consent` records the heads-up instead.

Ginkvora (findings) stays private. Whispr (a teaser film, names already illustrative) can go public as
anonymised or named. The private, noindex pitch copy keeps working at its old address for the client.

Changes to the concepts repo (done in that repo, in its own PR, when the first sample goes public):
- The root holding page becomes the gallery: a grid of public samples only (cover, title, "for
  <industry>" or the client, what it is, month and year), in the concepts site's own neutral style,
  with a link back to verastack.dev/work/. Private folders never appear in it.
- A list in the repo (for example `public.json`) names the public folders; `build.mjs` builds the
  gallery from it and a check fails the build if a listed folder still has the noindex tag or is a
  report.
- A public sample gets its own folder without the noindex meta tag, and `_headers` and `robots.txt`
  allow the gallery and that path only. Private folders keep both.
- Its banner changes from "Concept by VeraStack Labs for <client>" to "Concept by VeraStack Labs:
  <what>, <month year>", plus "for <industry>" or the client's name by visibility.
- Public concepts are kept, not retired after the pitch.
- `PRODUCT.md` and `social-docs/outreach/concepts-site.md` gain these rules; the "never linked
  publicly" rule becomes "private concepts are never linked publicly".

## Page types

**Index** (`/work/` and its filtered views): a grid of cards. Card: cover, kind tag ("Client",
"Product", "Concept"), title, one line, discipline chips. Concept cards carry the tag in the accent
colour so they can't be mistaken. Empty filters never show (a filter with no pieces is hidden).

**Piece** (`/work/<slug>/`):
1. Header: kind tag, title, one line, credit, date, external link ("See the concept", "Visit the site",
   "Read the case study").
2. One section per discipline: the idea in a sentence or two (named ideas and design parallels, as in
   the design PDF), then finished screens or frames. A "More on the design" link when it has a deep dive.
3. For concepts: a short "What this would take" box that says what the paid version adds, without
   prices, and one question as the call to action ("Want one for your launch?"), leading to the contact
   form with the service picked.
4. Next and previous piece within the same kind.

**Deep dive** (`/work/<slug>/<discipline>/`): more screens and the thinking, in the same voice. Never the
system behind it (no tokens, palettes or component sheets), never the paid deliverable.

Theming (Rigan, 2026-10-28: "Ensure the individual work / concept pages follow their own theming"):
index pages use the house style; every piece page wears that piece's own palette and display font
(products from `products.ts`, concepts from their brand, kept dark and soft-contrast so the site header
still reads). Concept titles carry "(concept)", for example "Whispr launch teaser (concept)".

All pages:
`CreativeWork` JSON-LD with `creator` VeraStack Labs (or Rigan as a person for pre-studio work),
a share image, reduced motion respected.

## How the home page links in

- `#work` keeps its headliners and gains "See all work" to `/work/`.
- `#products` cards gain a second link "How we made it" to `/work/<product>/` once that page exists.
- The nav path pill and full-screen menu get a "Work" entry pointing to `/work/`.
- The planned design work page is `/work/design/`, no separate route.

## Phases (one branch and PR each)

1. **Data and routes**: `pieces.ts`, tests, `/work/` index with kind and discipline filters, the
   filtered routes, the piece page type. Seed with existing client work (cards linking out to case
   studies) and the four products. No concepts yet.
2. **Bookwell moves**: `/work/bookwell/` as the first concept (`own`), old address redirects, every
   internal link and the Spot the slop embed updated.
3. **Design view**: `/work/design/` carries the design PDF material (rigseed, Origan demo with
   "illustrative data, not a real college", Mehfil "in development", E3 glassmorphic credit, Rigan's
   portfolio labelled his). Replaces the "Design work page" STATUS item.
4. **Concepts gallery and first public samples**: the concepts repo PR turns its root into the
   gallery and makes the chosen samples public (see below), then this repo adds their case studies.
5. **Home and nav links**, then a post through the Social chat.

Each phase updates STATUS and runs lint, typecheck, tests and a visual check before merging.

## Own concepts on a schedule

Rigan, 2026-10-28: we make our own concepts on a schedule. A fortnightly scheduled task builds one own
concept for an invented brand in an industry we want clients from, as a PR in the concepts repo with
its gallery entry and a case study entry here. Builds run on Opus 5.5 or Fable, never Sonnet.

## Waiting on Rigan

- Decided 2026-10-28: Whispr goes public now under its name, with a courtesy heads-up to Rohit (sent by
  the Social chat once the gallery is live). Ginkvora is a report, so it stays private. Farm Advisors
  stays private while the bid is live.
- The section name, if `/work` doesn't sit right.

## Left to the builder

Card and grid layout within the house style, filter interaction, image sizes, JSON-LD details, how deep
dives are laid out, and the order of pieces on the same date.
