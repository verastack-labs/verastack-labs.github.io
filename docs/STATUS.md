# VeraStack Labs site status

The single place to catch up on verastack-labs.github.io. Update it in the same PR as any change
that finishes, adds or drops an item. Last updated 2026-09-28.

- Design spec: [superpowers/specs/2026-09-28-verastack-labs-site-design.md](superpowers/specs/2026-09-28-verastack-labs-site-design.md)
- Phase plans: [superpowers/plans/](superpowers/plans/)
- Kickoff brief: [brief.md](brief.md)
- Approved mockups: [mockups/](mockups/)
- Live: https://verastack-labs.github.io (deploys on every push to `main`)

## Where things stand

Foundation, hero and Services built: tokens, fonts, motion system, nav, footer, the hero over the dot-matrix field, the pinned Services scene with the live keyboard configurator, the Work reel and list, the Products hand-over (card swap on phones), the Process rail with split-flap indices, About with the capabilities boot-up, a placeholder for Contact, CI. Live at https://verastack-labs.github.io since 2026-09-28; every push to `main` deploys.

| Phase | Status | PR |
| --- | --- | --- |
| 0. Spec, status, brief, mockups | done | #1 |
| 1. Foundation | done | #2 |
| 2. Hero | done | #3 |
| 3. Services and configurator demo | done | #5 |
| 4. Work and Products | done | #6 |
| 5. Process and About | done | #7 |
| 6. Contact | next | |
| 7. Launch pass | planned | |

## Names used in this project

- **Signal**: the brand direction. Also the accent token (#D4FF3F).
- **Dot matrix**: the hero's WebGL field of dots. Special to the hero, never reused as texture.
- **VS-65**: the demo keyboard in the Services configurator.
- **Hold**: a stretch of pinned scroll where nothing moves, so the visitor can interact (the
  configurator demo) or read.
- **Hand-over**: the Products scene, where the stage takes on each product's palette in turn.
- **Card swap**: the phone version of the Products scene.
- **Reel**: the Work scene on desktop, where each headliner grows from a framed card to full bleed.
- **Flowing list**: the supporting work under the reel; hovering a row slides up a signal marquee.
- **Split-flap**: the departure-board digits used for the process indices.
- **Boot-up**: the About capabilities flickering on one by one, followed by the walking light.
- **Border trace**: the book-a-call hover, a signal line drawing round the card, then
  "bring · your · idea".
- **Motion modes**: `full`, `lite` and `static` from `useMotionPreference()`.
- **Path pill**: the nav (`src/components/nav/path-pill.tsx`). Opens into the **dock row** on hover
  at 900 px and wider, and the **section panel** on touch or narrower screens.
- **Panel mode**: `(hover: none), (max-width: 899px)`.

## Waiting on Rigan

Content (placeholders are in the design until these arrive):

- [ ] Hero headline (placeholder copy in `src/data/hero.ts`) and the `availability` line in
  `src/data/site.ts` (null, so hidden; the mockup used "taking projects for Q4 2026").
- [ ] Contact email address for the site (the footer shows a "Start a project" link instead until it is set in `src/data/site.ts`).
- [ ] Reply-time promise ("within two working days" is placeholder).
- [ ] Configurator demo prices (VS-65 keyboard, `src/data/configurator.ts`): illustrative
  placeholders, labelled "demo price" on the page. Fine to keep unless you want other numbers.
- [ ] Dollar budget bands (placeholders: under $3k, $3-7k, $7-15k, $15k+). Rupee bands too, if
  the placeholders (under ₹2L, ₹2-5L, ₹5-10L, ₹10L+) are wrong.
- [ ] How we work: the real steps and one line each (Discover, Design, Build, Launch are
  placeholder, in `src/data/process.ts`), and whether "a fixed quote" and "weekly previews" are promises we keep.
- [ ] Mehfil's one-line pitch ("Chai in ten? Rally the group." is placeholder) and whether it has
  a public page to link to yet.
- [ ] Screen recordings of the Ultraviolette X-47 configurator and the E3 TRION site (with poster
  frames). Until then the Work reel shows stand-in artwork (`art` in `src/data/work.ts`); add
  `media: { poster, mp4, webm }` to swap in the recording.
- [ ] Years for the supporting work (Maven, Pee Empro, Suggaa, PixelStack), if you want them shown.
- [ ] Cal.com account and the 20-minute event link (`site.calLink`; booking links stay hidden until set).
- [ ] Cold Stone Creamery Arabia launch. It is built (website and CMS) and listed as a text-only
  `launching soon` row; no visuals until it is live. When it launches, follow spec 7.2: set
  `status: 'live'`, add media and the live link, decide headliner or supporting, and quote
  metrics honestly or not at all.

## Planned, not started

- [ ] Phases 6 and 7 (spec section 11).
- [ ] Contact form (phase 6) reads the configurator's pre-book choice with `takeEnquiryPrefill()`
  and drives the `₹ / $` toggle through `setCurrency()` (`src/lib/use-currency.ts`).
- [ ] Custom domain: `public/CNAME` plus DNS. Product pages move under it too.
- [ ] Form backend move (spec 7.4): Cloudflare Worker, Turnstile, an email API (Resend or
  similar), auto-reply copy to the visitor. Needs the custom domain. Brings back the "a copy is on
  its way to your inbox" line.
- [ ] Work and Products as full pages (`/work/...`, `/products/...`), reading the same data files.
- [ ] Team row in About: built and hidden; it appears once `src/data/team.ts` has real people.

## Known trade-offs

- Four pinned scenes run back to back (Services, Work, Products, Process). Each hold is sized to
  its content and About is unpinned to give the page a breather.
- `dim` (#3B3E35) text for inactive index rows and unlit steps is below AA contrast by design
  while its neighbour is active. In `static` mode inactive states use `muted` instead.
- The configurator demo uses a stand-in product (a keyboard), not client work, so it cannot
  misrepresent whose work it is. It is built in code rather than from a model file, so it is
  simple rounded boxes, not photoreal.
- three.js is about 245 KB gzipped, loaded only when Services comes near (never on first paint).
- No auto-reply to enquiries until the form backend moves.
- The site went live early (after phase 2) with placeholder sections for services onwards.
- Pinned scenes set up their pins in `useLayoutEffect` so GSAP unwraps its pin spacer before React
  removes the node (otherwise resizing from desktop to phone width throws).
- Scene placeholders (`src/components/scene-placeholder.tsx`) stand in for each section until its
  phase lands; each carries the id the nav tracks.

## Working rules

See `../CLAUDE.md` in the workspace. In short: one branch per phase, PR and merge when done, no AI
attribution, no em dashes, never rewrite `main`, and keep this file current in the same PR as the
change it describes.
