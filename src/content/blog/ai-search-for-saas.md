---
title: AI search for SaaS: what *ChatGPT reads* before it recommends you
description: Buyers now ask ChatGPT and Perplexity which tool to use. What those answers are built from, and the five fixes that get your product named.
date: 2026-10-17
time: 09:30
category: ai-search
hook: Not sure how your SaaS reads to ChatGPT? Book a free 30-minute call and we'll walk through your homepage with you, live.
hookCta: Book a 30-min call | call
tags: AI search, SaaS, GEO
---

Buyers still search, but more and more of them ask. "What's a good booking tool for a clinic in Bangalore?" "Which analytics tool works without cookies?" The answer comes back as a short list, and if your product isn't on it, a whole page of blue links you might have ranked in never gets seen.

Getting onto that list is called answer engine optimisation (AEO) or, more and more, generative engine optimisation (GEO): [two names for nearly the same work](/blog/geo-is-the-new-seo). It sounds new, but most of it is plain, careful SEO done for a reader that happens to be a model. Here is what that reader actually looks at, and what we'd fix first on a typical SaaS site.

## 1. Let the crawlers in

Answer engines can only quote what they can fetch. Each one sends its own crawler, and each can be blocked:

- **OAI-SearchBot** surfaces sites in ChatGPT's search answers; **GPTBot** crawls for training OpenAI's models ([OpenAI](https://developers.openai.com/api/docs/bots)).
- **PerplexityBot** surfaces and links sites in Perplexity's answers ([Perplexity](https://docs.perplexity.ai/guides/bots)).
- **Claude-SearchBot** and **Claude-User** fetch pages for Claude's answers; **ClaudeBot** collects content that may be used for training ([Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)).
- **Google-Extended** controls whether Google may use your pages to train Gemini; it does not affect inclusion in Google Search ([Google](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers)). For AI Overviews and AI Mode, Googlebot's rules in robots.txt are the control ([Google](https://developers.google.com/search/docs/appearance/ai-features)).

Open `yoursite.com/robots.txt` and check none of these is disallowed by accident. Then check your CDN: Cloudflare, for one, [changed its default to block AI crawlers](https://blog.cloudflare.com/content-independence-day-no-ai-crawl-without-compensation/) in July 2025, so a site can be shut out without anyone on the team choosing it.

## 2. Say what you are, in text a crawler can read

Plenty of SaaS homepages are a big animated headline, a product video and three clever words. A person gets it. A crawler that doesn't run your JavaScript gets almost nothing, and [none of the major AI crawlers rendered JavaScript](https://vercel.com/blog/the-rise-of-the-ai-crawler) in Vercel's 2024 study of its network.

The test takes a minute: view your page source (not the inspector, the raw source) and search for the sentence a buyer would use to describe you. If it isn't there, the model can't learn it from you. Our own homepage is heavy on motion, and it still ships over a thousand words in the HTML the server sends: what we build, for whom, our work and how to reach us.

Then say it plainly somewhere: "X is a booking tool for clinics. It handles appointments, reminders and payments." One boring, quotable sentence beats a page of taglines.

## 3. Label the facts

Structured data is a small block of JSON on your page that labels facts for machines: this is the company, this is the product, this is the price, this is who founded it. Search engines have read it for years ([Google's introduction](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)). It won't get you cited on its own: Google says AI answers [need no special markup](https://developers.google.com/search/docs/appearance/ai-features), and a 2026 Ahrefs test found [adding JSON-LD alone did not raise AI citations](https://ahrefs.com/blog/schema-ai-citations/). In our view it is still the cheapest way to keep your basics unambiguous.

For a SaaS product, the useful types are `Organization`, `SoftwareApplication` (with its category, operating system and price), `Offer` and, where you have them, `FAQPage` and `Review`. Keep it honest and current. A price in your structured data that disagrees with your pricing page is worse than none.

## 4. Write an llms.txt

`llms.txt` is a [proposed standard](https://llmstxt.org/): a plain-text file at the root of your site that tells language models, in a few hundred words, what your company does and where the important pages are. No engine has promised to read it, so treat it as a bet, but it takes an hour to write and it forces you to describe yourself clearly, which helps everywhere else.

Ours is at [verastack.dev/llms.txt](https://verastack.dev/llms.txt). It lists our services, our founder's client work with press links, our own products and how to reach us, built from the same data as the page so it never drifts.

## 5. Be quoted by others

This is the part most teams miss. In our view, answers lean heavily on pages you didn't write: comparison articles, "best tools for" listicles, review sites, Reddit threads, GitHub READMEs, docs from tools you integrate with. If those pages describe you wrongly, or not at all, fixing your own site only goes so far.

So find the five or six pages that answer engines keep citing for your category, and work out how to be on them accurately: a correction, a listing, a genuine comparison page of your own, an integration doc. It's slower than editing your homepage, and it usually matters more.

## How to tell if it's working

Make a short list of the questions your buyers ask, the way they'd actually phrase them. Once a month, ask them in ChatGPT, Perplexity and Google's AI Mode, and note who gets named and which pages get cited. It's crude, but it shows you where you stand and which sources to go after.

Alongside that, Search Console still shows the classic side: which queries bring people in, and which pages Google has indexed.

---

We do this work for clients as part of our AEO and GEO service, built on SEO, and our own site is the worked example: crawlers allowed, the story in plain HTML, labelled facts, an llms.txt. To see how one of your pages reads to an answer engine right now, run our [free AEO and GEO check](/tools/ai-search-check). For the whole site, [tell us about it](/#contact).

## Sources

- OpenAI, [Overview of OpenAI crawlers](https://developers.openai.com/api/docs/bots): what OAI-SearchBot and GPTBot do.
- Perplexity, [Perplexity crawlers](https://docs.perplexity.ai/guides/bots): what PerplexityBot does.
- Anthropic, [Does Anthropic crawl data from the web?](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler): ClaudeBot, Claude-User and Claude-SearchBot.
- Google Search Central, [Google's common crawlers](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers): Google-Extended and Search.
- Google Search Central, [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): controls for AI Overviews and AI Mode, and no special structured data needed.
- Google Search Central, [Introduction to structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data).
- Cloudflare, [Content Independence Day](https://blog.cloudflare.com/content-independence-day-no-ai-crawl-without-compensation/), 1 July 2025: AI crawlers blocked by default.
- Vercel, [The rise of the AI crawler](https://vercel.com/blog/the-rise-of-the-ai-crawler), 17 December 2024.
- Ahrefs, [schema and AI citations](https://ahrefs.com/blog/schema-ai-citations/), 2026: a controlled test of 1,885 pages.
- [llms.txt](https://llmstxt.org/): the proposal.
- Google, [Search Console](https://search.google.com/search-console/about).
- Our own view, not from a source: how much answers lean on pages you did not write. Our own site's numbers are from our check.

