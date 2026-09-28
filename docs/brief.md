# VeraStack Labs site: kickoff brief

Starting point for the studio site. It collects what is already decided, what content exists and
what still needs answering, so design can start without re-reading the portfolio history.
Written 2026-09-28 in the workspace's `briefs/` and moved here the same day. Kept for history: the
open questions below are answered in the [design spec](superpowers/specs/2026-09-28-verastack-labs-site-design.md)
(section 3), and relative paths such as `../work-history.txt` refer to the workspace.

## Decided

- **Separate site, separate repo.** Nothing is shared at runtime with riganb.github.io. Copying a
  component across is fine; importing across repos is not.
- **Direction: cinematic.** The personal site is the restrained editorial one. Spectacle belongs
  here: a WebGL hero, huge type, scroll-driven scenes, premium and eye-catching.
- **Component sources:** Canvas UI (canvasui.dev) and 21st.dev first, then React Bits and Motion
  Primitives. Copy source in and restyle it to the site's tokens rather than adding dependencies
  where possible. Check each licence (Canvas UI is MIT with the Commons Clause).
- **Voice on client work:** everything was done by Rigan personally, none of it under the studio
  name. The site says "our founder has worked with", never that the studio did it.
- **Stack default:** Next.js App Router with static export and GitHub Pages, as on the portfolio,
  unless a WebGL or hosting need argues otherwise.

## What the studio has to show

**Products** (org: github.com/verastack-labs)

| Product | What it is | Public page | Look |
| --- | --- | --- | --- |
| rigseed | Tauri desktop client for qBittorrent, brings its own daemon | verastack-labs.github.io/rigseed/ | Dark, slate blue accent #8FB0CB |
| Riggit | Tauri desktop app | verastack-labs.github.io/riggit/ | Dark, green accent #34D399 |
| Mehfil | Next.js PWA | none yet (mehfil repo exists) | Cream with vermilion #B93E29 and saffron |

Each product has `-app`, `-internal` (roadmap and planning) and landing-page repos in the org.

**Founder's client work** (details in `../work-history.txt` and the portfolio's case studies)

- Ultraviolette, X-47 configurator (2025, as an employee). Live at ultraviolette.com/configure.
- E3 Electric.AI, TRION launch site (2026, freelance). Framer, with a custom configurator in React
  code components and a Razorpay pre-booking flow. Live at e3electric.ai.
- Maven Consultancy (event registration with emailed QR passes), Pee Empro Exports (Android QR
  attendance with CSV export), Suggaa Ventures (payments, cancellation flows, pricing data).
- PixelStack Studio, a design and development agency's site (client project, in progress).

**Visual references** already explored: minhpham.design (for the portfolio), and the cinematic
mockups in `../.superpowers/brainstorm/*/content/visual-direction.html`.

## Open questions (answer these first)

1. **Purpose.** Is the site for selling services to clients, for showing off the products, or both?
   Which one leads?
2. **Services.** If it sells services, which ones? For example websites, configurators and
   commerce flows, desktop apps, design.
3. **Domain and repo.** `verastack-labs/verastack-labs.github.io` would serve at the org root
   without disturbing the product pages under `/rigseed/` and `/riggit/`. A custom domain?
4. **Brand.** Does VeraStack Labs have a logo, wordmark, colours or type yet, or is this where
   they get made?
5. **Team.** Founder only, or other members to present?
6. **Contact.** Enquiry form, email, or a booking link (Cal.com or Calendly)? A static site needs a
   form service for a form.
7. **Pages.** One long page, or home plus product pages, work and contact?
8. **Budget for spectacle.** How much WebGL is acceptable on phones? The portfolio caps it at two
   effects on screen, lazily loaded, desktop only.

## How to start

1. Open a new conversation at the workspace root (`Documents/claude/portfolio`) and point it at
   this brief.
2. Brainstorm the open questions, then browse Canvas UI and 21st.dev together with the visual
   companion to shortlist hero, section-transition and text effects.
3. Write the spec, create the repo alongside `riganb.github.io/` in this workspace, and build it
   in phases with a PR per phase, as the portfolio was.
