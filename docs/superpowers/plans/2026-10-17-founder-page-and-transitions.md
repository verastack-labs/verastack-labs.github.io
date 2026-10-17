# Founder Page and Page Transitions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `verastack.dev/founder` as designed, link it across the site, and add premium page transitions.

**Architecture:** Founder copy and derived numbers live in `src/data/founder.ts` (metrics, rail and the launched-before answer computed from `src/data/work.ts`); the page is a server component at `src/app/founder/page.tsx` with a CSS module. Structured data extends `src/lib/structured-data.ts`. Transitions: an App Router `template.tsx` (remounts per navigation) plays a rise-in, and a client `RouteCurtain` in the root layout plays the ink-and-slash curtain on in-site navigations only.

**Tech Stack:** Next.js 16 static export (`trailingSlash`), React 19, CSS modules, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-17-founder-page-design.md` (plus the chat-approved transitions: an ink curtain with the lime "/" sweeping up between pages, the new page rising in with a slight stagger, about half a second in all; sections on inner pages fade and rise once on scroll; nothing on the first load; nothing for reduced motion or static mode; home keeps its own scenes).

## Global Constraints

- No em dashes anywhere (copy, code comments, commits, PR).
- No AI attribution in commits or PRs.
- Founder's own work is always labelled: Ultraviolette "as an employee", E3 TRION "independent client work".
- No resume link.
- Numbers come from `src/data/work.ts`; nothing hard-coded that can drift.
- Must score 100 on the site's own AI search check (built HTML, scored offline as before).
- 320 px wide, no sideways scroll. Motion off in static mode and under `prefers-reduced-motion`; content always present in the server HTML (animate opacity and transform only).

## Review Focus

- Direct load of `/founder/` (no client navigation): no curtain, content visible immediately.
- Static motion mode: the reveal classes must not leave content at opacity 0.
- Browser back/forward between pages: the curtain must not stick over the page.
- Hash links (`/#contact` from the founder page CTA): the curtain must not block the scroll to the section.
- 320 px: the letter, photo, three cards and the rail fit without overflow.

---

### Task 1: Founder data, derived from the work data

**Files:**
- Create: `src/data/founder.ts`, `src/data/founder.test.ts`
- Modify: `src/data/work.ts` (add structured `metrics` to Ultraviolette and E3 entries)

**Interfaces:**
- Produces: `founder` object: `{ path: '/founder', title, description, letter: string[], questions: {q,a}[], metrics: {value,label}[], rail: {name,line,you?}[], sameAs: string[], photo: {src,width,height,alt} }`; `pressOutlets(): {outlet,url}[]` (each outlet once, first article).

- [ ] Step 1: Tests: metrics values are `70,000+`, `Day 1`, `3,000+` and each label names its client and label ("as an employee" / "independent client work"); `pressOutlets()` has no duplicate outlet and length equals the distinct outlets in `work`; the launched-before answer names every supporting client in `work` except PixelStack (in progress); no em dash in any string; `questions.length === 5`.
- [ ] Step 2: Run `npx vitest run src/data/founder.test.ts`, expect fail.
- [ ] Step 3: Implement. Letter and question copy verbatim from the spec. `sameAs`: `https://riganb.github.io`, `https://github.com/riganb`, `https://www.linkedin.com/in/rigan-burnwal/`. Photo: `/founder/rigan-burnwal.webp`, 894 × 922.
- [ ] Step 4: Tests pass. Step 5: commit.

### Task 2: The page

**Files:**
- Create: `src/app/founder/page.tsx`, `src/app/founder/founder.module.css`, `public/founder/rigan-burnwal.webp` (from the supplied portrait, webp, quality ~82)
- Modify: `src/components/nav/site-header.tsx` (PageHeader for `/founder`)

- [ ] Step 1: Build the page per the spec's sections 1 to 7 from `founder` data; h1 is the letter headline; h2 for metrics (visually hidden if needed), rail and questions; JSON-LD graph: `studioNode()`, Person (`@id` `${site.url}/#founder`, url `/founder/`, image, jobTitle "Founder", worksFor studio, sameAs), FAQPage, ItemList of the rail.
- [ ] Step 2: `npm run build`, then score `out/founder/index.html` offline with the worker's `runChecks` (as done for the home page). Expect 100; if `text` warns, lengthen rail lines from work data only.
- [ ] Step 3: Browser check at desktop, 375 and 320 px. Commit.

### Task 3: Links, structured data, sitemap, llms.txt

**Files:** `src/scenes/about/about.tsx`, `src/components/footer/site-footer.tsx`, `src/app/blog/[slug]/page.tsx`, `src/lib/structured-data.ts`, `src/app/sitemap.ts`, tests in `src/lib/structured-data.test.ts` and `src/app/seo-files.test.ts`.

- [ ] Step 1: Tests: sitemap contains `https://verastack.dev/founder/`; llms text contains `/founder/`; home graph Person has `sameAs` with the three profiles and `url` ending `/founder/`.
- [ ] Step 2: Fail, implement, pass. About's "founded by" name links to `/founder`; footer gets "founder"; post pages show "by Rigan Burnwal" linking to `/founder` and set BlogPosting `author` to the founder Person. Commit.

### Task 4: Page transitions

**Files:** Create `src/app/template.tsx`, `src/components/transition/route-curtain.tsx`, `src/components/transition/transition.module.css`, `src/lib/transition.ts` + test; Modify `src/app/layout.tsx`.

**Interfaces:**
- Produces: `shouldCurtain(from: string, to: string, firstLoad: boolean): boolean` (false on first load, same path, or hash-only change).

- [ ] Step 1: Tests for `shouldCurtain`: first load false; `/blog/` to `/founder/` true; `/` to `/#contact` false; `/founder/` to `/founder/` false.
- [ ] Step 2: Implement. Curtain: fixed ink panel with the lime "/" glyph, plays on pathname change when `shouldCurtain` is true: covers (0 to 220 ms) then sweeps up off-screen (to 520 ms); pointer-events none; removed after. `template.tsx` wraps pages in a div whose direct children rise in with a 60 ms stagger after the first load; inner pages mark sections with `data-reveal` and an IntersectionObserver reveals them once. All gated on `useMotionPreference() !== 'static'` and reduced motion; with motion off, nothing is hidden.
- [ ] Step 3: Browser check: navigate home to blog to founder to checker; back button; direct loads. Commit.

### Task 5: Ship

- [ ] Update `docs/STATUS.md` (founder page done; transitions done; the portrait's source noted). Tests, typecheck, lint, build. PR, merge, verify live: `/founder/` 200, and a live AI search check of `verastack.dev/founder/` reads 100.
