---
title: We ran 96 Indian D2C sites through an AI search check
description: Median score 75, nobody above 91. What Indian D2C homepages get right for ChatGPT and AI answers, the two gaps almost all of them share, and who leads.
date: 2026-10-17
time: 11:15
category: studies
hook: Run a Shopify store? The median here was 75. Check yours in ten seconds; if it's under 80, the two fixes almost every store needs are a day's work, and we can do them for you.
hookCta: Check my store | /ai-search-check
checkCompare: The median Indian D2C homepage in our study scored 75 out of 100. See where yours lands.
tags: AI search, D2C, Shopify
---

More shoppers now ask an AI before they search: "best natural hair oil brand in India", "where to buy block-printed kurtas online". The answer names a few brands and links a few pages. We wanted to know how ready Indian D2C brands are to be one of those names, so we ran 99 of them through our [AI search check](/ai-search-check).

The sample is random: 99 brands from the 886 listed on d2cstory.com, skincare to snacks to furniture. Three sites turned the checker away or were down, which leaves 96 homepages, all checked on 17 October 2026 with the same sixteen checks anyone can run on our site.

<!-- hook -->

## The scores

- **Median 75 out of 100.** The middle of the pack is decent and nowhere near done.
- **Nobody above 91.** Three brands tie at the top.
- **71 of 96 score under 80.** Two score under 50.

That is a better start than we expected, and the reason is mostly Shopify. Most of these stores run on it, and it gets a lot right by default.

## What almost everyone gets right

- **The crawlers are let in.** Not one site blocks the crawlers that power ChatGPT search, Perplexity or Claude. Two block GPTBot, OpenAI's training crawler, which is a fair choice.
- **The words are in the HTML.** The median homepage sends about 1,400 words of real text before any JavaScript runs. Crawlers that skip JavaScript still see what the brand sells.
- **llms.txt is everywhere.** 87 of 96 serve one with a title and links. That is Shopify generating it, not 87 marketing teams, but it counts.
- **Most say who they are.** 64 describe the brand in structured data with a logo and links to their social profiles, which is how a model tells one brand from a namesake.

## The two gaps almost everyone shares

**1. The homepage doesn't say what you sell, in a form machines read.** 91 of 96 homepages have no structured data for their products: no Product, no ItemList, no Offer. Product pages often have it; the homepage, which is where a model starts when someone asks about the brand, usually describes only the company and the website. Adding an ItemList of best sellers, or Product data for the hero range, fixes it.

**2. No answers to the questions shoppers ask.** 71 of 96 have no FAQ at all, and another 14 have questions on the page but no FAQPage markup. Question-and-answer pairs are the easiest thing for an AI answer to lift and quote. "Is it safe for sensitive skin?", "How long does delivery take in Bangalore?", "What's the difference between the two blends?" Five of those, answered in a sentence or two each, marked up as FAQPage.

The smaller ones: 51 meta descriptions are too long, too short or written as a keyword list, and 41 titles are outside the length a results page shows in full. Each is a ten-minute fix.

## Who leads

Scores as of 17 October 2026. Each one links to a live re-check, so you can see where it stands today.

| Brand | Score |
| --- | --- |
| [WOD Armour](/ai-search-check/?url=wodarmour.in) | 91 |
| [Silvertraq](/ai-search-check/?url=silvertraq.com) | 91 |
| [Explosive Whey](/ai-search-check/?url=explosivewhey.com) | 91 |
| [TrustBasket](/ai-search-check/?url=trustbasket.com) | 87 |
| [Libas](/ai-search-check/?url=libas.in) | 86 |
| [Pelican Essentials](/ai-search-check/?url=pelicanessentials.com) | 86 |
| [WROGN](/ai-search-check/?url=wrogn.com) | 84 |
| [Selected Homme](/ai-search-check/?url=selectedhomme.in) | 84 |
| [Slurrp Farm](/ai-search-check/?url=slurrpfarm.com) | 84 |
| [Neesh Perfumes](/ai-search-check/?url=neeshperfumes.com) | 84 |

What the top three share: the brand described in structured data with its social profiles, questions answered on the homepage, and clean descriptions. None is perfect, and each is one or two fixes from 100. Silvertraq and Explosive Whey already mark up their FAQs but don't describe their products on the homepage; WOD Armour has questions on the page without the FAQ markup, and a ten-character title.

## What this does and doesn't say

This measures how readable a homepage is to AI search, not whether ChatGPT recommends the brand. Being readable is the part a brand controls on its own site. Being recommended also depends on what other sites say: reviews, marketplaces, listicles, Reddit. A readable site is the floor, not the ceiling.

It is also one page per brand. A brand with great product pages and a thin homepage will score lower here than its catalogue deserves.

## Check your own

The check is free, takes about ten seconds and shows your top three fixes: [run it on your site](/ai-search-check). If you'd rather we made the fixes, [tell us about your store](/#contact).
