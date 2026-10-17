---
title: AI search for SaaS: what ChatGPT reads before it recommends you
description: Buyers now ask ChatGPT and Perplexity which tool to use. What those answers are built from, and the five fixes that get your product named.
date: 2026-10-17
time: 09:30
category: ai-search
hook: Not sure how your SaaS reads to ChatGPT? Book a free 30-minute call and we'll walk through your homepage with you, live.
hookCta: Book a 30-min call | call
tags: AI search, SaaS, SEO
---

Buyers still search, but more and more of them ask. "What's a good booking tool for a clinic in Bangalore?" "Which analytics tool works without cookies?" The answer comes back as a short list, and if your product isn't on it, a whole page of blue links you might have ranked in never gets seen.

Getting onto that list is called answer engine optimisation, or AEO. It sounds new, but most of it is plain, careful SEO done for a reader that happens to be a model. Here is what that reader actually looks at, and what we'd fix first on a typical SaaS site.

## 1. Let the crawlers in

Answer engines can only quote what they can fetch. Each one sends its own crawler, and each can be blocked:

- **OAI-SearchBot** fetches pages for ChatGPT's search answers. **GPTBot** collects training data for OpenAI's models.
- **PerplexityBot** feeds Perplexity.
- **ClaudeBot** feeds Anthropic's Claude.
- **Google-Extended** controls whether Google may use your pages to train Gemini. It doesn't affect normal Search or AI Overviews, which use Googlebot.

Open `yoursite.com/robots.txt` and check none of these is disallowed by accident. Then check your CDN: some bot-protection settings block AI crawlers by default, and nobody on the team ever chose that.

## 2. Say what you are, in text a crawler can read

Plenty of SaaS homepages are a big animated headline, a product video and three clever words. A person gets it. A crawler that doesn't run your JavaScript gets almost nothing.

The test takes a minute: view your page source (not the inspector, the raw source) and search for the sentence a buyer would use to describe you. If it isn't there, the model can't learn it from you. Our own homepage is heavy on motion, and it still ships over a thousand words in the HTML the server sends: what we build, for whom, our work and how to reach us.

Then say it plainly somewhere: "X is a booking tool for clinics. It handles appointments, reminders and payments." One boring, quotable sentence beats a page of taglines.

## 3. Label the facts

Structured data is a small block of JSON on your page that labels facts for machines: this is the company, this is the product, this is the price, this is who founded it. Search engines have read it for years, and it's the cheapest way to make sure a model gets your basics right.

For a SaaS product, the useful types are `Organization`, `SoftwareApplication` (with its category, operating system and price), `Offer` and, where you have them, `FAQPage` and `Review`. Keep it honest and current. A price in your structured data that disagrees with your pricing page is worse than none.

## 4. Write an llms.txt

`llms.txt` is a proposed standard: a plain-text file at the root of your site that tells language models, in a few hundred words, what your company does and where the important pages are. No engine has promised to read it, so treat it as a bet, but it takes an hour to write and it forces you to describe yourself clearly, which helps everywhere else.

Ours is at [verastack.dev/llms.txt](https://verastack.dev/llms.txt). It lists our services, our founder's client work with press links, our own products and how to reach us, built from the same data as the page so it never drifts.

## 5. Be quoted by others

This is the part most teams miss. Answers lean heavily on pages you didn't write: comparison articles, "best tools for" listicles, review sites, Reddit threads, GitHub READMEs, docs from tools you integrate with. If those pages describe you wrongly, or not at all, fixing your own site only goes so far.

So find the five or six pages that answer engines keep citing for your category, and work out how to be on them accurately: a correction, a listing, a genuine comparison page of your own, an integration doc. It's slower than editing your homepage, and it usually matters more.

## How to tell if it's working

Make a short list of the questions your buyers ask, the way they'd actually phrase them. Once a month, ask them in ChatGPT, Perplexity and Google's AI Mode, and note who gets named and which pages get cited. It's crude, but it shows you where you stand and which sources to go after.

Alongside that, Search Console still shows the classic side: which queries bring people in, and which pages Google has indexed.

---

We do this work for clients as part of our AI search and SEO service, and our own site is the worked example: crawlers allowed, the story in plain HTML, labelled facts, an llms.txt. To see how one of your pages reads to an answer engine right now, run our [free AI search check](/ai-search-check). For the whole site, [tell us about it](/#contact).
