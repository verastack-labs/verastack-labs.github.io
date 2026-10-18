---
title: AI search scores of *YC Summer 2026*, by space
description: We checked 226 YC Summer 2026 homepages for how well ChatGPT and AI answers can read them. Median 66, four perfect scores, and the leaders in each space.
date: 2026-10-17
time: 22:45
category: startups
hook: YC founder? Book a free 30-minute call and we'll go through your homepage with you, live: what's keeping it out of AI answers and what to fix before your next raise.
hookCta: Book a 30-min call | call
checkCompare: The median YC Summer 2026 homepage scored 66 out of 100. See where yours lands.
stat: 66 | median score of 226 YC homepages
tags: YC, AI search, startups
---

A new Y Combinator batch is the most-watched set of launches in startups. Investors, customers and journalists all look the companies up, and more and more of them do it by asking ChatGPT or Perplexity instead of searching. So we asked a simple question: when an AI answer goes looking for this batch, how much can it actually read?

We took every company in YC's Summer 2026 batch that lists a website, 226 of them, and ran each homepage through our [AI search check](/tools/ai-search-check) on 17 October 2026. It's the same sixteen checks we used on [Indian D2C stores](/blog/ai-search-indian-d2c-brands) and [SaaS homepages](/blog/ai-search-saas-homepages), so the numbers compare.

## The scores

- **Median 66 out of 100,** the lowest of our three studies so far. D2C stores sat at 75 and established SaaS at 77.5.
- **Four perfect scores** and 21 companies at 90 or above.
- **31 under 50,** and 30 homepages send 50 words of HTML or fewer before JavaScript runs, which is close to blank for many AI crawlers.

| Score | Companies |
| --- | --- |
| 90 to 100 | 21 |
| 80 to 89 | 32 |
| 70 to 79 | 47 |
| 60 to 69 | 44 |
| 50 to 59 | 51 |
| Under 50 | 31 |

None of this is a surprise for companies that are months old. A YC homepage is often a weekend build made to get the first ten customers, and it does that job. The point is that the same page is now also how a model decides what the company is.

<!-- hook -->

## The leaders in each space

The top three in every space with six or more companies, by the batch's own categories. Scores as of 17 October 2026; each links to a live re-check, so you can see where it stands today.

| Space | Companies | Median | Top three |
| --- | --- | --- | --- |
| Industrials | 57 | 58 | [Agency Tool Company](/tools/ai-search-check/?url=agencytool.com) 93, [Neuron Industries](/tools/ai-search-check/?url=neuronindustries.com) 91, [Torus](/tools/ai-search-check/?url=usetorus.com) 88 |
| Other B2B software | 42 | 63 | [OpenTag](/tools/ai-search-check/?url=tryopentag.com) 100, [Zomma](/tools/ai-search-check/?url=zommalabs.com) 97, [Marble](/tools/ai-search-check/?url=joinmarble.ai) 90 |
| Infrastructure | 25 | 68 | [Codag](/tools/ai-search-check/?url=codag.ai) 95, [Context.dev](/tools/ai-search-check/?url=context.dev) 95, [Edviro](/tools/ai-search-check/?url=edviroenergy.com) 93 |
| Healthcare | 22 | 69 | [Avoca Systems](/tools/ai-search-check/?url=avocasystems.com) 88, [Hubble](/tools/ai-search-check/?url=hubble.ai) 88, [Lumeria](/tools/ai-search-check/?url=lumeria.skin) 84 |
| Fintech | 15 | 60 | [Pennant](/tools/ai-search-check/?url=getpennant.ai) 90, [Stoa](/tools/ai-search-check/?url=stoaexchange.com) 84, [Qlo](/tools/ai-search-check/?url=getqlo.com) 76 |
| Engineering and design tools | 12 | 75 | [Graphify Labs](/tools/ai-search-check/?url=graphify.com) 88, [Rindler (Maxxwell)](/tools/ai-search-check/?url=maxxwell.dev) 86, [OpenRelay](/tools/ai-search-check/?url=openrelay.inc) 84 |
| Consumer | 9 | 74 | [Tsenta](/tools/ai-search-check/?url=tsenta.com) 100, [Moonshot](/tools/ai-search-check/?url=moonshot.computer) 93, [Egoist Machines](/tools/ai-search-check/?url=ego.ist) 90 |
| Supply chain and logistics | 8 | 70 | [Whitespace](/tools/ai-search-check/?url=whitespacehq.ai) 90, [Donkey](/tools/ai-search-check/?url=donkey.trade) 78, [Peer](/tools/ai-search-check/?url=peer-freight.com) 77 |
| Real estate and construction | 6 | 69.5 | [FlowManual](/tools/ai-search-check/?url=flowmanual.com) 97, [Alloovium](/tools/ai-search-check/?url=alloovium.com) 80, [Atlia](/tools/ai-search-check/?url=atlia.com) 79 |
| Security | 6 | 65 | [Trident](/tools/ai-search-check/?url=tridentsecurity.io) 93, [NebuSec](/tools/ai-search-check/?url=nebusec.ai) 90, [Traceforce](/tools/ai-search-check/?url=traceforce.ai) 68 |

The four perfect scores: [OpenTag](/tools/ai-search-check/?url=tryopentag.com), [Rex](/tools/ai-search-check/?url=rex.inc), [Tsenta](/tools/ai-search-check/?url=tsenta.com) and [screenpipe](/tools/ai-search-check/?url=screenpipe.com), which also scored 100 in our SaaS study. What they share is not a big budget. Each has plain text that says what the product is, structured data for the company and the product, a marked-up FAQ and an llms.txt.

## What most of the batch is missing

The gaps are the same ones we keep finding, only wider:

- **No FAQ:** 86% of homepages. The questions buyers ask go unanswered on the page.
- **Nothing that describes the product to machines:** 80% have no Product, Service or SoftwareApplication data.
- **No llms.txt:** 63%. It takes an hour to write.
- **Nothing that says who the company is:** 49% have no Organization data, so a model has to guess whether "Atlas" or "Nova" is them or one of the dozen other companies with that name.
- **No sitemap:** 32%. **No canonical address:** 31%.

## Five fixes for a batch-stage homepage

1. **Put the one-line pitch in the HTML,** not only in an animation. "X is Y for Z", in text a crawler can read.
2. **Add Organization and product structured data,** with links to your LinkedIn, X and YC company page, so engines know which company you are.
3. **Write five questions buyers ask,** answer each in two sentences, and mark them up as FAQPage.
4. **Add an llms.txt and a sitemap.** Two files, an hour together.
5. **Re-check after every redesign.** Early sites change weekly, and so do these scores.

## What this does and doesn't say

This measures how readable a homepage is to AI search, not how good the company is or whether ChatGPT recommends it. It is one page per company, checked on one day, and only the 226 companies in the batch that list a website.

## Check your own

The check is free and takes about ten seconds: [run it on your homepage](/tools/ai-search-check). If you'd rather we made the fixes, [tell us about your startup](/#contact).
