# VeraStack Labs site status

The single place to catch up on verastack-labs.github.io. Update it in the same PR as any change
that finishes, adds or drops an item. Last updated 2026-10-17.

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
- [ ] A price for the AI search audit, if you want one shown. Until then the checker page and its
  FAQ say "price on request".
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
- [ ] Cal.com account and the 20-minute event link (`site.calLink`). Until then "book a 20-min call"
  (Contact, footer, phone nav) opens an email to you with the subject "20-min call".
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
  - [x] AI search check live at /ai-search-check (2026-10-17), freemium. A Cloudflare Worker in
    `workers/aeo-check` (custom domain api.verastack.dev, no workers.dev address) fetches one
    page plus robots.txt, llms.txt and sitemap.xml and runs twelve weighted checks (crawler
    access, AI-crawler blocking at the CDN, server-HTML text, JSON-LD, title, description,
    canonical, noindex, h1, llms.txt, sitemap, Open Graph). Free: score and top three fixes.
    The full report opens after an email (Web3Forms with hCaptcha, subject "AI search check: <host>
    scored <n>"). Paid: the audit and fixes, price on request, linked to the contact form with
    "to show up in AI search" picked. Guards: public hostnames only (no IPs, local names, odd
    ports or credentials), every redirect rechecked, 8 s timeout, 2 MB cap, 10 checks a minute
    per visitor, results cached 10 minutes. Deploy the Worker by hand: `cd workers/aeo-check`,
    `npm install`, `npx wrangler deploy` (it is not part of the Pages workflow).
  - [ ] Next: the D2C AI-visibility study (idea 3).

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
