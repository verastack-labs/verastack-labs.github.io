---
title: We ran 96 *Indian D2C sites* through an AI search check
description: Median score 75, nobody above 91. What Indian D2C homepages get right for ChatGPT and AI answers, the two gaps almost all of them share, and who leads.
date: 2026-10-17
time: 11:15
category: studies
hook: Run a Shopify store? The median here was 75. Check yours in ten seconds; if it's under 80, the two fixes almost every store needs are a day's work, and we can do them for you.
hookCta: Check my store | /tools/ai-search-check
checkCompare: The median Indian D2C homepage in our study scored 75 out of 100. See where yours lands.
stat: 75 | median score of 96 D2C stores
tags: AI search, D2C, Shopify
---

More shoppers now ask an AI before they search: "best natural hair oil brand in India", "where to buy block-printed kurtas online". The answer names a few brands and links a few pages. We wanted to know how ready Indian D2C brands are to be one of those names, so we ran 99 of them through our [AI search check](/tools/ai-search-check).

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

**2. No answers to the questions shoppers ask.** 71 of 96 have no FAQ at all, and another 14 have questions on the page but no FAQPage markup. Short, plain answers to real questions are easy for an AI answer to lift and quote. "Is it safe for sensitive skin?", "How long does delivery take in Bangalore?", "What's the difference between the two blends?" Five of those, answered in a sentence or two each, marked up as FAQPage.

The smaller ones: 51 meta descriptions are too long, too short or written as a keyword list, and 41 titles are outside the length a results page shows in full. Each is a ten-minute fix.

## Who leads

Scores as of 17 October 2026. Each one links to a live re-check, so you can see where it stands today.

| Brand | Score |
| --- | --- |
| [WOD Armour](/tools/ai-search-check/?url=wodarmour.in) | 91 |
| [Silvertraq](/tools/ai-search-check/?url=silvertraq.com) | 91 |
| [Explosive Whey](/tools/ai-search-check/?url=explosivewhey.com) | 91 |
| [TrustBasket](/tools/ai-search-check/?url=trustbasket.com) | 87 |
| [Libas](/tools/ai-search-check/?url=libas.in) | 86 |
| [Pelican Essentials](/tools/ai-search-check/?url=pelicanessentials.com) | 86 |
| [WROGN](/tools/ai-search-check/?url=wrogn.com) | 84 |
| [Selected Homme](/tools/ai-search-check/?url=selectedhomme.in) | 84 |
| [Slurrp Farm](/tools/ai-search-check/?url=slurrpfarm.com) | 84 |
| [Neesh Perfumes](/tools/ai-search-check/?url=neeshperfumes.com) | 84 |

What the top three share: the brand described in structured data with its social profiles, questions answered on the homepage, and clean descriptions. None is perfect, and each is one or two fixes from 100. Silvertraq and Explosive Whey already mark up their FAQs but don't describe their products on the homepage; WOD Armour has questions on the page without the FAQ markup, and a ten-character title.

## What this does and doesn't say

This measures how readable a homepage is to AI search, not whether ChatGPT recommends the brand. Being readable is the part a brand controls on its own site. Being recommended also depends on what other sites say: reviews, marketplaces, listicles, Reddit. A readable site is the floor, not the ceiling.

It is also one page per brand. A brand with great product pages and a thin homepage will score lower here than its catalogue deserves.


<section class="method" aria-labelledby="method-title">
<h2 id="method-title">How we measured</h2>
<dl>
<dt>What we checked</dt><dd>A random sample of the 886 Indian direct-to-consumer brands listed on d2cstory.com, which skews to brands with their own Shopify stores: the homepage of each, 96 scored of 99 attempted. The full list is below.</dd>
<dt>When</dt><dd>17 October 2026, one run per site.</dd>
<dt>With what</dt><dd>Our free <a href="/tools/ai-search-check">AEO and GEO check</a>, with its sixteen weighted checks as they stood that day (crawler access, text in the server HTML, structured data, answers to buyers' questions, titles and descriptions, llms.txt, sitemap, freshness and more) (<a href="https://github.com/verastack-labs/verastack-labs.github.io/blob/main/workers/aeo-check/src/score.ts">the scoring code</a>). It reads the HTML the server sends, without running JavaScript, plus robots.txt, llms.txt and the sitemap. On 18 October 2026 we changed the FAQ check to count questions answered on the page; this study used the earlier rule, which looked for FAQPage markup or two or more question headings.</dd>
<dt>What the score means</dt><dd>A score out of 100: the weighted share of the sixteen checks a page passes, with a partial pass earning a third of its weight. A page that blocks AI crawlers or asks not to be indexed is capped at 40. It measures how readable a page is to AI search, not whether any AI answer names or recommends the company.</dd>
<dt>Limits</dt><dd>One page per site, one run, one day; sites change, so a fresh check may differ. Every score named in this post links to a live re-check.</dd>
<dt>Per-site results</dt><dd>We name only the top scorers in public. Each company can have its own full report from us; anyone can run any site on the check and see its score today.</dd>
</dl>
<details><summary>All 96 sites we scored</summary><ul class="method-list"><li><a href="https://4700bc.com">4700BC</a></li><li><a href="https://aachho.com">Aachho</a></li><li><a href="https://adventureworx.in">Adventure Worx</a></li><li><a href="https://arelang.com">Arelang</a></li><li><a href="https://arirotoys.com">Ariro Toys</a></li><li><a href="https://beawara.com">Be Awara Kids</a></li><li><a href="https://beastlife.in">Beastlife</a></li><li><a href="https://bigbearfarms.in">Big Bear Farms</a></li><li><a href="https://blepworld.com">BLEP</a></li><li><a href="https://bombaytrooper.com">Bombay Trooper</a></li><li><a href="https://bowlfulstore.com">Bowlful</a></li><li><a href="https://calae.in">Calae</a></li><li><a href="https://chemistryindia.com">Chemistry India</a></li><li><a href="https://vivationline.com">Chhavi India</a></li><li><a href="https://cinnamon.kitchen">Cinnamon Kitchen</a></li><li><a href="https://cookiecartel.in">Cookie Cartel</a></li><li><a href="https://dawntown.co.in">Dawntown</a></li><li><a href="https://desitoys.in">Desi Toys</a></li><li><a href="https://eumeworld.com">Eume</a></li><li><a href="https://explosivewhey.com">Explosive Whey</a></li><li><a href="https://faridagupta.com">Farida Gupta</a></li><li><a href="https://fionadiamonds.com">Fiona Diamonds</a></li><li><a href="https://fixderma.com">Fixderma</a></li><li><a href="https://getketch.com">Getketch</a></li><li><a href="https://girlyveda.com">Girlyveda</a></li><li><a href="https://gladful.in">Gladful</a></li><li><a href="https://gobbleright.com">Gobble Right</a></li><li><a href="https://habanero.in">Habanero</a></li><li><a href="https://hamsterlondon.com">Hamster London</a></li><li><a href="https://happafoods.com">Happa Foods</a></li><li><a href="https://heapwell.in">Heapwell</a></li><li><a href="https://hungrykoala.in">Hungry Koala</a></li><li><a href="https://india.indewild.com">Indewild</a></li><li><a href="https://inweaveindia.com">Inweave</a></li><li><a href="https://jaypore.com">Jaypore</a></li><li><a href="https://jhajistore.com">Jhaji Store</a></li><li><a href="https://jordyblue.com">Jordyblue</a></li><li><a href="https://koparoclean.com">Koparo Clean</a></li><li><a href="https://koshayoga.co">Kosha Yoga Co</a></li><li><a href="https://lavieworld.com">Lavie</a></li><li><a href="https://leafyaffair.com">Leafy Affair</a></li><li><a href="https://libas.in">Libas</a></li><li><a href="https://lilgoodness.com">LiL Goodness</a></li><li><a href="https://lotusherbals.com">Lotus Herbals</a></li><li><a href="https://lovechild.in">Lovechild Masaba</a></li><li><a href="https://masilo.in">Masilo</a></li><li><a href="https://mishmashnaturals.com">Mishmash Naturals</a></li><li><a href="https://nabhisutra.com">Nabhi Sutra</a></li><li><a href="https://neeshperfumes.com">Neesh Perfumes</a></li><li><a href="https://nurturinggreen.in">Nurturing Green</a></li><li><a href="https://oggnhome.com">OGGN Home</a></li><li><a href="https://palmonas.com">Palmonas</a></li><li><a href="https://pelicanessentials.com">Pelican Essentials</a></li><li><a href="https://phitku.com">Phitku</a></li><li><a href="https://pistabarfi.com">Pista Barfi</a></li><li><a href="https://plixlife.com">Plix</a></li><li><a href="https://plumgoodness.com">Plum</a></li><li><a href="https://mypuravida.in">Puravida</a></li><li><a href="https://thequincelife.com">Quince Life</a></li><li><a href="https://thehouseofrare.com">Rare Rabbit</a></li><li><a href="https://ruosh.com">RUOSH</a></li><li><a href="https://saintg.in">Saint G</a></li><li><a href="https://saphed.com">Saphed</a></li><li><a href="https://satwanaturals.com">Satwa Naturals</a></li><li><a href="https://selectedhomme.in">Selected Homme</a></li><li><a href="https://senzicare.com">Senzicare</a></li><li><a href="https://shriandsam.com">Shri and Sam</a></li><li><a href="https://silvertraq.com">Silvertraq</a></li><li><a href="https://skillmatics.in">Skillmatics</a></li><li><a href="https://sleepyhug.in">Sleepyhug</a></li><li><a href="https://slurrpfarm.com">Slurrp Farm</a></li><li><a href="https://soch.com">Soch</a></li><li><a href="https://studiokook.com">Studio Kook</a></li><li><a href="https://supervek.in">Supervek</a></li><li><a href="https://svasthyaa.com">Svasthyaa</a></li><li><a href="https://sweetkaramcoffee.in">Sweet Karam Coffee</a></li><li><a href="https://teacurry.com">Teacurry</a></li><li><a href="https://theaurous.com">The Aurous</a></li><li><a href="https://thedecorcircle.com">The Decor Circle</a></li><li><a href="https://theinfusedkettle.com">The Infused Kettle</a></li><li><a href="https://thepurpleturtles.com">The Purple Turtles</a></li><li><a href="https://thestylesalad.in">The Style Salad</a></li><li><a href="https://thetaffy.in">The Taffy</a></li><li><a href="https://theteatrove.com">The Tea Trove</a></li><li><a href="https://thetribeconcepts.com">The Tribe Concepts</a></li><li><a href="https://thewildverve.com">The Wild Verve</a></li><li><a href="https://thezappybox.com">The Zappy Box</a></li><li><a href="https://totapari.com">Totapari</a></li><li><a href="https://trustbasket.com">TrustBasket</a></li><li><a href="https://tulum.coffee">Tulum Coffee</a></li><li><a href="https://wanderlooms.com">Wanderlooms</a></li><li><a href="https://whatsupwellness.in">Whatsup Wellness</a></li><li><a href="https://wodarmour.in">WOD Armour</a></li><li><a href="https://woolahtea.com">Woolah</a></li><li><a href="https://wrogn.com">WROGN</a></li><li><a href="https://ybpskin.com">YBP Skin</a></li></ul><p>3 more could not be reached on the day, so they were not scored.</p></details>
</section>

## Check your own

The check is free, takes about ten seconds and shows the fixes that matter most: [run it on your site](/tools/ai-search-check). If you'd rather we made the fixes, [tell us about your store](/#contact).
