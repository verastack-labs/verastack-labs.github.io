---
title: The *cobbler's shoes*: AI search scores of 25 software studios
description: We ran 25 software studios' own homepages through our AEO and GEO check. Median 81, and 21 of 25 have no FAQ an AI answer can quote. The top four, and the fixes.
date: 2026-10-18
time: 13:30
category: studies
hook: Run a studio or an agency? Book a free 30-minute call and we'll show you, live, what ChatGPT says when a buyer asks for a team like yours.
hookCta: Book a 30-min call | call
checkCompare: The median software studio homepage scored 81 out of 100. Where does yours land?
stat: 81 | median score of 25 studios
tags: AI search, studios, AEO
---

Studios build websites for a living, so you would expect their own to be the best-read on the web. Buyers looking for a development partner now ask ChatGPT or Perplexity for "a React Native agency in Europe" or "a Rails consultancy for a rebuild", so we checked how well 25 software studios' own homepages read to those answers.

Each homepage went through our [AEO and GEO check](/tools/ai-search-check) on 18 October 2026: the same sixteen checks we used on [YC Summer 2026](/blog/yc-summer-2026-ai-search), [SaaS homepages](/blog/ai-search-saas-homepages) and [Indian D2C stores](/blog/ai-search-indian-d2c-brands).

## The scores

- **Median 81 out of 100.** Better than the YC batch (66) and established SaaS (77.5), which is what you would hope from people who build sites.
- **10 of 25 scored under 75.**
- **The top four:** [Atomic Object](/tools/ai-search-check/?url=atomicobject.com) and [Test Double](/tools/ai-search-check/?url=testdouble.com) at 93, [Mobisoft Infotech](/tools/ai-search-check/?url=mobisoftinfotech.com) at 91 and [Infinum](/tools/ai-search-check/?url=infinum.com) at 90. Each link runs a fresh check, so you can see where they stand today.

| Score | Studios |
| --- | --- |
| 90 to 100 | 4 |
| 80 to 89 | 10 |
| 70 to 79 | 3 |
| Under 70 | 8 |

The good news first: every studio lets the AI search crawlers in, and no homepage is blank to a crawler that skips JavaScript. The basics are done. What separates the top from the middle is the layer above them.

<!-- hook -->

## What most studios are missing

- **No FAQ: 21 of 25.** The questions a buyer asks a studio are predictable: what do you cost, how long does it take, do you work with startups, which stack. Plain, short answers to those questions on the page are exactly what an AI answer can lift. Almost nobody has them.
- **Services nobody can read as services: 18 of 25.** The homepage lists apps, websites, AI and staffing in prose, but none of it is labelled as a Service in structured data, so a model has to guess what is on offer.
- **No llms.txt: 11 of 25.** It takes an hour to write.
- **No Organization data at all: 6 of 25,** and 3 more have it without links to their other profiles. Studio names are often common words, so without it a model has to guess which company of that name it is reading about.

## Three fixes, one afternoon

1. **List what you build as services.** One Service entry in the JSON-LD per offer: apps, websites, AI, team extension. Name, a one-line description, who it is for.
2. **Answer the buyer's questions.** Price range, process, timeline, who you work with, where you are. Two sentences each, marked up as FAQPage.
3. **Say who you are.** Organization data with your logo and links to your LinkedIn, Clutch and GitHub.

Our own site scores 100 on the same check; these three and an llms.txt are most of the difference.

## What this does and doesn't say

This measures how readable a homepage is to AI search, not how good a studio's client work is. It is one page per studio, checked on one day.

## Check your own

The check is free and takes about ten seconds: [run it on your homepage](/tools/ai-search-check). If you would rather we made the fixes, or you are launching something of your own, see the [SaaS Launch Kit](/launch-kit) or [tell us about it](/#contact).
