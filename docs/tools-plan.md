# Free tools plan (18 Oct 2026)

Rigan: build them all, one at a time, plan first. The only purpose is to bring in clients: each
tool has to be worth a visitor's time on its own, and has to make the case, with numbers, for why
the problem matters and why we are the team to fix it.

Every tool runs free for us: in the visitor's browser, or on the existing Cloudflare Worker (free
plan, 100,000 requests a day). No AI model API calls.

## The numbers we own

Across 379 homepages we scanned in October 2026 (226 YC Summer 2026, 96 Indian D2C stores, 26
SaaS, 25 software studios, 6 freshly funded startups), the share that fail or only partly pass:

| Gap | Share of 379 homepages | Tool that fixes it |
| --- | --- | --- |
| No FAQ an AI answer can quote | 80% none, 88% not passing | FAQ markup generator |
| Nothing describing what they sell | 81% | Product and service markup generator |
| Organization data missing or unlinked | 53% (39% none) | Organization markup generator |
| No llms.txt | 46% (50% not passing) | llms.txt generator |
| A meta description that reads as keywords or is missing | 35% | Meta description tester |
| Little or no text before JavaScript runs | 34% (16% fail) | "What ChatGPT sees" viewer |
| Link previews (Open Graph) broken or partial | 18% | Link preview checker |
| AI crawlers blocked in robots.txt | 3%, but it caps the score at 40 | AI crawler checker |

Source: `social-docs/research/studies/*/` scan data, recomputed for each tool page from the files so the numbers stay
true. Every tool page quotes its own row.

## Outside numbers (to source before tool 1)

One evidence sheet, `docs/why-ai-search-numbers.md`, with each figure, its source URL and the date
read, reused by every tool page and post. Only figures from the original publisher or a major
outlet; anything we cannot trace to its source does not go in. To find:

- How many people now use ChatGPT, Perplexity and Google's AI answers, and how often for buying
  research (OpenAI's own weekly user figures; Google's AI Overviews reach).
- What happens to clicks when an AI answer appears above the links (published click-through studies).
- How AI-referred visitors convert compared with search visitors (published analytics studies).
- How much of a buyer's shortlist now starts in an AI answer (B2B buyer surveys).

## What the evidence says (read before writing any tool copy)

`docs/why-ai-search-numbers.md` (sourced 18 Oct 2026). One finding shapes every structured-data tool:
there is no credible evidence that schema markup by itself raises AI citations (Google: no special
markup needed; Ahrefs' 2026 controlled test of 1,885 pages: no meaningful uplift). So the tools sell
the content (plain answers, clear facts, readable pages) and present markup as good practice that
labels it, never as a citation lever. Usable outside figures: Google AI Overviews 2.5 billion
monthly users (May 2026); Pew, 8% vs 15% clicks with and without an AI summary (2025); ChatGPT 900
million weekly users (Feb 2026); Forrester, 94% of B2B buyers use AI in buying (Jan 2026); Adobe,
AI-referred visitors converted 31% more over holiday 2025.

## The pattern every tool page follows

1. **One hard number in the hero,** from our table: "80% of the 379 homepages we checked have no
   FAQ an AI answer can quote."
2. **The tool,** useful on its own and ungated: the output is copied or downloaded free. Gating the
   output would make it not worth their time.
3. **Why it matters,** three short points with numbers (ours plus the evidence sheet).
4. **What this tool can't do,** the honest limit, which is the bridge: "this fixes one of the sixteen
   checks; the audit covers the rest and whether ChatGPT names you". Buttons: run the full AEO and GEO
   check (with their URL carried over), see the Launch Kit, book a 30-minute call.
5. **Optional email:** "email me this file and the steps" (Web3Forms, as on the checker), which lands
   as a lead tagged with the tool's name.
6. FAQPage and WebApplication structured data, listed on /tools and in llms.txt, with its own
   share image.

Each tool ships with a short blog post (how to fix the gap, our number, the tool embedded) and a
LinkedIn post through the Social chat, so every tool is also content.

## Order, one at a time

Ranked by how many sites have the problem, how quickly the fix shows on our checker, and effort.

| # | Tool | Where it runs | Effort | Why this position |
| --- | --- | --- | --- | --- |
| 1 | **FAQ markup generator**: add questions and answers (or start from a template for SaaS, studio, D2C), get FAQPage JSON-LD plus matching HTML, with a live preview. | Browser | Half a day | The most common gap (80%), and the quickest score jump |
| 2 | **Product and service markup generator**: describe what you sell (product, SaaS plan or service, price, who it is for), get the JSON-LD. | Browser | Half a day | 81% have nothing; pairs with 1 |
| 3 | **"What ChatGPT sees" viewer**: enter a URL, see the page as a crawler that skips JavaScript reads it, side by side with the word count. | Worker | One day | The most visual "aha": a blank page sells itself |
| 4 | **Organization markup generator**: name, logo, profiles, get the JSON-LD; it checks the profile links resolve. | Browser | A few hours | 53% |
| 5 | **llms.txt generator**: enter a URL, we read the homepage and sitemap and draft the file to edit and download. | Worker | Half a day | 50% |
| 6 | **Meta description tester**: paste or fetch, see length, the keyword-list warning, and a preview as Google and an AI answer would quote it. | Browser, optional fetch | A few hours | 35% |
| 7 | **Link preview checker**: how a URL looks shared on LinkedIn, X and WhatsApp, and what is missing. | Worker | One day | 18%, and founders feel it on launch day |
| 8 | **AI crawler checker**: which AI bots robots.txt lets in, and a corrected file. | Worker | Half a day | Rare (3%) but fatal when it happens |

Tools 1, 2 and 4 share one generator component (form, live JSON-LD, copy and download); 3, 5 and 7
share a Worker route that fetches one page safely, reusing the checker's address guard.

## How we know it works

- Cloudflare Web Analytics: visits per tool, and clicks through to the check, the kit and the call.
- Leads: the optional email lands tagged by tool; calls booked from a tool page carry a `?from=`
  note.
- Review after four weeks: keep promoting what brings calls, drop what does not.

## Per tool, done means

The tool works on desktop and phone, has tests for its output (valid JSON-LD, escaping, limits),
quotes its number from the scan data, passes its own check where relevant, is in /tools, the
sitemap and llms.txt, and has its blog post sent to the Social and Portfolio chats.
