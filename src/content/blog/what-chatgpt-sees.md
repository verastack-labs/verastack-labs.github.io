---
title: What *ChatGPT sees* when it reads your homepage
description: Most AI crawlers never run JavaScript, so a page that looks rich in a browser can reach ChatGPT almost blank. How to check yours in ten seconds, and how to fix it.
date: 2026-10-23
time: 18:30
category: ai-search
hook: See your own page the way ChatGPT's crawler gets it, word for word, with no JavaScript run. Free, one page at a time.
hookCta: See what ChatGPT sees | /tools/what-ai-sees
checkCompare: 37% of the 532 homepages we've scanned send under 500 words before JavaScript runs. Where does yours land?
tags: AEO, GEO, JavaScript, rendering
---

Open your homepage in a browser and you see the whole thing: the headline, the product shots, the pricing, the customer logos. Now ask what ChatGPT's crawler sees when it visits the same address. For a lot of sites, the honest answer is a title, a few menu words and an empty `<div id="root">`.

That gap is invisible from the browser, which is why it goes unnoticed for months.

## Why the crawler gets a different page

A browser downloads your HTML and then runs your JavaScript, which draws the rest of the page. Most AI crawlers stop at the first step. When Vercel looked at crawler traffic across its network, [none of the major AI crawlers rendered JavaScript](https://vercel.com/blog/the-rise-of-the-ai-crawler), OpenAI's and Anthropic's included (December 2024). They fetch the files, but they don't run them.

So if your words only exist after JavaScript runs, ChatGPT, Claude and Perplexity read the empty shell. Google is the exception: Googlebot renders JavaScript, and Gemini uses Google's crawling.

<!-- hook -->

## How common it is

Across the 532 homepages we've scanned this autumn (YC startups, SaaS, Indian D2C brands and software studios), **37% send fewer than 500 words in their HTML, and 17% send fewer than 200**. At 200 words an engine can barely tell what a company does, never mind who it's for or what it costs.

These are not neglected sites. Plenty of them look sharp in a browser. They're built as single-page apps, or behind a site builder setting that draws the content in the browser, and nobody ever looked at the raw HTML.

## How to check yours

Our free tool, [What ChatGPT sees](/tools/what-ai-sees/), fetches one page the way an AI crawler does and shows you exactly what it gets: the title, the description, then every heading, paragraph and list item in order, with a word count.

Three outcomes are common:

- **Almost blank (under 50 words).** The page is drawn by JavaScript. To most AI crawlers there's nothing here.
- **Thin (under 200).** Some words arrive, usually the navigation and a headline, but not enough to explain what you do.
- **Readable (500 and up).** Your words are in the HTML. The next question is whether engines name you, which takes more than a readable page.

## How to fix a blank page

The fix is to send the words in the HTML, so the first response already contains them.

- **Render on the server, or as static HTML.** Next.js, Astro, Nuxt and SvelteKit all do this, and Framer and Webflow publish static pages by default. A plain React app made with Vite does not, unless you add pre-rendering.
- **Check the parts that load late.** Pricing tables, FAQs and testimonials pulled in by a script after load are a common blind spot, even on server-rendered sites.
- **Put one plain paragraph near the top** that says what you are, who it's for and what it costs. It's the sentence an engine is most likely to lift into an answer.

Then run the page through the tool again and watch the word count jump.

## What this doesn't fix

A readable page is where AI search starts, not where it ends. Whether ChatGPT names you over a competitor also depends on your other pages, the questions you answer, how clearly you say who you are, and what other sites say about you. Our [AEO and GEO check](/tools/ai-search-check/) scores a page on sixteen of those signals, and the box below runs it on yours.

If the page turns out to be blank and the fix means moving off a JavaScript-only build, that's work we do: design, rebuild and launch, with the words where crawlers can read them.
