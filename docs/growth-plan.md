# Growth plan

How verastack.dev pulls in the people who hire the studio: founders and teams about to launch, SaaS
companies, and brands that need to show up in AI answers. Agreed with Rigan on 2026-10-17. Every
idea below is wanted; the order is what we build first. Status lives in `docs/STATUS.md`.

The test for any idea: does it bring in people who can buy, not only people who browse. Student
and job-seeker traffic belongs to Origan, not here.

## Decisions

- **Measurement first.** Cloudflare Web Analytics (cookieless, free) on every site, one entry per
  hostname in the Cloudflare account. Search Console's Domain property `sc-domain:verastack.dev`
  already covers the studio and every subdomain.
- **DSA in Rust lives on Origan** (origan.verastack.dev), not here. Its audience is students, which
  is Origan's audience; the studio gains through Origan's "made by VeraStack Labs" link and the
  shared Search Console property.
- **The AI-search checker is freemium.** Free: a scored check of one URL with the top fixes. Paid:
  the full audit and the fixes themselves, which is the AI search & SEO service.

## The ideas, in build order

1. **Blog (`/blog`).** SaaS and launches first; open source and AI as a second lane. Written for the
   founder about to launch, from real work: what the configurator behind 70,000+ bookings taught
   us, launch-page teardowns, AI search for SaaS. Plain static pages from Markdown, each with its
   own title, description, share image and Article structured data, listed in the sitemap and
   llms.txt.
2. **"Does ChatGPT know your brand?" checker.** Paste a URL, get a score: structured data present
   and valid, llms.txt, AI crawlers allowed in robots.txt, title and description quality, sitemap.
   Needs a small server (a Cloudflare Worker) to fetch other sites, since this site is static.
   Every result ends with the paid next step.
3. **An original study.** "We asked ChatGPT about 100 Indian D2C brands: who gets named." Data from
   the outreach already under way. Lands as a blog post, LinkedIn carousels and press pitches.
4. **Launch teardowns,** a monthly blog series: what a real launch got right and where it leaked.
5. **Spec films for open-source projects,** like the Bruno film: made in hours, tagged so the
   maintainers can share them. Each one is proof for the Product videos service.
6. **More Claude Code mods,** and a page for them on the site. Each README links back.
7. **Full Work pages** (`/work/<client>`), already planned, ranking for what buyers search: EV
   configurator, pre-booking site, booking flow.
8. **Open-source templates:** a Next.js launch-page starter and a Framer template, each with a
   credit link.
9. **Cross-links from our products:** a consistent "Made by VeraStack Labs" credit on rigseed,
   Riggit, Mehfil, Origan and Oinkbuns, and Product Hunt launches.

## What needs Rigan

- Topics and real anecdotes for blog posts; no client facts that are not public.
- A Cloudflare login on this machine (`npx wrangler login`) before the checker's Worker can deploy.
- Pricing for the paid audit.
