# D2C AI-visibility study

Growth plan idea 3. Working title: **"We asked ChatGPT about 99 Indian D2C brands. Here's who gets named."**
Started 2026-10-17. Internal until published; the write-up lands as a blog post, LinkedIn
carousels and press pitches.

## The question

When Indian shoppers ask an AI assistant what to buy, which D2C brands get named, and does how
well a brand's own site reads to machines have anything to do with it?

## The sample

99 Indian D2C brands in `brands.csv`, from the AEO outreach batches (`social-docs/outreach/`,
built from a random scan of the 886 brands listed on d2cstory.com). Peer Drinks was dropped:
peerdrinks.com now serves a lottery spam page, so the domain has lapsed or been taken over.

Caveat to state in the write-up: the sample is random within d2cstory.com's list, not the whole
market, and skews to brands with their own Shopify stores.

## Part A: how each site reads to machines (running)

`scan.mjs` runs every homepage through the live AI search check (sixteen checks, the same
scoring visitors get at verastack.dev/ai-search-check) and saves the full reports to
`scan.json`. `node docs/study/d2c-ai-visibility/scan.mjs` from the repo root, about 12 minutes.

What to pull out of it:

- The score spread: median, best, worst, share under 50.
- The most common failures, ranked: likely no FAQ, no Organization identity, keyword-list
  descriptions, thin server HTML.
- Who blocks AI crawlers, and which ones (GPTBot alone, or the search crawlers too).
- llms.txt: how many serve one (Shopify generates it), and how many of those are bare.

## Part B: who gets named (dropped, 2026-10-17)

Asking ChatGPT, Perplexity and Google AI Mode the questions shoppers ask, and recording who gets
named, was dropped. The APIs cost money, and doing it by hand in the free web versions takes
hours, so it is not worth it for now. Automating the web versions is no shortcut either: it breaks
their terms and runs into bot checks.

If it comes back, the plan was about ten categories, three questions each, three runs per engine,
a brand counting as named when it appears in two of three runs, with cited domains recorded.

## What the write-up can claim

- Part A on its own is publishable: "X of 99 D2C sites fail Y" is a concrete, checkable finding,
  and every brand can rerun its own check.
- Without Part B the post reports readiness, not visibility: "how these sites read to AI search",
  never "who ChatGPT recommends".
- Praise in public, critique in private. The post names the best scorers (with dated scores and a
  live re-check link) and gives failures as patterns; low scorers hear their own score by email or
  DM, never in public.
