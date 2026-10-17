# Founder page design

Agreed with Rigan on 2026-10-17. Mockup: the brainstorm screen `founder-layout-v3.html`
(workspace `.superpowers/brainstorm/284-1792219889/content/`).

## Intent

A page at `verastack.dev/founder` for founders and clients deciding whether to trust VeraStack
Labs with their launch. It answers "who will I actually be working with, have they done this
before, and will they care?" before the visitor books a call. It is a trust page: not a
biography, not a resume.

What Rigan wants a founder to know (his words, condensed): he ships launches end to end, design to
code; the modern layer (AI search, product videos) comes at every turn; design and development are
the primary factors; he is present on every call and meeting.

## Goals

- A visitor ends the page knowing the founder by name and face, the launches behind him, and that
  he is on every call, and is one click from booking.
- The page reads as the studio's: same design language, same nav, the studio named throughout.
- Search and answer engines connect Rigan Burnwal to VeraStack Labs as its founder.

## Non-goals

- No resume link anywhere on the page (or the site).
- No full career history; the personal portfolio covers that and is linked.

## Anti-goals

- E3 TRION, Cold Stone and the Ultraviolette work presented as studio work. They are the founder's
  own work: Ultraviolette as an employee, E3 TRION and Cold Stone as independent client work. Label
  them so wherever they appear.
- Numbers that disagree with the Work section, or any figure that is not public.
- A page that pushes visitors off to the portfolio before the call.

## The page, top to bottom (as agreed on the mockup)

1. **Label:** `/founder // a note before you book`, in the site's mono label style.
2. **Letter, left; photo, right** (photo stacks above or below on phones, modest size so the letter
   is not pushed below the fold).
   - Headline: "Hi, I'm Rigan." with **Rigan** in the signal colour (`--signal`, the neon green),
     the same treatment as the highlighted words in other headlines.
   - Byline directly under the headline: "**Rigan Burnwal** · founder, VeraStack Labs" (mono, muted,
     the name in the text colour). The name appears in green only once on the page.
   - Body, first person, two paragraphs, wording as in the mockup:
     > Before you hand anyone your launch, you should know who'll be on the other side of the
     > table. At VeraStack Labs, that's me, on every call and in every meeting, from the first sketch
     > to the day it goes live.
     >
     > We ship launches end to end, design to code, in the same hands, so nothing gets lost between
     > a mockup and a handover. And the modern layer comes built in at every turn: AI search, so you
     > get named when buyers ask ChatGPT, and product videos for the launch itself.
   - A handwritten-style signature "Rigan" in the text colour (not green) closes the letter.
   - Photo: the black-and-white portrait in the VeraStack Labs hoodie that Rigan supplied in chat
     on 2026-10-17 (894 × 922). Rounded corners, 1 px line border. Alt text: "Rigan Burnwal in a
     VeraStack Labs hoodie".
3. **Metric cards** (three across on desktop, stacked or two-up on phones), numbers in the signal
   colour:
   - 70,000+ · bookings behind the configurators he built at Ultraviolette
   - Day 1 · paid pre-bookings on the E3 TRION launch
   - 3,000+ · X-47 bookings in its first 24 hours
   - Each card says whose work it was in its small text: Ultraviolette "as an employee", E3 TRION
     "independent client work" (my call, from the standing rule that the founder's own work is
     always labelled; it adds a few words to the agreed copy).
4. **Press line:** "As covered by" and each outlet once, linking to the first article listed for
   it in the `press` lists of `src/data/work.ts` (all of them, currently eight; my call over the
   five the mockup showed).
5. **Launch rail** ("The launches so far"), the vertical track from the Process scene's look:
   - Ultraviolette X-47 · configurator · 3,000+ bookings in 24 hours · as an employee
   - Ultraviolette Tesseract and Shockwave · configurators · 67,000+ bookings · as an employee
   - E3 TRION · launch site · paid pre-bookings on day one · independent client work
   - VeraStack Labs · sites, apps, AI search and product films, for clients and our own products
   - Your launch (dashed open dot, label in the signal colour) · design to code, with the founder on
     every call
6. **Questions** (agreed with Rigan, wording below), a visible block marked up as FAQPage:
   1. **Will you really be on my calls?** Yes. Every call and every meeting, from the first sketch
      to launch day.
   2. **Do you design, or just build?** Both, in the same hands: design and code are the core of
      every launch we ship.
   3. **Are AI search and a launch video extra work for me?** No. They're built into the launch as
      we go, so you're findable and have a film the day you go live.
   4. **What does it cost?** Every project is quoted after a free 20-minute call, once we know
      what the launch needs.
   5. **What have you launched before?** The configurators behind 70,000+ Ultraviolette bookings
      (as an employee) and the E3 TRION launch, which took paid pre-bookings on day one
      (independent client work). Alongside them, smaller builds for clients: Maven Consultancy's
      event registration with emailed QR passes, Pee Empro Exports' Android QR attendance app,
      Suggaa Ventures' payments and cancellations, and Cold Stone Creamery Arabia's website and CMS
      (built, launching soon). Build this answer from `src/data/work.ts` so it stays in step with
      the Work section; client names only, as a minimal reference, no new claims.
7. **Two buttons:** "Book a 20-min call" (primary, uses `booking` from `src/data/site.ts`) and
   "Founder's portfolio ↗" (secondary, `site.founderUrl`, opens in a new tab).

## How people reach it (agreed)

- About on the home page: "founded by Rigan Burnwal" links to `/founder`.
- Footer: a "founder" link alongside blog and the AI search check.
- Blog posts: a byline "by Rigan Burnwal" under the date, linking to `/founder`. Post JSON-LD
  author becomes the founder Person (publisher stays the studio).
- The header on `/founder` uses the existing page header (wordmark home, a `/founder` pill, the
  "Start a project" call to action), like `/blog` and `/ai-search-check`.

## Search and answer engines

- Person JSON-LD on `/founder`: name, url `https://verastack.dev/founder/`, image (the portrait),
  jobTitle "Founder", worksFor the studio Organization (by `@id`), sameAs the portfolio
  (`https://riganb.github.io`), GitHub (`https://github.com/riganb`) and LinkedIn
  (`https://www.linkedin.com/in/rigan-burnwal/`). Reuse the existing founder `@id`
  (`https://verastack.dev/#founder`) so the home graph's founder and this page are one entity.
- The home graph's Person node gains the same url, image and sameAs.
- Title and description sized for results pages; canonical `/founder`; Open Graph with the share
  image (or the portrait, builder's call).
- Listed in the sitemap and in llms.txt (a line under Key pages, and the founder line pointing to
  `/founder`).
- The page must pass the site's own AI search check at 100 (it is the studio's own worked example).
  The Questions block supplies the FAQPage; one h1 and an h2 per section. The checker's text check
  wants 500+ words of server HTML: the letter, cards, rail and questions together should get there;
  if not, the builder may lengthen the rail's one-liners from `work.ts` data, never invent claims.
  The structured check wants an offer-type node: marking up the launch rail as an ItemList is the
  builder's call (Rigan was not asked; it changes nothing visible).

## Constraints

- Same stack and patterns as the rest of the site: Next.js static export with `trailingSlash`,
  CSS modules, tokens from `src/styles/tokens.ts`, data in `src/data/`. Motion follows
  `useMotionPreference` (full, lite, static) and `prefers-reduced-motion`.
- Numbers and press come from `src/data/work.ts`, not hard-coded copy, so they never drift from
  the Work section. A test should hold the metric cards to the work data.
- No em dashes anywhere. No AI attribution. One branch, PR, merge; `docs/STATUS.md` updated.
- Works at 320 px wide with no sideways scroll.

## Left to the builder

- Exact component structure, file names and CSS.
- Any entrance motion (subtle, in the site's language, off in static mode).
- Image format and sizes for the portrait (webp, responsive sizes); where the file lives in
  `public/`.
- Whether the rail is shared with the Process scene's component or its own.
- The signature's typeface (a script face that fits, or an SVG of the word).
