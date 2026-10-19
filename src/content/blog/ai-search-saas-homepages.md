---
title: AI search scores of *26 SaaS homepages*
description: Four perfect scores, four pages that are blank to crawlers. How 26 SaaS homepages read to ChatGPT and AI answers, and the three fixes that separate the top from the rest.
date: 2026-10-17
time: 11:25
category: studies
hook: Founders: send us your homepage and we'll tell you, on a free 30-minute call, exactly what's keeping it out of AI answers.
hookCta: Book a 30-min call | call
checkCompare: The median SaaS homepage in our study scored 77.5, and four scored 100. Where does yours land?
stat: 77.5 | median score of 26 SaaS homepages
tags: AI search, SaaS
---

Earlier today we published [how 96 Indian D2C stores read to AI search](/blog/ai-search-indian-d2c-brands). Shopify gave those stores a solid, similar floor: a median of 75 and a narrow spread. SaaS homepages are built every which way, so we expected a wider range. We got one.

We ran 27 SaaS homepages through the same [AI search check](/tools/ai-search-check): sixteen checks of how well ChatGPT, Perplexity, Claude and Google's AI answers can read a page. One site's bot protection turned the checker away, which leaves 26. They are mostly companies whose founders are active on LinkedIn, in the US and Europe: a handpicked list, not a random sample of SaaS.

## The scores

- **Median 77.5,** a little above the D2C stores.
- **Four perfect 100s.** No D2C store got above 91.
- **Four pages that are close to blank.** They send 50 words of HTML or fewer before JavaScript runs.
- **13 of 26 under 80.**

<!-- hook -->

## The top of the table

Scores as of 17 October 2026. Each links to a live re-check.

| Company | Score |
| --- | --- |
| [Sitefire](/tools/ai-search-check/?url=sitefire.ai) | 100 |
| [Fastshot](/tools/ai-search-check/?url=fastshot.ai) | 100 |
| [Revnu](/tools/ai-search-check/?url=revnu.com) | 100 |
| [screenpipe](/tools/ai-search-check/?url=screenpipe.com) | 100 |
| [TesterArmy](/tools/ai-search-check/?url=tester.army) | 97 |
| [RB2B](/tools/ai-search-check/?url=rb2b.com) | 92 |
| [Waalaxy](/tools/ai-search-check/?url=waalaxy.com) | 90 |
| [Financial Datasets](/tools/ai-search-check/?url=financialdatasets.ai) | 88 |
| [lemlist](/tools/ai-search-check/?url=lemlist.com) | 88 |
| [Omniconvert](/tools/ai-search-check/?url=omniconvert.com) | 86 |
| [Kuli](/tools/ai-search-check/?url=kuli.one) | 86 |
| [folk](/tools/ai-search-check/?url=folk.app) | 86 |

The four perfect scores share a pattern (and one of them, Sitefire, works on AI search visibility for a living): about a thousand words of plain HTML, the company and the product both described in structured data, an FAQ marked up for machines, and an llms.txt. Nothing exotic. Every item is a day's work or less.

## What separates the top from the rest

**1. A page that is only JavaScript.** Four homepages send almost no text in their HTML: the page is built in the browser. Many AI crawlers don't run JavaScript, so to them the page is empty, however good it looks. Server rendering or static generation fixes it, and most modern frameworks do it out of the box once it's switched on.

**2. Nothing says who you are or what you sell.** 11 of 26 have no Organization in their structured data, and 14 don't describe the product either. A model then has to guess what the company is from scattered text, and a guess is how you end up described by a competitor's comparison page instead of your own.

**3. No FAQ.** 16 of 26 have none. A buyer's questions ("Does it work with HubSpot?", "Is there a free plan?") answered in a sentence each tell a buyer, and any engine reading the page, exactly what they asked.

Then the cheap ones. 14 of 26 have no llms.txt, where Shopify stores get one for free; SaaS sites have to write their own, and it takes an hour. Four have no sitemap.

## D2C and SaaS side by side

| | D2C stores (96) | SaaS homepages (26) |
| --- | --- | --- |
| Median score | 75 | 77.5 |
| Best | 91 | 100 |
| Under 80 | 74% | 50% |
| Serve an llms.txt | 92% | 46% |
| No FAQ | 74% | 62% |

The platform sets the floor. Shopify stores all start in the same place and few rise far above it. A custom-built SaaS site can reach 100, or ship a page AI crawlers can't read at all.

## What this does and doesn't say

This measures how readable a homepage is to AI search, not whether ChatGPT recommends the product. Readable is the part you control on your own site; being recommended also depends on what review sites, comparison posts and communities say about you.


<section class="method" aria-labelledby="method-title">
<h2 id="method-title">How we measured</h2>
<dl>
<dt>What we checked</dt><dd>SaaS companies whose founders are active on LinkedIn, from a list we keep for outreach, so not a random sample of SaaS: the homepage of each, 26 scored of 27 attempted. The full list is below.</dd>
<dt>When</dt><dd>17 October 2026, one run per site.</dd>
<dt>With what</dt><dd>Our free <a href="/tools/ai-search-check">AEO and GEO check</a>, with its sixteen weighted checks as they stood that day (crawler access, text in the server HTML, structured data, answers to buyers' questions, titles and descriptions, llms.txt, sitemap, freshness and more) (<a href="https://github.com/verastack-labs/verastack-labs.github.io/blob/main/workers/aeo-check/src/score.ts">the scoring code</a>). It reads the HTML the server sends, without running JavaScript, plus robots.txt, llms.txt and the sitemap. On 18 October 2026 we changed the FAQ check to count questions answered on the page; this study used the earlier rule, which looked for FAQPage markup or two or more question headings.</dd>
<dt>What the score means</dt><dd>A score out of 100: the weighted share of the sixteen checks a page passes, with a partial pass earning a third of its weight. A page that blocks AI crawlers or asks not to be indexed is capped at 40. It measures how readable a page is to AI search, not whether any AI answer names or recommends the company.</dd>
<dt>Limits</dt><dd>One page per site, one run, one day; sites change, so a fresh check may differ. Every score named in this post links to a live re-check.</dd>
<dt>Per-site results</dt><dd>We name only the top scorers in public. Each company can have its own full report from us; anyone can run any site on the check and see its score today.</dd>
</dl>
<details><summary>All 26 sites we scored</summary><ul class="method-list"><li><a href="https://acquire.com">Acquire.com</a></li><li><a href="https://breakcold.com">Breakcold</a></li><li><a href="https://clay.com">Clay</a></li><li><a href="https://usecrunched.com">Crunched</a></li><li><a href="https://fastshot.ai">Fastshot</a></li><li><a href="https://financialdatasets.ai">Financial Datasets</a></li><li><a href="https://folk.app">folk</a></li><li><a href="https://gojiberry.ai">Gojiberry AI</a></li><li><a href="https://keyplay.io">Keyplay</a></li><li><a href="https://kit.com">Kit</a></li><li><a href="https://kuli.one">Kuli</a></li><li><a href="https://lavender.ai">Lavender</a></li><li><a href="https://lemlist.com">lemlist</a></li><li><a href="https://heylua.ai">Lua AI</a></li><li><a href="https://menza.ai">Menza</a></li><li><a href="https://agent.nexus">Nexus</a></li><li><a href="https://omniconvert.com">Omniconvert</a></li><li><a href="https://openroll.com">Openroll</a></li><li><a href="https://talentpluto.com">Pluto</a></li><li><a href="https://rb2b.com">RB2B</a></li><li><a href="https://relay.app">Relay.app</a></li><li><a href="https://revnu.com">Revnu</a></li><li><a href="https://screenpipe.com">screenpipe</a></li><li><a href="https://sitefire.ai">Sitefire</a></li><li><a href="https://tester.army">TesterArmy</a></li><li><a href="https://waalaxy.com">Waalaxy</a></li></ul><p>1 more could not be reached on the day, so they were not scored.</p></details>
</section>

## Check your own

The check is free and takes about ten seconds: [run it on your homepage](/tools/ai-search-check). If you'd rather we made the fixes, [tell us about your product](/#contact).
