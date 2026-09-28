# verastack-labs.github.io: design spec

Date: 2026-09-28
Status: approved 2026-09-28, amended as phases land

## 1. Why

VeraStack Labs has three products and a founder with shipped client work, but no studio site. The
products each have a landing page under the org (`/rigseed/`, `/riggit/`), and nothing ties them
together or sells the studio's services.

This site is the studio's front door. The personal portfolio (riganb.github.io) is the restrained,
editorial one; this is the cinematic one: a WebGL hero, huge type, scroll-driven scenes, premium
and eye-catching.

## 2. Goal and audience

**Goal: win client work first, show the products second.** A visitor should leave believing the
studio can design and build a configurator, a commerce flow or a launch site, and should find it
easy to start a conversation.

Audience, in order: prospective clients (brands launching products, businesses needing commerce or
internal tools), then people curious about the products.

**Voice.** The site speaks as "we", the studio. Client work was done by the founder personally
and is always credited that way ("our founder has worked with"), never as the studio's own
work. No invented people, headcounts or team roles; see 6.7.

**Out of scope:** the personal portfolio and the product landing pages. Nothing is shared at
runtime with riganb.github.io; components may be copied across, never imported.

## 3. Decisions

Answers to the kickoff brief's open questions ([../../brief.md](../../brief.md)), settled in the
2026-09-28 brainstorm.

| Question | Decision |
| --- | --- |
| Purpose | Both, services first, products as a strong second act |
| Services | Configurators (lead), commerce and web apps (with event and operations tools folded in), launch sites, desktop apps (listed, kept light) |
| Domain and repo | `verastack-labs/verastack-labs.github.io` at the org root now; custom domain later (a CNAME file and DNS) |
| Brand | Made here: the Signal direction (section 4) |
| Team | The studio speaks as "we"; founder shown as "founded by"; an empty `team` list renders a team row automatically once real people are added |
| Contact | Fill-in-the-blanks enquiry sentence, a Cal.com booking pop-up beside it, email as a fallback |
| Pages | One long page now; every scene reads from data files so Work and Products can become routes later |
| Spectacle budget | Full on desktop, lighter on phones, static for reduced motion and weak devices |
| Stack | The portfolio's stack (Next.js static export, GSAP, Lenis, Tailwind) plus React Three Fiber for the configurator demo |

Approved mockups for every scene are in [../../mockups/](../../mockups/) (HTML fragments from the
brainstorm companion; open them for motion and copy, not as production code).

## 4. Brand: Signal

Chosen over two alternatives (Monolith: black, bone, wide caps, liquid chrome; Noir: ink,
periwinkle nebula, serif). Signal is the only one that is distinctive at a glance. Two hybrids of
Monolith and Signal were tried and rejected as lacking energy.

### 4.1 Wordmark

`verastack/labs` in lowercase Bricolage Grotesque ExtraBold (800). The slash is `signal`, `labs`
is weight 500 at 55% opacity. The slash is the site's motif, borrowed from file paths: section
labels read `/services`, `/work`, `/products`, `/process`, `/about`, `/contact`, and a separator
`//` appears in labels (`/services // 01/04`). Favicon: a signal slash on ink.

### 4.2 Tokens

| Token | Value | Use |
| --- | --- | --- |
| `ink` | #0B0C0A | page background |
| `surface` | #1B1D18 | cards, form surfaces |
| `line` | #2A2D25 | hairlines, borders |
| `text` | #F2F3EE | primary text |
| `muted` | #A3A69B | secondary text |
| `dim` | #3B3E35 | inactive states (unlit index rows, unlit steps) |
| `signal` | #D4FF3F | the accent |
| `alert` | #FF6B4A | form validation only |

**The signal rule:** at most about 5% of any screen. Used for the slash, the primary call to action,
live states, WebGL crests, active indices and focus rings. Never body text. It is kept out of the
product cards entirely (Riggit's green sits close to it).

Dark only. No light theme.

A contrast test (as on the portfolio) asserts `text`, `muted` and `signal` on `ink` and `surface`
meet WCAG AA for their sizes, and that `ink` on `signal` passes for button labels.

### 4.3 Type

- **Bricolage Grotesque** (variable: optical size 12-96, weight 200-800) for display and body.
  Headlines at weight 800, optical size 96, tracking about -0.05em.
- **JetBrains Mono** (400, 500) for labels, metadata, counters, form legends and small print.
- Both self-hosted through `next/font`; no requests to Google at runtime.

### 4.4 Voice

Short and direct. Lowercase mono labels (`// taking projects for Q4 2026`). No agency filler
("we craft digital experiences"). Every claim about client work is attributable to the founder.

## 5. Interaction system

### 5.1 Motion modes

One hook, `useMotionPreference()`, returns `full`, `lite` or `static`, and every scene reads it:

- `full`: desktop-class pointer and viewport (fine pointer, width 1024 and up) with no reduced
  motion preference.
- `lite`: phones and tablets, or a device that fails a quick capability check (low
  `hardwareConcurrency`, `deviceMemory` under 4 where available, or WebGL unavailable).
- `static`: `prefers-reduced-motion: reduce`. All content visible, no pinning, no scroll-linked
  animation, no WebGL loops. Scenes render their final state, and inactive states use `muted`
  rather than `dim` so all text meets AA contrast.

### 5.2 Rules

- One Lenis instance drives ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)`, GSAP ticker
  drives Lenis). Each scene builds its timelines inside `gsap.context()` and reverts on unmount.
- **Pinning is desktop only** (`full`). In `lite` every pinned scene becomes normal flow; section
  6 gives each scene's phone layout.
- The **dot matrix is special to the hero.** It is not reused as texture anywhere else.
- Only one WebGL context runs at a time: the hero shader pauses when off screen; the configurator
  canvas mounts only when its beat is near.
- Scroll-linked positions (for example the process rail) are **measured from layout**, never
  assumed from fractions, and re-measured on resize.
- Every animated text element keeps its real text in the DOM (screen readers and search read it).

### 5.3 Scene rhythm

Hero (WebGL) → Services (pinned, long) → Work (pinned) → Products (pinned) → Process (pinned,
short) → About (unpinned) → Contact (unpinned). Four pinned scenes run back to back, so each
pinned hold is sized to its content, and About deliberately gives the page a breather.

## 6. The page

### 00. Nav: the path pill

Prototype: [../../mockups/nav.html](../../mockups/nav.html).

A fixed header with three parts: the wordmark (left), the **path pill** (right of centre) and a
signal "Start a project" button (right, visible at every width). It never hides. A soft fade (ink at
90% to transparent, cream on Mehfil's scene) sits behind it so the wordmark never lies directly on
a headline scrolling beneath.

- **At rest** the pill reads like a file path for the section in view: `/work · 02/06 · ▾`. When
  the section changes, the path decodes to the new name letter by letter (scramble text) and the
  counter updates. Sections: `/` (hero, 00), `/services` 01, `/work` 02, `/products` 03,
  `/process` 04, `/about` 05, `/contact` 06.
- **Hover or keyboard focus (fine pointers):** the pill widens (measured widths, 0.5 s) into a
  dock row of every section, numbered in mono; labels arrive in a short stagger and a signal pill
  highlight sits on the current section, sliding when it changes. It folds back to the path 260 ms
  after the pointer leaves, so passing over it does not flicker. Escape closes it; Tab and Enter
  move through and follow the links.
- **Touch, or any screen under 900 px wide** (the row does not fit beside the wordmark and button
  there): tapping or clicking the pill keeps it a path (its ▾ flips) and drops a **vertical panel** under the
  header, full width with 14 px gutters, listing `00 home` to `06 contact` by number and name in
  large type. The current section is filled signal; rows arrive in a stagger. A "book a 20-min call
  ↗" line sits at the bottom. Picking a section scrolls there and closes the panel; tapping outside
  closes it too.
- **Palettes:** over Mehfil's cream hand-over the pill, highlight, panel and button switch to ink
  (vermilion for the path text). The current section is decided by a probe 60 px below the top.
- `static`: no decode (the path swaps instantly), no stagger, no width animation.
- Accessibility: the pill is a `nav` with `aria-label="Sections"` and `aria-expanded`; the links are
  real anchors to section ids.

### 01. Hero

- **Headline** (placeholder copy): "Configurators, commerce and the sites that *launch* them." in
  Bricolage 800, with "launch" in signal. A status line in mono (`● taking projects for Q4 2026`)
  reads from `site.ts` (`availability`) and hides when unset.
- **Calls to action:** "Start a project" (to Contact) and "See the work" (to Work).
- **The dot matrix:** a raw WebGL fragment shader (no three.js) drawing a grid of dots whose size
  and brightness follow a travelling wave modulated by fbm noise (layered noise). The cursor
  ripples the field; wave crests and the ripple take `signal`, the rest is a dim bone-grey. The
  field is biased to the right so the headline stays readable. Prototype:
  [../../mockups/brand-direction.html](../../mockups/brand-direction.html), option B.
- `full`: device pixel ratio capped at 1.5, cell size about `viewport height / 46`.
- `lite`: larger cells, 30 fps cap, pixel ratio 1, no cursor ripple (a slow autonomous ripple
  instead), paused off screen.
- `static` and no-WebGL: a static CSS dot pattern (radial-gradient) with one crest baked in.
- The headline paints before the shader loads; the shader fades in after first paint.

### 02. Services: pinned index with the configurator demo inside

Prototype: [../../mockups/scene-services-v2.html](../../mockups/scene-services-v2.html).

Four services, in this order: **Configurators**, **Commerce & web apps**, **Launch sites**,
**Desktop apps** (smallest). The section is about five viewports of scroll pinned to one stage.
Beats, as fractions of the pinned progress:

| Progress | Beat |
| --- | --- |
| 0 - 0.08 | Index appears, Configurators lit |
| 0.08 - 0.18 | Index shrinks to a left column; the demo slides in on the right |
| 0.18 - 0.45 | **Hold.** Nothing moves; the demo is interactive. ScrollTrigger snap settles into this range |
| 0.45 - 0.55 | Demo folds away, index grows back |
| 0.55 - 0.70 | Commerce & web apps |
| 0.70 - 0.85 | Launch sites |
| 0.85 - 1 | Desktop apps |

- Active row: `text` and nudged right, index number in signal; others `dim`.
- Beside the index: the description and proof lines (`see: Ultraviolette X-47`) that decode
  letter by letter (scramble text) when the service changes.
- The left column is `minmax(max-content, …)` so the shrunk list never runs under the demo.
- A small line in the hold reads "keep scrolling for 02 commerce ↓".

**Configurator demo (`ConfiguratorDemo`).** A mechanical keyboard (a CC0 3D model; not a client's
product and not a vehicle). Options: case colour (3), keycap set (2), switch type (2), so 12
combinations. Price counts up on change (count-up, eased 700 ms) and uses the visitor's currency
(section 6.7). A "Pre-book" button scrolls to Contact and pre-selects "a configurator".

- Built with React Three Fiber and drei, lazy-loaded (`next/dynamic`, no SSR) when the Services
  section comes within one viewport.
- Model budget: under 1.5 MB after compression (meshopt or Draco). Environment lighting from a
  small HDR or drei's presets; no post-processing.
- `lite` and `static`: 12 pre-rendered images (one per combination) swapped instead of a live
  canvas. The same images are the no-WebGL fallback.
- If no suitable CC0 keyboard model exists, headphones are the fallback product.

**Phones (`lite`):** no pin. Services stack as blocks; the configurator is an inline card with the
image-swap demo.

### 03. Work: cinema reel

Prototype: [../../mockups/scene-work.html](../../mockups/scene-work.html), option A.

- Opens with the label `/work // our founder has worked with` and a headline built from data:
  "Two launches. Both still live." (the count comes from the headliners in the data, so adding a
  third headliner makes it "Three").
- **Headliners** (Ultraviolette X-47 configurator, E3 Electric.AI TRION launch) each get a pinned
  moment: a framed card grows to full bleed as you scroll, with the name in huge type and a mono
  credit block (`2025 · as an employee`, `2026 · freelance`, stack, `visit live ↗ · case study ↗`).
  Media is a muted, looping screen recording with a poster frame.
- **Supporting work** (Maven Consultancy, Pee Empro Exports, Suggaa Ventures, PixelStack Studio)
  follows as a list. Hovering a row slides up a signal band with a scrolling marquee of the row's
  text (flowing menu).
- **Cold Stone Creamery Arabia** (website and CMS, 2026, freelance) is built but not live. Until
  launch it appears as a supporting row marked `launching soon`, text only: no screenshots, video
  or live link (7.2).
- Case study links go to the portfolio's case study pages.
- Phones: no pin; headliners are full-width cards with the video autoplaying muted only while
  visible; the list has no marquee (tap goes to the case study).

### 04. Products: hand-over

Prototype: [../../mockups/scene-products.html](../../mockups/scene-products.html), option A
(desktop) and option C (phones).

- Label `/products // and we build our own`, intro headline "Three products. Three brands. One
  studio."
- Pinned; as you scroll, the whole stage hands over to each product's palette in turn (background
  and text colour tweened on CSS variables), each with a live mockup:
  - **rigseed** (slate #0E1318, accent #8FB0CB): "Torrents, finally worth looking at." A desktop
    client for qBittorrent that brings its own daemon. `v0.1.3 · Windows, macOS and Linux`. Mockup:
    a download list with ticking progress bars.
  - **Riggit** (green-black #08120E, accent #34D399): "Own your GitHub timeline." Commit at any
    date and time. `three commits free · from $2.49 a month`. Mockup: a contribution graph filling
    its gaps.
  - **Mehfil** (cream #F4EBDA, ink #1A1410, vermilion #B93E29, saffron #E7A33A, neobrutal borders
    and hard shadows): a lightweight way to rally people for chai, dinner or cards. Coming soon.
    Mockup: a phone with event cards. Its pitch line is placeholder.
- Copy for rigseed and Riggit comes from their landing pages; links go to those pages.
- **Phones:** the hand-over becomes a **card swap**: the three mockups in a tilted 3D stack that
  cycles every 3.2 s, with the product names as tabs (tap to bring one forward).

### 05. How we work: pinned rail with split-flap indices

Prototype: [../../mockups/scene-process-v2.html](../../mockups/scene-process-v2.html).

- Label `/process // how we work`, headline "Four steps. No surprises." Steps (copy is
  placeholder): Discover, Design, Build, Launch, each with one line.
- A short pin, about 1.5 viewports. A signal rail draws under the four steps over the middle 80%
  of the hold (still at both ends).
- Each step's index is a two-digit split-flap (departure board) display resting at `00`. **A step
  switches on the moment the rail's tip reaches its flap's left edge** (measured, 5.2). On switch
  on, the digits spin to `01`-`04` in signal and the title and text light up; scrolling back spins
  them back to `00`.
- Phones: no pin; a two-column grid where each flap spins once as it enters the viewport.

### 06. About

Prototype: [../../mockups/scene-about-v5.html](../../mockups/scene-about-v5.html).

- Unpinned. Label `/about // the studio`. Headline "Design and engineering. *One studio.*" (800,
  second sentence in signal).
- Statement: "VeraStack Labs is a design and engineering studio. **We build configurators,
  commerce and launch sites for clients, and our own products alongside them.** Design and build
  happen in the same hands, so nothing gets lost between a mockup and a handover."
- **Capabilities row:** Scope, Design, Engineering, Commerce, Launch, each with a one-line mono
  descriptor and a small status light. When the row enters the viewport it **boots up**: the lights
  flicker on one by one (no lines during the boot). Once the boot ends, a single light walks
  across the five every 1.6 s and a signal underline draws under the lit capability; the first
  walking step follows the boot immediately. `static`: all five shown on, no walking.
- Footer line: `founded by Rigan Burnwal · based in India · products rigseed · Riggit · Mehfil`
  with `riganb.github.io ↗`.
- **Team row:** rendered above the footer line only when `data/team.ts` has entries. Empty today.
- Removed on purpose: any line implying staff or specialists ("we bring in specialists"), a founder
  photo, and "the person you talk to builds it".

### 07. Contact

Prototypes: [../../mockups/scene-contact-v2.html](../../mockups/scene-contact-v2.html) and
[../../mockups/contact-cta-words.html](../../mockups/contact-cta-words.html) (option 1).

- Label `/contact // start a project`. Headline "Let's build something." set at weight 300; with a
  fine pointer, letters swell towards 800 near the cursor and the nearest take signal (variable
  proximity). Static on touch and in `static` mode.
- **The enquiry is one sentence with blanks:**
  "Hi, I'm [your name] from [company (optional)]. We need [a configurator ▾] with a budget of
  [₹2-5L ▾], ideally live by [within 3 months ▾]. Reach me at [you@company.com]."
  - A legend above it: "fill in the sentence: *underlined* type here · *green* tap to change", and a
    live counter "`n` of 3 filled".
  - Blanks are real `<input>`s (with visually hidden labels and `autocomplete`), tinted, dashed
    underline, auto-sized to their content, signal glow on focus, solid once valid.
  - Choices are native `<select>`s styled as signal words with a chevron, auto-sized to the chosen
    option. Services: a configurator, a commerce flow, a web app, a launch site, a desktop app,
    something else. Timeline: as soon as possible, within 3 months, within 6 months, no fixed date.
  - "+ add a note" expands a textarea for links and context.
  - Send stays visually muted until name and a valid email are present. Pressing it early pulses
    the missing blanks in `alert`, focuses the first, and says what is wrong ("a couple of blanks
    are still empty", "that email doesn't look right"). Fixing a blank clears its alert at once.
  - Sent: the sentence stays on screen, read-only, under "Sent. We'll reply within two working
    days." (reply promise is placeholder). No "copy in your inbox" line until the auto-reply
    exists (7.4).
  - Arriving from the configurator's Pre-book button pre-selects "a configurator".
- **Budgets by currency:** rupee bands (under ₹2L, ₹2-5L, ₹5-10L, ₹10L+, not sure yet) for
  visitors whose time zone is `Asia/Kolkata` or whose language ends in `-IN`; dollar bands for
  everyone else (placeholders: under $3k, $3-7k, $7-15k, $15k+, not sure yet). A small `₹ / $`
  toggle overrides the guess. No tracking or IP lookup. The configurator demo's price uses the
  same currency.
- **Book a call:** a card "Book a 20-min call · no prep needed". Hover and keyboard focus: a signal
  line traces the card's border (SVG stroke, 0.8 s), then the words **bring · your · idea** pop in
  one by one as chips (0.28 s, then every 0.11 s), the last in signal. Opens the Cal.com pop-up,
  restyled to the site's tokens.
- Email fallback in mono under the card.
- **Failures:** if the form service is unreachable or returns an error, the sentence stays
  editable and a message offers a `mailto:` link with the sentence pre-filled as the body.
- **Spam:** a hidden honeypot field plus the form service's own filtering.

### 08. Footer: the giant wordmark, cut off by the page

Prototype: [../../mockups/footer.html](../../mockups/footer.html).

- **Four columns** (two on phones): *start a project* (the email as a large Bricolage 800 link,
  then "or book a 20-min call ↗"), *products* (rigseed ↗, Riggit ↗, Mehfil `soon`), *elsewhere*
  (GitHub ↗, founder's portfolio ↗), *studio* (a live clock for India with a pulsing signal dot,
  and "based in India").
- A mono row: `© 2026 VeraStack Labs` and a "back to top ↑" button.
- **The giant wordmark:** `verastack/labs` set edge to edge of the content width (font size
  measured and fitted on load and resize), slash in signal, `labs` at 28% opacity. **The bottom 40%
  of the letters is cut off by the bottom edge of the page**, as if the wordmark sinks below it (a
  clipping box `font size × (0.74 × 0.6 + 0.06)` tall, `clipHeight()` in `src/lib/fit.ts`). As the
  footer arrives, the letters rise into place
  one after another (0.9 s each, 45 ms apart). `static`: letters shown in place.
- The clock uses `Intl.DateTimeFormat` with `Asia/Kolkata`, updated every 15 s.

## 7. Content model

### 7.1 Data files (`src/data/`)

| File | Contents |
| --- | --- |
| `site.ts` | name, email, Cal.com link, form endpoint, `availability` line, social links |
| `services.ts` | id, name, blurb, proof lines, order, `lead` flag |
| `work.ts` | client, project, year, role (`employee` / `freelance`), stack, summary, live URL, case study URL, media, `tier` (`headliner` / `supporting`), `status` (`live` / `launching`) |
| `products.ts` | name, pitch, one-liner, platform, meta line, URL, palette, status (`live` / `coming-soon`) |
| `process.ts` | step name and line |
| `capabilities.ts` | name and descriptor (About row) |
| `team.ts` | empty array; `{ name, role, portrait, link }` when used |
| `budgets.ts` | rupee and dollar bands |
| `configurator.ts` | demo options, price deltas, image paths |

### 7.2 Cold Stone Creamery Arabia (built, not live)

Built and delivered, both the website and the CMS, but not launched. It can be named and described
now; **no visuals until it is live** (screenshots, recordings or before-and-after shots), and no
live link. In `work.ts` it has `status: 'launching'`, which renders a text-only supporting row
tagged `launching soon`.

Source material is the `cold-stone-showcase` folder in the founder's Documents (case study,
metrics, comparison shots, intro video and poster). Summary for the entry: a regional franchise
site rebuilt from WordPress 6.4 into a Next.js 16 application with its own CMS; three validated
enquiry pipelines writing to MariaDB through Prisma; resume uploads checked against their actual
leading bytes; a store directory of 76 outlets across six countries.

**When it goes live:** set `status: 'live'`, add media and the live link, and decide whether it
becomes a headliner (which changes the Work headline to "Three launches").

**Metrics must be quoted honestly.** The case study's table omits page weight: the new home page
transfers about 87 MB against about 10 MB before (the intro video), and third-party hosts on the
contact page went from 21 to 10, not 2. Either quote page weight alongside the favourable numbers
or quote no metrics. The same rule applies to any client metrics.

### 7.3 Content guards (tests)

- No em dashes anywhere in `src/data` or rendered copy.
- A `launching` entry has no media and no live link.
- Every `work.ts` entry has a role (so every credit is attributable).
- Both budget sets exist and have the same number of bands.

### 7.4 Form backend, now and later

- **Now:** a hosted form service (Formspree or Web3Forms; choose after checking current free-tier
  terms at implementation). The form posts with `fetch`; the endpoint lives in `site.ts`.
- **Later, with the custom domain:** a Cloudflare Worker receiving the form, Cloudflare Turnstile
  for bot checks, and an email API (such as Resend) sending the enquiry to the studio and a copy
  to the visitor. The front end only changes its endpoint; the "copy in your inbox" line returns.

## 8. Stack and deployment

- Repo `verastack-labs/verastack-labs.github.io`, in the workspace next to `riganb.github.io/`.
- Next.js (App Router) with `output: "export"`, TypeScript, Tailwind 4, GSAP and ScrollTrigger,
  Lenis, React Three Fiber and drei (Services chunk only), Motion only where layout animation
  needs it. Vitest for tests.
- Folders: `src/scenes/<Scene>/` (one per section), `src/components/` for shared pieces
  (`SplitFlap`, `ScrambleText`, `VariableProximity`, `BorderTrace`, `Pin`, `CountUp`,
  `CardSwap`), `src/data/`, `src/lib/motion/` (`useMotionPreference`, Lenis and ScrollTrigger
  setup), `src/lib/currency.ts`, `src/lib/enquiry.ts` (validation and submission).
- Effects from React Bits, 21st.dev, Canvas UI and Motion Primitives are copied in and restyled to
  the tokens, not installed as packages. Each licence is checked at copy time and recorded in
  `THIRD_PARTY.md` (Canvas UI is MIT with the Commons Clause).
- GitHub Actions builds and deploys to Pages on every push to `main`, as on the portfolio.
- Custom domain later: add `public/CNAME` and the DNS records; product pages move under it too.

## 9. Quality bar

- **Performance** (Lighthouse mobile, on the deployed site): LCP under 2.5 s, CLS under 0.05.
  The hero headline is the LCP element and paints before any WebGL. Three.js and R3F load only in
  the Services chunk. Screen recordings are compressed (H.264 MP4 plus WebM), lazy-loaded, with
  poster frames.
- **Accessibility:** WCAG AA contrast (tested); full keyboard access including the demo options,
  booking card and form; visible focus rings in signal; `static` mode for reduced motion; real
  text behind every animated heading; the form usable with a screen reader (labels on every
  blank, errors announced with `aria-live`).
- **SEO:** metadata and a share image per page, sitemap, robots, `Organization` JSON-LD.
- **Phones:** every scene has a `lite` layout (section 6); tested at 375 px wide.

## 10. Testing

- **Unit (Vitest):** currency detection; enquiry validation (required blanks, email pattern);
  the process rail's switch-on rule (a step turns on when the tip's x reaches its flap's left
  edge); the Work headline count; the Services beat mapping (progress to active service and demo
  openness).
- **Content guards:** section 7.3. **Contrast:** section 4.2.
- **Build:** `next build` must succeed with the static export.
- **In the browser, per phase:** run the site, exercise the scene at desktop and 375 px, with and
  without reduced motion, and attach screenshots to the PR.

## 11. Phases

One branch and one PR per phase, merged when done.

| Phase | Scope |
| --- | --- |
| 0 | This spec, the status doc, the brief and the mockups |
| 1 | Foundation: scaffold, tokens and contrast test, fonts, motion system (`useMotionPreference`, Lenis, ScrollTrigger), nav, footer, content guards, deploy workflow |
| 2 | Hero: dot-matrix shader with `lite` and `static` fallbacks, calls to action, status line |
| 3 | Services: pinned index, scramble proof lines, configurator demo (model sourcing, R3F, image fallbacks) |
| 4 | Work (cinema reel, flowing list) and Products (hand-over, card swap on phones) |
| 5 | Process (rail and split-flap) and About (capability boot-up, team slot) |
| 6 | Contact: sentence form, currency bands, form service, Cal.com pop-up, border-trace card |
| 7 | Launch pass: SEO, performance, accessibility audit, phone pass, go live |

## 12. Open items

Tracked in [../../STATUS.md](../../STATUS.md), the single source of truth for what is pending and
planned.
