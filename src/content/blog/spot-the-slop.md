---
title: Spot the slop: what an AI-built launch page gets wrong
description: We asked an AI site builder for a launch page and built the same page ourselves. The AI one looks fine. Here is where it quietly fails, and how to check yours.
date: 2026-10-17
time: 16:30
category: launches
hook: Built your launch page with an AI tool? Book a free 30-minute call and we'll go through it with you: what to cut, what to fix, what to keep.
hookCta: Book a 30-min call | call
checkCompare: The AI-built Bookwell page scored 54; ours scored 100. Check your own launch page.
tags: AI search, launches, design
---

AI site builders have got good. Ask one for a launch page and a minute later you have something that looks finished: a clean hero, a pricing table, a few kind words from customers. That is exactly the problem. Slop used to look bad. Now it looks fine, and fails where you can't see.

We ran the test properly. We made up a product, Bookwell, an appointment booking app for small clinics, and gave one popular AI builder, Lovable, a single plain prompt: a launch page with a hero, features, pricing, testimonials and a call to action. Then we built the same product's page the way we'd build it for a client. Both are live, so you can check everything below yourself:

- [The AI-built page](https://bookwell-launchpad-app.lovable.app/)
- [The page we built](/examples/bookwell)

Bookwell isn't a real company. Neither page is selling anything.

![The AI-built Bookwell page: a serif headline, "Fewer phone calls. Fuller days.", on cream, with a calendar mockup](/blog/spot-the-slop/ai-builder.webp)

![The Bookwell page we built: "Appointment booking for small clinics." in a heavy sans-serif, navy and coral, with a phone showing the booking screen](/blog/spot-the-slop/built-properly.webp)

Or scroll both, live, side by side:

<div class="pair">
<figure><iframe src="https://bookwell-launchpad-app.lovable.app/" title="The AI-built Bookwell page, live" loading="lazy"></iframe><figcaption>AI-built · 54/100</figcaption></figure>
<figure><iframe src="/examples/bookwell/" title="The Bookwell page we built, live" loading="lazy"></iframe><figcaption>Built properly · 100/100</figcaption></figure>
</div>

## What the AI got right

Credit first, because it earned some. The page is tidy and readable. The headline, "Fewer phone calls. Fuller days.", is a good line. There's a title, a meta description and link previews, robots.txt lets search engines in, and some of the text is in the HTML the server sends, which plenty of hand-built sites still get wrong. As a first draft it's a real head start.

## Where it quietly fails

**1. It invents proof.** The page quotes three doctors by name, at three named clinics, saying how much Bookwell changed their week. None of them exist. It also promises reminders that "cut no-shows by up to 40%", a number nobody measured, and three price plans nobody chose. To the tool's credit, it said so: it listed what it had made up and asked for the real details. But a founder in a hurry ships the page, and now the launch is built on quotes a customer could check and find empty. That's the slop: not the look, the made-up parts that read as true.

**2. Machines can't tell what it is.** We ran both pages through our [AI search check](/ai-search-check), the sixteen checks we use for how well ChatGPT, Perplexity and Google's AI answers can read a page. On 17 October the AI-built page scored **54 out of 100**. It has no structured data saying who is behind it or what it sells, no questions and answers for an engine to quote, no canonical address, no sitemap and no llms.txt. Its server HTML carries about 230 words. An AI answer asked "what's a good booking app for a small clinic?" has very little here to go on.

**3. It looks like everything else.** Calm green on cream, a soft serif headline, rounded cards: the safe "trustworthy software" look. It isn't ugly. It's just the average of a thousand pages, so it says nothing about this product. We noticed because our own first draft of Bookwell drifted to the same serif and nearly the same green before we caught it and gave Bookwell a look of its own. The pull toward the average is real, for people and for tools.

<!-- hook -->

## What we did differently

Our version is the same product, built the way we'd build it for a client:

- **Its own brand.** A heavy geometric sans and navy with a warm coral, picked for this product, not the category.
- **Copy that says what it is and who it isn't for.** "Appointment booking for small clinics", how it works in three steps, and a plain line that hospitals already on a hospital system don't need it.
- **Honest gaps instead of invented proof.** The testimonials section says Bookwell launches with three pilot clinics and that their words go there once they're real. The example price is labelled as an example.
- **Built for machines too.** Over 500 words in the server HTML, structured data for the product and who made it, a real FAQ marked up for answer engines, a canonical address.

On the same check, it scores **100**.

## Before you ship an AI-built page

AI builders are a good first draft and a bad final one. Before yours goes live:

1. **Delete anything you can't back up.** Every quote, logo, number and "trusted by". An empty section beats a fake one.
2. **Say who it's for in one plain sentence**, and who it isn't for.
3. **Make it look like you**, not like the category. Pick the colour and type on purpose.
4. **Check the parts you can't see.** Structured data, an FAQ, a sitemap, and text in the HTML the server sends.
5. **Run it through a checker.** [Ours is free](/ai-search-check) and takes ten seconds.

---

This is the kind of work we do: launches end to end, design to code, with a person on every call and AI search and a launch film built in. If you'd like your launch built that way, [tell us about it](/#contact).
