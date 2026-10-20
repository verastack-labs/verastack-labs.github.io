# VeraStack Labs site status

The single place to catch up on verastack-labs.github.io. Update it in the same PR as any change
that finishes, adds or drops an item. Last updated 2026-10-20.

- Design spec: [superpowers/specs/2026-09-28-verastack-labs-site-design.md](superpowers/specs/2026-09-28-verastack-labs-site-design.md)
- Phase plans: [superpowers/plans/](superpowers/plans/)
- Kickoff brief: [brief.md](brief.md)
- Approved mockups: [mockups/](mockups/)
- Live: https://verastack.dev (deploys on every push to `main`; the old https://verastack-labs.github.io address redirects there)

## Where things stand

Foundation, hero and Services built: tokens, fonts, motion system, nav, footer, the hero over the dot-matrix field, the pinned Services scene with the live keyboard configurator, the Work reel and list, the Products hand-over (card swap on phones) followed by the shelf of open-source Claude Code mods, the Process rail with split-flap indices, About with the capabilities boot-up, Contact with the sentence form, CI. Live since 2026-09-28, at https://verastack.dev since 2026-10-12; every push to `main` deploys.

Product version strings in `src/data/products.ts` are kept by hand: bump them when a product
releases (rigseed set to v0.1.7 on 2026-10-16, it had drifted at v0.1.3).

| Phase | Status | PR |
| --- | --- | --- |
| 0. Spec, status, brief, mockups | done | #1 |
| 1. Foundation | done | #2 |
| 2. Hero | done | #3 |
| 3. Services and configurator demo | done | #5 |
| 4. Work and Products | done | #6 |
| 5. Process and About | done | #7 |
| 6. Contact | done | #9 |
| 7. Launch pass | done | #10 |

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
- **llms.txt**: the plain-text brief for AI answer engines, generated from `src/data/` at build
  time (`src/lib/structured-data.ts`).
- **Sentence form**: the Contact enquiry, one sentence with blanks (`src/scenes/contact/`).
- **Motion modes**: `full`, `lite` and `static` from `useMotionPreference()`.
- **Path pill**: the nav (`src/components/nav/path-pill.tsx`). Opens into the **dock row** on hover
  at 900 px and wider, and the **section panel** on touch or narrower screens. On desktop it starts
  open as the dock row for 3 s after load, then folds.
- **Panel mode**: `(hover: none), (max-width: 899px)`.

## Waiting on Rigan

Content (placeholders are in the design until these arrive):

- [x] AI search check complete reports go from rigan@verastack.dev (decided 2026-10-18): the
  visitor asked for it, so it is opted-in mail and fits Brevo's terms; signed by a person, as the
  page promises. Drafted with `node workers/aeo-check/report-email.mjs <host> [first name]` (every
  issue with what we found and what it takes, then what a score can't see and a 30-minute call
  link), checked, then sent by hand while volume is low; automate later through Brevo's
  transactional API (already set up for the domain, DKIM passing), no new account needed.
- [x] Hero headline confirmed by Rigan on 2026-10-15: "Sites, apps, 3D and films, built to launch and
  get found." (`src/data/hero.ts`; it covers all six services, like the title and description) and the `availability` line in
  `src/data/site.ts` (null, so hidden; the mockup used "taking projects for Q4 2026").
- [x] Contact email: `verastack.labs@gmail.com` since 2026-10-14 (was `therealriganb@gmail.com`), set once in `src/data/site.ts`
  (`email`). Change it there and the footer, Contact and the form's fallback all follow.
- [x] Web3Forms form "VeraStack Labs enquiries" created 2026-09-29, delivering to
  verastack.labs@gmail.com since 2026-10-14 (a verified linked email; was therealriganb@gmail.com;
  the form's website is set to verastack.dev). Free plan: 250 submissions a month, one recipient.
- [x] Live test to the studio inbox on 2026-10-14 (captcha solved by Rigan): the site showed Sent and
  verastack.labs@gmail.com received every field, including the new "a product video" choice. The
  message read "ideally live by within 3 months", so the sentence now says "ideally live within 3
  months" and "no fixed date" became "whenever it's ready". Key in `src/data/site.ts`
  (`formAccessKey`, public by design). hCaptcha is required on the form in the Web3Forms dashboard,
  so the site sends a token with every enquiry (`hcaptchaSiteKey`, Web3Forms' shared key).
- [x] Live test enquiry sent 2026-09-29 (captcha solved by Rigan): the site reported Sent and the
  Web3Forms inbox shows every field (name, email, company, service, budget, timeline, subject and
  the full sentence).
- [ ] The home page's Questions (`src/data/faq.ts`): check the five answers read right, especially
  the cost answer ("quoted after a free first call").
- [ ] Test the hCaptcha challenge inside the popups on a real device again. On 2026-10-20 Rigan
  found the puzzle could not be used on Android: a modal dialog makes everything outside it inert,
  so the 2026-10-17 popover showed the challenge but taps went through to the dialog (a long press
  selected its text). Fix: the challenge's wrapper moves (with `moveBefore`, which keeps the iframe
  loaded) into a second modal dialog above the first, and back on close (`src/components/hcaptcha.tsx`,
  `.hcaptcha-host` in globals.css). Browsers without `moveBefore` fall back to the popover. Verified
  with a stand-in challenge (taps reach it, the iframe keeps its state, the form dialog stays open);
  a real challenge is not something we open here. Covers both captcha dialogs (checker report,
  site-wide offer); the only other dialog plays our own video. Portfolio and Origan were asked to
  check theirs; the portfolio has no third-party frames, so it is not affected.
- [ ] A price for the AI search audit, if you want one shown. Until then the checker page and its
  FAQ say "price on request".
- [ ] The free product video's terms: how many we make, how long they are and who qualifies.
  Until then the offer says only "a few products we pick" (`src/data/offer.ts`). Applications
  arrive in the studio inbox with the subject "Free product video application: <product>".
- [ ] Reply-time promise ("within two working days" is placeholder, `replyPromise` in `src/data/site.ts`).
- [ ] Configurator demo prices (VS-65 keyboard, `src/data/configurator.ts`): illustrative
  placeholders, labelled "demo price" on the page. Fine to keep unless you want other numbers.
- [ ] Dollar budget bands (placeholders: under $3k, $3-7k, $7-15k, $15k+). Rupee bands too, if
  the placeholders (under ₹2L, ₹2-5L, ₹5-10L, ₹10L+) are wrong.
- [ ] How we work: the real steps and one line each (Discover, Design, Build, Launch are
  placeholder, in `src/data/process.ts`), and whether "a fixed quote" and "weekly previews" are promises we keep.
- [ ] Mehfil's one-line pitch ("Chai in ten? Rally the group." is placeholder). Its landing page
  (`/mehfil/`) is live, so the site now links it ("Join the waitlist") and its line comes from there.
- [ ] Origan's copy on the studio site (pitch "Four years, not four weeks.", from its PRODUCT.md
  principles; line from its landing page). Origan leads the Products scene, footer and sitemap, and
  counts as shipped (a partnership plan), so it shows no "soon" tag.
- [ ] Screen recordings of the Ultraviolette X-47 and Tesseract configurators and the E3 TRION site (with poster
  frames). Until then the Work reel shows stand-in artwork (`art` in `src/data/work.ts`); add
  `media: { poster, mp4, webm }` to swap in the recording.
- [ ] Years for the supporting work (Maven, Pee Empro, Suggaa, PixelStack), if you want them shown.
- [x] Cal.com live (2026-10-17): every "book a 30-min call" button opens
  https://cal.com/verastack/intro (30 min; a 15-min one is at /verastack/quick). Rigan chose two
  lengths, 15 and 30; the site says 30 everywhere.
- [ ] Cold Stone Creamery Arabia launch. It is built (website and CMS) and listed as a text-only
  `launching soon` row; no visuals until it is live. When it launches, follow spec 7.2: set
  `status: 'live'`, add media and the live link, decide headliner or supporting, and quote
  metrics honestly or not at all.

## Planned, not started

- [x] Cloudflare Web Analytics on verastack.dev (2026-10-17): cookieless, production builds only,
  token in `site.analyticsToken`. Entries also created for origan., rigseed., riggit., mehfil.,
  oinkbuns.verastack.dev and riganb.github.io; each project chat was sent its snippet.
- [ ] Growth plan (`docs/growth-plan.md`, agreed 2026-10-17): blog, the freemium "Does ChatGPT know
  your brand?" checker, a D2C AI-visibility study, launch teardowns, open-source spec films, more
  mods, full Work pages, open-source templates, product cross-links.
  - [x] Blog live at /blog (2026-10-17): Markdown posts in `src/content/blog/` (front matter: title,
    description, date, tags), static pages with BlogPosting structured data, in the sitemap and
    llms.txt, linked from the footer. First post: "AI search for SaaS: what ChatGPT reads before it
    recommends you". To publish, add a .md file and open a PR.
  - [x] Blog post "Funded this fortnight: six AI agents for the back office" (2026-10-18, Startups):
    Hone, Duvo, Causa Prima, Clueso, Forgepoint and Shamrock AI, $136.8M, rounds fact-checked; top three
    AI search scores named (Clueso 100, Duvo 90, Causa Prima 82), the rest private. Data in
    `social-docs/research/studies/funded-2026-10/`. Next edition after 31 Oct.
  - [x] AEO and GEO used together everywhere (Rigan, 2026-10-18): checker title, description, label and
    lede; FAQ adds "What is GEO?" and "AEO vs GEO vs SEO"; audit pitch, services blurb, home FAQ, site
    description and the report email. New post "GEO is the new SEO: what changes and what doesn't"
    (AI search category), for Rigan's profile.
  - [x] AI search check live at /ai-search-check (2026-10-17), freemium. A Cloudflare Worker in
    `workers/aeo-check` (custom domain api.verastack.dev, no workers.dev address) fetches one
    page plus robots.txt, llms.txt and sitemap.xml and runs twelve weighted checks (crawler
    access, AI-crawler blocking at the CDN, server-HTML text, JSON-LD, title, description,
    canonical, noindex, h1, llms.txt, sitemap, Open Graph). Free: score and top three fixes.
    Since 2026-10-18 the full report is never shown on the page: the Worker's public answer has
    only the score, the top three fixes and a count of the rest, and the page lists only three of
    the sixteen checks. Under the top fixes, three blurred placeholder rows and a "+N issues: find
    them all in the complete report" card lead to the email gate (Web3Forms with hCaptcha, subject
    "AI search check: <host> scored <n>"). The studio writes the complete report by hand within one
    working day from `node workers/aeo-check/full-report.mjs <host>`. Every result also shows what
    the audit covers beyond the sixteen checks (buyer questions asked in the engines, competitors,
    every selling page, the sites AI quotes, pages written to be cited, re-asking after the fixes),
    so the score never reads as the whole job. That script and the study scan send
    the studio key (`workers/aeo-check/.report-key`, not in git; on the Worker as the REPORT_KEY
    secret) to get every check. Paid: the audit and fixes, price on request, linked to the contact form with
    "to show up in AI search" picked. Guards: public hostnames only (no IPs, local names, odd
    ports or credentials), every redirect rechecked, 8 s timeout, 2 MB cap, 10 checks a minute
    per visitor, results cached 10 minutes. Deploy the Worker by hand: `cd workers/aeo-check`,
    `npm install`, `npx wrangler deploy` (it is not part of the Pages workflow).
  - [x] Stricter scoring (2026-10-17, after onefin.in scored 93 with no Organization data, no FAQ
    and a keyword-list description). Sixteen checks now: added "who you are" (Organization with
    logo and sameAs), FAQ, headings outline, freshness (sitemap lastmod, Last-Modified,
    dateModified) and image alt text; more crawlers (ChatGPT-User, Perplexity-User, Claude-User,
    Applebot-Extended, CCBot, Meta-ExternalAgent); text needs 500 words; keyword-list descriptions
    warn; llms.txt needs a title and links. A warning earns a third of its points (was half), and a
    page that blocks search crawlers or says noindex is capped at 40. onefin.in now scores 69,
    stripe.com 74. `fresh=1` skips the 10-minute result cache (for re-checks after a fix); the cache
    key is versioned so a scoring change never serves old results.
  - [x] Our own pages pass the stricter check: home and /ai-search-check score 100. Home gained a
    visible Questions block in About (`src/data/faq.ts`) with FAQPage markup, which moved from the
    root layout to the home page so other pages do not claim questions they do not show. llms.txt
    has a Key pages section with Markdown links; blog and checker pages keep the share image.
    The blog index (79, one post) and the post (93, no FAQ) improve as posts arrive.
  - [x] Faster upsell (2026-10-17). A site-wide offer (`src/components/offer/`, copy in
    `src/data/offer.ts`, mounted in the root layout): a dialog with two offers, "Apply for a free
    product video" (product name or URL, email, an optional one-line note, hCaptcha, sent through
    Web3Forms with the subject "Free product video application: <product>") and the free AI search
    check (a URL field that opens `/ai-search-check/?url=...`). On the checker page only the video
    offer shows. Never on load, because of Google's mobile interstitial rule: it opens once per
    visitor every 7 days (local storage, `src/lib/offer.ts`) at half the page scrolled, 30 seconds,
    or the pointer leaving through the top on desktop, and waits while the contact form is in view
    or in use, or any field has focus. Centred about 880 px wide on desktop, a bottom sheet under
    768 px; closes on Escape, the backdrop or the close button; holds Lenis still while open.
    Once closed, a pill at the bottom right ("Free video · AI check") reopens it; it hides over
    the contact section and the footer. The checker now reads `?url=`, fills the field and runs;
    "Check again" re-runs with `fresh=1` (skips the Worker's 10-minute cache). Straight under the
    score a band sells the fix: under 100, "Get it to 100" (price on request, contact form with
    "to show up in AI search" picked); at 100, the citation audit. The old "Want it fixed?" block
    is gone.
  - [x] Startup series started (2026-10-17): the leads chat scouts weekly
    (`social-docs/research/startups/`); we verify, scan and write. New Startups category. First post
    "AI search scores of YC Summer 2026, by space" (`social-docs/research/studies/yc-s26/`). Next: "Funded this
    fortnight" on back-office agents, from the 17 Oct scout file.
  - [ ] SaaS Launch Kit: decided 2026-10-18 (`docs/launch-kit.md`): $9,500 fixed, 4 weeks, two a
    month, 10% back per late week capped at 30%, equity case by case (60% cash floor, up to 1% via
    SAFE), a 90+ AEO and GEO score promise, code by default (Framer on request), $2,500/mo plan with
    a 3-month minimum. India: regional pricing on a call, shown only to Asia/Kolkata visitors; floor INR 4 lakh
    (internal). Page live at /launch-kit (2026-10-18): mockup B (price card pinned, a bottom bar on
    phones) with A's guarantee headline and proof cards; Service and Offer plus FAQPage JSON-LD; in
    the footer, sitemap and llms.txt. The India block and chip render only for Asia/Kolkata time
    zones.
  - [x] Tools section (2026-10-18): /tools lists the free tools; the checker moved to
    /tools/ai-search-check. /ai-search-check now forwards there with ?url= kept (noindex, canonical to
    the new address); every internal link, the sitemap, llms.txt, the footer and the report email use
    the new address. New tools go in `src/data/tools.ts` at /tools/<slug>.
  - [x] Home notes section (2026-10-18, layout B): between About and Contact, in the section pill as
    /notes. A featured post drawn at random in the browser from the newest four posts with a `stat`
    (front matter `stat: value | label`; the server shows the newest), beside the three newest others.
    Posts have no scheduling: a merged post is live on that deploy, whatever its `time` (time only
    sorts same-day posts), so no scheduled rebuild is needed.
  - [ ] Free tools programme (`docs/tools-plan.md`, approved 2026-10-18): eight zero-cost tools, one
    at a time. Shared: `src/app/tools/tool.module.css`, `ToolBridge` (the honest limit, the full
    check with their URL, the audit, the kit, a call) and `src/lib/scan-stats.ts` (each page's number
    from `src/data/scan-gaps.json`, totals regenerated from the private study data).
    - [x] 1. FAQ schema generator at /tools/faq-schema (2026-10-18): templates for SaaS, studios and
      stores, live JSON-LD, HTML and preview, copy buttons, quotability notes; 81% of 379 homepages
      have no FAQ. Next: its blog post, and the outside numbers once `docs/why-ai-search-numbers.md`
      is sourced.
    - [x] 2. Product and service schema generator at /tools/product-schema (2026-10-18): software,
      service or product; writes the plain sentence for the page first (what an answer quotes), then
      SoftwareApplication, Service or Product JSON-LD with each price as an offer; 81% of 379 have none.
      Forrester (94% of B2B buyers use AI) and Adobe (31% more conversions) as the outside numbers.
    - [x] 3. "What ChatGPT sees" at /tools/what-ai-sees (2026-10-18): the Worker's new /page-view
      route (same guards, own 10-minute cache, same rate limit) returns the page's text as a crawler
      that skips JavaScript reads it; the page shows the word count, a verdict in the checker's bands
      and the text itself. 34% of 379 homepages send under 500 words, 17% under 200. Source for
      crawlers not rendering JavaScript: Vercel, Dec 2024.
    - [x] 4. Organization schema generator at /tools/organization-schema (2026-10-19): the about line
      for the page first, then Organization JSON-LD (logo, founding year, place, founders, contact,
      de-duplicated sameAs links with the platform recognised); 53% of 379 homepages have it missing
      or unlinked, 39% none.
    - [ ] 5 to 8: llms.txt generator, meta description tester, link preview checker, AI crawler
      checker (order and numbers in `docs/tools-plan.md`). Each tool also needs its blog post; none of
      tools 1 to 3 has one yet ("What ChatGPT sees" first).
  - [x] Report request confirmation in the dialog (2026-10-20, Rigan on Android): after Send, the
    dialog used to close and the "on its way" line sat further down the page, where the scroll to it
    never ran (the page is held still while the dialog is open), so nothing seemed to happen. Now
    the confirmation replaces the form inside the dialog or bottom sheet: who writes it, the address
    it goes to, from rigan@verastack.dev, within one working day, check spam, and a Done button. A
    "Tick the box above to send" hint shows while the captcha is unticked, and a failure names the
    studio address. There is still no instant email to the visitor: Web3Forms delivers the request to
    the studio inbox and the report is written by hand.
  - [x] Short reports gated, and shareable result links (2026-10-20, Rigan via the Social chat, after
    the syntaxsuite.io report showed all three of its fixes in full). The checker never shows the
    whole fix list: more than three issues, the top three in full as before; three or fewer, the first
    in full and the second's finding with its fix blurred into the call to action. The Worker sends
    no text for what is held back (`partial` in `publicView`), so nothing is readable in the source
    or a copy and paste. The checker and "What ChatGPT sees" write `?url=<site>` into the address bar
    after a result (replaceState), and a link with it runs that site. Both rules are in
    `docs/tools-plan.md` for every planned tool that reports on a site.
  - [x] Founder film on /founder (2026-10-19): the agency cut of the portfolio launch film (no Oinkbuns,
    51 s, 1080p, 6.5 MB) from the video session (verastack-labs/studio 80278fa), click to play with a
    poster and captions, a caption on the client work and bookings, and VideoObject JSON-LD. Files in
    `public/founder/`.
  - [x] Blog sources and methods (2026-10-19, Origan request Rigan approved): each study ends with a
    "How we measured" box (what was checked and how it was sampled, date, the check and the FAQ-rule
    change, what the score means, limits, every site scored as a list without scores, top scorers
    only named). The two explainers end with Sources (OpenAI, Perplexity, Anthropic, Google Search
    Central, Cloudflare, Vercel, Ahrefs, Pew, the GEO paper, llms.txt), and our own views are
    labelled. External links in posts open in a new tab with a hidden note and a ↗ arrow. Note: the
    raw per-site study data in `social-docs/research/studies/` is in a public repo, which shows low scores.
  - [x] Claims rule (2026-10-18): no page, post or pitch promises being quoted or cited by AI. Markup
    is "good practice that labels"; numbers only from `docs/why-ai-search-numbers.md` or the scans.
    Study FAQ figures were counted under the old FAQ rule: quote them as "no FAQ on the homepage".
  - [ ] 1 Jan 2027: redeploy so the Launch Kit's year-end offer (25% off, $7,125 and $3,375) comes
    off the page; see `docs/launch-kit.md`.
  - [ ] Phone screenshot checks on Rigan's Android (paused at his request; adb wireless, port changes
    each reconnect): configurator and Pre-book strip, Work spacing, nav after Mehfil, curtain,
    checker, Launch Kit bar and India block, the new menu, and the shift check on portfolio and Origan.
  - [x] Main navigation (2026-10-18): the pill's dock row and panel gain a studio group (launch kit
    with a new dot, tools, blog, founder; `src/data/studio-links.ts`); on every other page the page
    pill opens a dropdown with the home sections and the studio group; desktop (900px and up) has a
    Launch kit button beside Start a project, hidden on the kit's own page. The row needs 1360px, so
    narrower mouse screens open the panel as a right-hand dropdown; phone panels scroll when short.
    Drop `isNew` from the launch kit link after a few weeks.
  - [x] Blog order and tags (2026-10-17): posts carry an optional `time:` (IST, HH:MM) so same-day
    posts sort newest first (a test holds it); JSON-LD datePublished includes it. Inside a post, the
    category and tags are bordered pills under the date (the category highlighted, linking to its
    page; a tag repeating the category is dropped). Category chips on /blog share one height.
  - [x] Blog structure (2026-10-17): categories with a short phrase each (`src/data/blog-categories.ts`;
    every post names one in front matter, and an unknown one fails the build), chips on /blog with
    counts, a page per category with posts (/blog/category/<id>/, in the sitemap). Every post now
    ends with an inline AI search check, and can carry a highlighted hook (`hook` and `hookCta:
    Label | href-or-call` in front matter, placed at a `<!-- hook -->` marker or after the opening).
    Embeds work in posts (YouTube or live pages via iframes; `<div class="pair">` puts two side by
    side). Inside an embed, the site header and the offer step aside. All four posts have hooks;
    Spot the slop embeds both Bookwell pages live. Bookwell gained a product visual (phone with the
    slot picker and a reminder bubble), numbered steps and icons.
  - [x] Post "Spot the slop: what an AI-built launch page gets wrong" (2026-10-17). A made-up product,
    Bookwell: Lovable built one page from one prompt (live at bookwell-launchpad-app.lovable.app, in
    Rigan's Lovable account; scored 54), and we built ours at /examples/bookwell/ (own brand,
    banner saying it is an example, out of the sitemap; scores 100). The post names no real
    clinic and does not repeat the AI page's invented testimonials. An empty Framer project made by
    accident ("Stupendous Skills") was archived and then deleted by Rigan.
  - [x] Android shift, measured on a real phone (2026-10-18, OPPO Reno15 Pro Mini over adb, Chrome
    with its address bar at the bottom): even svh and lvh moved by about 73px as the toolbar slid,
    and ScrollTrigger re-measured pins on the resize Chrome fired, so the page swung by up to 366px.
    Fix: `src/lib/screen-lock.ts` measures the screen once before first paint into --screen-small
    and --screen-large (re-measured only on a 50px+ width change); full-screen scenes use those; and
    ScrollTrigger no longer refreshes on resize, only on load and real width changes. Measured after:
    locked heights constant, pinned scenes constant, page height within 32px (content animations).
  - [x] No page shift on Android scroll-direction changes (2026-10-17): full-screen scenes (hero,
    Services, Work, Products, Process) and the body used `100dvh`, which grows and shrinks as
    Chrome's address bar hides and shows, shifting everything below and putting the pinned scenes
    out of step with ScrollTrigger (which ignores mobile resizes). Now pinned scenes use `100lvh`
    (stable, and fills the screen once the bar hides; `svh` left a strip of background under a
    pinned scene, fixed 2026-10-17) and the hero `100svh`, each with a `100vh` fallback; `dvh` stays
    only on dialogs. Every other site chat was asked to check the same.
  - [x] "Meet the founder" card in About (2026-10-17): photo, one line and a button to /founder,
    under the studio statement.
  - [x] Offer popup timing (2026-10-17, agreed with Rigan): once every 14 days, never again after a
    video application or a check; never mid-scroll (waits for a 1.5 s pause); never on the page a
    visit lands on, except a laptop pointer heading for the tabs; on home once Work has been read,
    on later pages after 45 s. Rules in `src/lib/offer.ts` with tests.
  - [x] Nav back to dark after the Products hand-over (2026-10-17): Mehfil turns it light; it now
    returns to dark once the hand-over's bottom passes the nav, so the mods shelf reads dark.
  - [x] Founder page at /founder (2026-10-17, spec `superpowers/specs/2026-10-17-founder-page-design.md`):
    a first-person letter with the portrait Rigan supplied in chat (black and white, VeraStack Labs
    hoodie; `public/founder/rigan-burnwal.webp`), three metric cards and a launch rail held to
    `src/data/work.ts` by tests, the press line, five agreed questions (FAQPage), and two buttons
    (call, founder's portfolio). Linked from About, the footer and post bylines; Person JSON-LD
    shared with the home graph; in the sitemap and llms.txt. Scores 100 on our own check.
  - [x] Page transitions (2026-10-17): an ink curtain with the lime slash covers and lifts between
    pages of the site (`src/components/transition/route-curtain.tsx`); pages after the first rise in
    with a short stagger (`src/app/template.tsx`; home only fades so its pinned scenes are
    untouched); inner-page sections marked `data-reveal` rise once as they scroll in. None on the
    first load, in static motion mode or under reduced motion; links to a section ("/#contact")
    land on it under the curtain.
  - [x] Checker selling (2026-10-17): after the top three fixes, the rest show as "+N more to
    fix" with their names visible and details blurred (the real details are not in the page until
    unlocked). An unlock dialog opens once per visit when that list scrolls into view, and from the
    "Unlock the full report, free" button; it takes the email (Web3Forms, hCaptcha) and links to
    the paid fix. The result scrolls smoothly into view below the header. The site-wide offer
    holds off while a result is on screen (`data-offer-hold`).
  - [x] D2C AI-visibility study, part A (2026-10-17): 99 brands from the AEO outreach batches
    through the live checker (`social-docs/research/studies/d2c-ai-visibility/`, scan.json). 96 reachable: median
    75, top 91, 71 under 80; 91 homepages lack product structured data, 71 have no FAQ. Published
    as the blog post "We ran 96 Indian D2C sites through an AI search check", naming only the top
    ten (praise in public; low scorers hear privately by email or DM). Part B (asking the engines
    who they name) dropped: paid APIs or hours by hand, not worth it now.
  - [x] SaaS version (2026-10-17): 27 homepages, 26 reachable, median 77.5, four at 100; post
    "AI search scores of 26 SaaS homepages" names everyone at 85 or above (`social-docs/research/studies/saas-ai-search/`).

- [ ] Booking figures in the Work headliners are Ultraviolette's public numbers (2026-10-16, from the
  press links in `src/data/work.ts`): Tesseract 60,000+, Shockwave 7,000+, X-47 3,000+ in 24 hours,
  70,000+ in all. Refresh them if newer coverage appears. E3 TRION has no public count, so none is
  shown; add one only if E3 publishes it.

- [ ] AI search & SEO service (added 2026-10-14): its proof is the studio's own sites. Once a client
  engagement exists, add it as a proof line, and consider a short page that explains AEO (answer
  engine optimisation) in plain words, since few buyers know the term yet.


- [x] `sitemap.xml` resubmitted in Search Console on 2026-09-30. It lists the four product landing
  pages (Origan, rigseed, Riggit, Mehfil), and robots.txt points at the Origan and Riggit sitemaps.
  A new product page is one line in `src/data/landing-pages.ts`.
- [ ] Check back in a few days that both sitemaps (root and `/origan/`) move from "Couldn't fetch"
  to "Success". "Couldn't fetch" is normal until Google first reads a new property's sitemap.
- [ ] Google Search Console: the verification tag is live (`googleSiteVerification` in
  `src/data/site.ts`, 2026-09-28). Remaining: press Verify, then submit
  `https://verastack-labs.github.io/sitemap.xml` under Sitemaps. Bing Webmaster Tools can import
  the property from Search Console.
- [ ] Share caches: platforms keep the old preview of a link for days. After copy changes, refresh
  with the Facebook Sharing Debugger and LinkedIn Post Inspector. WhatsApp and X refresh on their
  own schedule.
  - [x] LinkedIn Post Inspector re-scraped all five pages on 2026-10-13 (verastack.dev and the four
    product subdomains): titles, images and canonical URLs correct. Its warning about Riggit's and
    Mehfil's short descriptions is gone since their repos lengthened them (re-scraped 2026-10-15:
    Riggit 120 characters, Mehfil 144). Optional: Mehfil's title is only "Mehfil"; a short line
    after the name, as Riggit has, would make its preview stronger (mehfil repo).
  - [ ] Facebook Sharing Debugger (deferred by Rigan, 2026-10-14: no Facebook access yet): sign in,
    then "Scrape Again" for https://verastack.dev/ and each product subdomain.

- [ ] Confirm mobile LCP on https://pagespeed.web.dev (Google's servers; the anonymous API quota was
  used up on 2026-09-28). If it is over 2.5 s there, try dropping the `opsz` axis from Bricolage
  (smaller font file) before anything else.

- [ ] Cal.com pop-up (spec 6.07): the booking card is always shown. With no `calLink` it opens an
  email asking for a call (`booking` in `src/data/site.ts`); with one it opens the link in a new tab. Load Cal's embed on first click and restyle it to the tokens
  once there is a real link to test against.
- [ ] Custom domain **verastack.dev** (registered at Cloudflare 2026-10-12). Products move to
  subdomains, not paths: `origan.`, `rigseed.`, `riggit.`, `mehfil.verastack.dev`.
  - [x] Cloudflare DNS (2026-10-12), all "DNS only": apex A and AAAA records to GitHub Pages,
    CNAMEs from `www` and the four product subdomains to `verastack-labs.github.io`.
  - [x] TXT `_github-pages-challenge-verastack-labs` added for GitHub's domain verification.
  - [x] verastack.dev verified in the org's Pages settings (2026-10-12), so no other account can
    claim it or its subdomains.
  - [x] This repo moved (2026-10-12): `site.url` is `https://verastack.dev` (canonical, share
    image, JSON-LD, llms.txt, robots), the sitemap lists only this host, and the Pages custom
    domain is set through the API (the repo deploys from a workflow, so no `CNAME` file is needed).
  - [x] All four products live on their subdomains (2026-10-13), old URLs redirect (301), and the
    links in `src/data/products.ts` point at `https://<name>.verastack.dev/`.
  - [x] Mehfil's page has its canonical tag, https://mehfil.verastack.dev/ (checked 2026-10-15).
  - [x] SEO and AEO check on the live site (2026-10-14): title, description, canonical, robots,
    Open Graph and Twitter cards, icons, one h1, alt text on every image, valid JSON-LD
    (Organization, Person, WebSite, ten offers), robots.txt, sitemap (now with `lastmod`) and
    llms.txt all correct; 1,105 words of content in the server HTML. Search Console says indexing
    data is still processing for the new property.
  - [x] GitHub org: website https://verastack.dev, description and location set (2026-10-14);
    profile README live from `verastack-labs/.github`; topics on every public repo.
  - [x] GitHub org avatar set to the mark (signal slash on ink, 512 px) and display name
    "VeraStack Labs" (2026-10-14).
  - [x] Search Console Domain property `sc-domain:verastack.dev` verified (2026-10-12, through
    Cloudflare's one-time approval) and `https://verastack.dev/sitemap.xml` submitted. `www`
    already redirects to the bare domain. All five sitemaps are in that property (2026-10-13):
    all five read Success on 2026-10-14 (20 pages found: studio 1, Origan 6, rigseed 5, Riggit 7,
    Mehfil 1).
  - [x] Email on @verastack.dev, receiving, via **Cloudflare Email Routing** (2026-10-14). MX, SPF
    and DKIM records added by Cloudflare; `rigan@verastack.dev` and a catch-all both forward to
    verastack.labs@gmail.com (destination verified). Zoho dropped: its Forever Free plan is only
    reachable through a 15-day paid-plan trial (Zoho support confirmed this in writing on
    2026-10-14) and has no IMAP or POP.
  - [x] Brevo (free plan) authenticated for verastack.dev on 2026-10-14: brevo-code TXT, DKIM
    CNAMEs `brevo1/brevo2._domainkey` (DNS only) and Cloudflare DMARC Management (`p=none`,
    reports to Cloudflare). Brevo asked for no SPF change. `site.email` reads rigan@verastack.dev.
  - [x] Gmail "Send mail as" rigan@verastack.dev live on 2026-10-15 via `smtp-relay.brevo.com:587`
    (TLS), set as the default with "always reply from default". Brevo's IP blocking for SMTP keys
    had to be switched off, since Gmail sends from changing Google IPs. A test to a Gmail inbox
    landed in the inbox with SPF, DKIM (d=verastack.dev) and DMARC all passing.
- [ ] Form backend move (spec 7.4): Cloudflare Worker, Turnstile, an email API (Resend or
  similar), auto-reply copy to the visitor. Needs the custom domain. Brings back the "a copy is on
  its way to your inbox" line.
- [ ] Work and Products as full pages (`/work/...`, `/products/...`), reading the same data files.
- [ ] Team row in About: built and hidden; it appears once `src/data/team.ts` has real people.

## Known trade-offs

- A Pages deploy can hang and lock every later one ("due to in progress deployment. Please cancel
  <sha> first"), even after the cancel API says it is cancelled. Seen 2026-10-14 with `7339820`.
  What cleared it: re-run that same stuck run (`gh run rerun <run-id> --failed`) so it finishes,
  then re-run the newest failed deploy. Retrying only the newest run does not help.

- Lighthouse, mobile, live site before phase 7: performance 86 (LCP 2.4 s, CLS 0.004, TBT 430 ms),
  accessibility 93, best practices 100, SEO 100. Phase 7 moved the product mockups to transform
  animations paused off screen (TBT about 300 ms locally) and fixed the tab contrast and footer
  tap spacing. The remaining contrast findings are the unlit process steps and capabilities, dim
  on purpose until they switch on; Lighthouse does not scroll, so it only sees them unlit.
- LCP on mobile measured 2.4 to 2.9 s with Lighthouse run on this machine, against a 2.5 s target.
  Those runs are not trustworthy for paint timing: first paint waits on an idle main thread, and
  the portfolio site shows the same delay as a control (observed first paint 2.5 s). LCP there
  equals first paint (the headline), so the page itself paints as soon as it can. Per-scene hydration
  chunking (#11) was reverted in #17 because it left five scenes unhydrated. The WebGL field accounts for most lab TBT only because headless
  Chrome renders it in software.

- Four pinned scenes run back to back (Services, Work, Products, Process). Each hold is sized to
  its content and About is unpinned to give the page a breather.
- `dim` (#3B3E35) text for inactive index rows and unlit steps is below AA contrast by design
  while its neighbour is active. In `static` mode inactive states use `muted` instead.
- The configurator demo uses a stand-in product (a keyboard), not client work, so it cannot
  misrepresent whose work it is. It is built in code rather than from a model file, so it is
  simple rounded boxes, not photoreal.
- three.js is about 245 KB gzipped, loaded only when Services comes near (never on first paint).
- No auto-reply to enquiries until the form backend moves.
- The form service is Web3Forms (public access key, `botcheck` honeypot, hCaptcha). Free plan: 250
  submissions a month. hCaptcha loads only once someone can send, and sets its own cookies.
- The site went live early (after phase 2) with placeholder sections for services onwards.
- Pinned scenes pin an inner div, never the `<section>` (so React can still insert next to it when
  the layout switches), and set up their pins in `useLayoutEffect` so GSAP unwraps its pin spacer before React
  removes the node (otherwise resizing from desktop to phone width throws).
- Scene placeholders (`src/components/scene-placeholder.tsx`) stand in for each section until its
  phase lands; each carries the id the nav tracks.

## Working rules

See `../CLAUDE.md` in the workspace. In short: one branch per phase, PR and merge when done, no AI
attribution, no em dashes, never rewrite `main`, and keep this file current in the same PR as the
change it describes.

Animation stack (Rigan's decision, 2026-10-17): GSAP with ScrollTrigger and Lenis for the
scroll-pinned scenes, plain CSS transitions for hover and in-view effects, and CSS modules for
styling, with Tailwind for simple layout. Motion (Framer Motion) is not used yet; add it later only
where it is genuinely better, such as shared-element and layout transitions when Work and Product
become full pages.
