# VeraStack Labs site status

The single place to catch up on verastack-labs.github.io. Update it in the same PR as any change
that finishes, adds or drops an item. Last updated 2026-09-28.

- Design spec: [superpowers/specs/2026-09-28-verastack-labs-site-design.md](superpowers/specs/2026-09-28-verastack-labs-site-design.md)
- Phase plans: [superpowers/plans/](superpowers/plans/)
- Kickoff brief: [brief.md](brief.md)
- Approved mockups: [mockups/](mockups/)
- Live (once phase 1 deploys): https://verastack-labs.github.io

## Where things stand

Foundation built: tokens, fonts, motion system, nav, footer, placeholder scenes, CI. Deploy is gated until launch, so nothing is public yet.

| Phase | Status | PR |
| --- | --- | --- |
| 0. Spec, status, brief, mockups | done | #1 |
| 1. Foundation | done | #2 |
| 2. Hero | next | |
| 3. Services and configurator demo | planned | |
| 4. Work and Products | planned | |
| 5. Process and About | planned | |
| 6. Contact | planned | |
| 7. Launch pass | planned | |

## Names used in this project

- **Signal**: the brand direction. Also the accent token (#D4FF3F).
- **Dot matrix**: the hero's WebGL field of dots. Special to the hero, never reused as texture.
- **Hold**: a stretch of pinned scroll where nothing moves, so the visitor can interact (the
  configurator demo) or read.
- **Hand-over**: the Products scene, where the stage takes on each product's palette in turn.
- **Card swap**: the phone version of the Products scene.
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

- [ ] Hero headline and the `availability` line ("taking projects for Q4 2026" is placeholder).
- [ ] Contact email address for the site (the footer shows a "Start a project" link instead until it is set in `src/data/site.ts`).
- [ ] Reply-time promise ("within two working days" is placeholder).
- [ ] Dollar budget bands (placeholders: under $3k, $3-7k, $7-15k, $15k+). Rupee bands too, if
  the placeholders (under ₹2L, ₹2-5L, ₹5-10L, ₹10L+) are wrong.
- [ ] How we work: the real steps and one line each (Discover, Design, Build, Launch are
  placeholder), and whether "a fixed quote" and "weekly previews" are promises we keep.
- [ ] Mehfil's one-line pitch ("Chai in ten? Rally the group." is placeholder) and whether it has
  a public page to link to yet.
- [ ] Screen recordings of the Ultraviolette X-47 configurator and the E3 TRION site (with poster
  frames).
- [ ] Cal.com account and the 20-minute event link (`site.calLink`; booking links stay hidden until set).
- [ ] Cold Stone Creamery Arabia launch. It is built (website and CMS) and listed as a text-only
  `launching soon` row; no visuals until it is live. When it launches, follow spec 7.2: set
  `status: 'live'`, add media and the live link, decide headliner or supporting, and quote
  metrics honestly or not at all.

## Planned, not started

- [ ] Phases 2 to 7 (spec section 11).
- [ ] Launch: set the `DEPLOY_ENABLED` repo variable to `true` and enable Pages with GitHub Actions as the source (phase 7).
- [ ] Configurator demo model: find a CC0 mechanical keyboard model (Poly Haven, Poly Pizza,
  Kenney); headphones if none is good enough. Pre-render the 12 fallback images.
- [ ] Custom domain: `public/CNAME` plus DNS. Product pages move under it too.
- [ ] Form backend move (spec 7.4): Cloudflare Worker, Turnstile, an email API (Resend or
  similar), auto-reply copy to the visitor. Needs the custom domain. Brings back the "a copy is on
  its way to your inbox" line.
- [ ] Work and Products as full pages (`/work/...`, `/products/...`), reading the same data files.
- [ ] Team row in About, once `src/data/team.ts` has real people.

## Known trade-offs

- Four pinned scenes run back to back (Services, Work, Products, Process). Each hold is sized to
  its content and About is unpinned to give the page a breather.
- `dim` (#3B3E35) text for inactive index rows and unlit steps is below AA contrast by design
  while its neighbour is active. In `static` mode inactive states use `muted` instead.
- The configurator demo uses a stand-in product (a keyboard), not client work, so it cannot
  misrepresent whose work it is.
- No auto-reply to enquiries until the form backend moves.
- Scene placeholders (`src/components/scene-placeholder.tsx`) stand in for each section until its
  phase lands; each carries the id the nav tracks.

## Working rules

See `../CLAUDE.md` in the workspace. In short: one branch per phase, PR and merge when done, no AI
attribution, no em dashes, never rewrite `main`, and keep this file current in the same PR as the
change it describes.
