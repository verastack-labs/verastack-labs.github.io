---
title: AI search scores of *YC Fall 2026*, six weeks before Demo Day
description: 153 YC Fall 2026 homepages, checked for how well ChatGPT and AI answers can read them. Median 72, seven perfect scores, and the leaders in each space.
date: 2026-10-21
time: 12:30
category: startups
hook: YC Fall 2026 founder? Book a free 30-minute call before Demo Day and we'll go through your homepage with you, live: what an AI answer can read today and what to fix first.
hookCta: Book a 30-min call | call
checkCompare: The median YC Fall 2026 homepage scored 72 out of 100. See where yours lands.
stat: 72 | median score of 153 YC Fall 2026 homepages
tags: YC, AI search, startups
---

Demo Day for YC's Fall 2026 batch is on 2 December. Between now and then, investors, customers and journalists will look these companies up, and more of them now do it by asking ChatGPT or Perplexity. So, six weeks out, we asked the same question we asked of [the Summer batch](/blog/yc-summer-2026-ai-search): when an AI answer goes looking for a company in this batch, how much of its homepage can it actually read?

On 21 October 2026, YC's directory listed 158 Fall 2026 companies. We took the 155 that list a website and ran each homepage through our [AI search check](/tools/ai-search-check). 153 answered; two were down that day.

## The scores

- **Median 72 out of 100.** The Summer batch sat at 66, but we have tightened one check since then (more on that below), so treat the comparison as rough.
- **Seven perfect scores,** and 22 companies at 90 or above.
- **17 under 50,** and 13 homepages send 50 words of HTML or fewer before JavaScript runs, which is close to blank for many AI crawlers.

| Score | Companies |
| --- | --- |
| 90 to 100 | 22 |
| 80 to 89 | 32 |
| 70 to 79 | 27 |
| 60 to 69 | 29 |
| 50 to 59 | 26 |
| Under 50 | 17 |

A batch homepage is usually a few weeks old, built to win the first customers, and it does that job. The point is that the same page is also how a model decides what the company is, and that decision is being made now, before Demo Day.

<!-- hook -->

## The leaders in each space

The top three in every space with ten or more companies, grouped from YC's own categories. Scores as of 21 October 2026; each links to a live re-check, so you can see where it stands today.

| Space | Companies | Median | Top three |
| --- | --- | --- | --- |
| Other B2B software | 46 | 78.5 | [DeepMark](/tools/ai-search-check/?url=deepmark.me) 100, [Clean](/tools/ai-search-check/?url=tryclean.ai) 100, [Papaya](/tools/ai-search-check/?url=papaya.fyi) 100 |
| Industrials | 32 | 58.5 | [Lark](/tools/ai-search-check/?url=larkagents.com) 88, [Super Powers Mobility](/tools/ai-search-check/?url=spm.fun) 81, [Theseus Robotics](/tools/ai-search-check/?url=theseus.bot) 79 |
| Engineering, product and design tools | 19 | 79 | [Mirrors](/tools/ai-search-check/?url=mirrors.dev) 100, [Boxes.dev](/tools/ai-search-check/?url=boxes.dev) 95, [Gradon](/tools/ai-search-check/?url=heygradon.com) 93 |
| Infrastructure | 17 | 77 | [Boat](/tools/ai-search-check/?url=boat.dev) 93, [RunInfra (RightNow)](/tools/ai-search-check/?url=runinfra.ai) 93, [Wondersearch](/tools/ai-search-check/?url=wondersearch.com) 88 |
| Consumer | 13 | 77 | [Vyra](/tools/ai-search-check/?url=usevyra.com) 100, [Veeza AI](/tools/ai-search-check/?url=veeza.ai) 100 |
| Healthcare | 11 | 60 | [Altair Health](/tools/ai-search-check/?url=altair-health.com) 95, [Rhem Labs](/tools/ai-search-check/?url=rhem.ai) 79, [Kairos Health](/tools/ai-search-check/?url=kairoshealthai.com) 75 |
| Fintech | 10 | 80.5 | [Hesper AI](/tools/ai-search-check/?url=gethesperai.com) 95, [Covera](/tools/ai-search-check/?url=covera-agents.com) 91, [Oasive](/tools/ai-search-check/?url=oasive.ai) 90 |

The seven perfect scores: [DeepMark](/tools/ai-search-check/?url=deepmark.me), [Clean](/tools/ai-search-check/?url=tryclean.ai), [Papaya](/tools/ai-search-check/?url=papaya.fyi), [Mirrors](/tools/ai-search-check/?url=mirrors.dev), [Vyra](/tools/ai-search-check/?url=usevyra.com), [Veeza AI](/tools/ai-search-check/?url=veeza.ai) and [Databuddy](/tools/ai-search-check/?url=databuddy.cc). None of them needed a big budget. Each sends plain text that says what the product is, labels the company and the product in structured data, answers buyers' questions on the page, and has an llms.txt.

The widest gap between spaces is the same as in Summer: hardware. Industrials, the robotics, defence, energy and drone companies, sit at a median of 58.5, against 77 to 80 for the software spaces. Their homepages say much less in text: a median of 279 words in the HTML, against 614 across the batch.

## What most of the batch is missing

- **No FAQ on the homepage:** 64%. The questions buyers ask (price, who it is for, how it compares) go unanswered on the page.
- **Nothing that describes the product to machines:** 70% have no Product, Service or SoftwareApplication data.
- **No llms.txt:** 57%. It takes an hour to write.
- **Nothing that says who the company is:** 46% have no Organization data, so a model has to guess which "Clean" or "Boat" is meant.
- **No sitemap:** 24%. **No canonical address:** 22%.

## Five fixes before Demo Day

1. **Put the one-line pitch in the HTML,** not only in a video or an animation. "X is Y for Z", in text a crawler can read.
2. **Label the company and the product in structured data,** with links to your LinkedIn, X and YC company page, so engines can tell you apart from a namesake. It's good practice that labels, not a guarantee of anything.
3. **Answer five questions buyers ask,** on the page, two sentences each.
4. **Add an llms.txt and a sitemap.** Two files, an hour together.
5. **Re-check after every redesign.** Batch sites change weekly, and so do these scores.

## What this does and doesn't say

This measures how readable a homepage is to AI search, not how good the company is or whether ChatGPT recommends it. It is one page per company, checked on one day, and only the companies in the batch that list a website.


<section class="method" aria-labelledby="method-title">
<h2 id="method-title">How we measured</h2>
<dl>
<dt>What we checked</dt><dd>Every company in YC’s Fall 2026 batch that lists a website on the YC directory: 158 companies listed on 21 October 2026, 155 with a website, the homepage of each; 153 scored (two returned errors). The full list is below.</dd>
<dt>When</dt><dd>21 October 2026, one run per site.</dd>
<dt>With what</dt><dd>Our free <a href="/tools/ai-search-check">AEO and GEO check</a>, with its sixteen weighted checks as they stood that day (crawler access, text in the server HTML, structured data, answers to buyers' questions, titles and descriptions, llms.txt, sitemap, freshness and more) (<a href="https://github.com/verastack-labs/verastack-labs.github.io/blob/main/workers/aeo-check/src/score.ts">the scoring code</a>). It reads the HTML the server sends, without running JavaScript, plus robots.txt, llms.txt and the sitemap. Since 18 October the FAQ check counts questions a reader can see on the page, and since 20 October it ignores decorative icons after a question. Our Summer 2026 study used the earlier FAQ rule, so the two medians are not like for like.</dd>
<dt>Spaces</dt><dd>Grouped from YC’s own industry and subindustry labels: engineering, product and design tools and infrastructure on their own, the rest of B2B together, and Industrials, Consumer, Healthcare and Fintech as YC lists them. Spaces with fewer than ten companies are left out of the table.</dd>
<dt>What the score means</dt><dd>A score out of 100: the weighted share of the sixteen checks a page passes, with a partial pass earning a third of its weight. A page that blocks AI crawlers or asks not to be indexed is capped at 40. It measures how readable a page is to AI search, not whether any AI answer names or recommends the company.</dd>
<dt>Limits</dt><dd>One page per site, one run, one day; sites change, so a fresh check may differ. Every score named in this post links to a live re-check.</dd>
<dt>Per-site results</dt><dd>We name only top scorers in public. Each company can have its own full report from us; anyone can run any site on the check and see its score today.</dd>
</dl>
<details><summary>All 153 sites we scored</summary><ul class="method-list"><li><a href="https://acyclic.dev/">Acyclic Labs</a></li><li><a href="https://www.adside.ai/">Adside.ai</a></li><li><a href="https://www.agent37.com/">Agent 37</a></li><li><a href="https://agentrelay.com/">Agent Relay</a></li><li><a href="https://ageospatial.com/">Ageospatial</a></li><li><a href="https://altair-health.com/">Altair Health</a></li><li><a href="https://www.antimattr.one/">antimattr</a></li><li><a href="https://www.antropi.world/">Antropi Robotics</a></li><li><a href="https://appliedkinetics.ai/">Applied Kinetics</a></li><li><a href="https://www.archangelhealth.ai/">Archangel Health</a></li><li><a href="https://armorerlabs.com/">Armorer Labs</a></li><li><a href="https://asakana.co/">Asakana</a></li><li><a href="https://ascenix.co/">Ascenix</a></li><li><a href="https://www.asim-group.com/">Asim</a></li><li><a href="https://aucert.ai/">Aucert</a></li><li><a href="https://www.aviern.com/">Aviern</a></li><li><a href="https://boat.dev/">Boat</a></li><li><a href="https://boxes.dev/">Boxes.dev</a></li><li><a href="https://www.bryel.ai/">Bryel</a></li><li><a href="https://byteask.ai/">ByteAsk</a></li><li><a href="https://capveon.ai/">Capveon</a></li><li><a href="https://caveman.so/">Caveman</a></li><li><a href="https://cesara.com/">Cesara</a></li><li><a href="https://chempilot.ai/">ChemPilot.ai</a></li><li><a href="https://claimkit.co/en-us">ClaimKit</a></li><li><a href="https://www.tryclean.ai/">Clean</a></li><li><a href="https://www.usecollarai.com/">Collar</a></li><li><a href="https://composal.ai/">Composal</a></li><li><a href="https://conus-med.com/">CONUS</a></li><li><a href="https://www.covera-agents.com/">Covera</a></li><li><a href="https://cyclon.ai/">Cyclon</a></li><li><a href="https://www.databuddy.cc/">Databuddy</a></li><li><a href="https://www.decent.com/">Decent</a></li><li><a href="https://www.deepmark.me/">DeepMark</a></li><li><a href="https://www.usedefinite.com/">Definite</a></li><li><a href="https://degla.ai/">Degla Inc</a></li><li><a href="https://deployrobotics.co/">Deploy</a></li><li><a href="https://www.dreamscalelabs.com/">Dreamscale Labs</a></li><li><a href="https://dydema.com/">Dydema</a></li><li><a href="https://faradaycompute.com/">Faraday</a></li><li><a href="https://fire.co/">Fire Wallet</a></li><li><a href="https://www.useforward.co/">Forward</a></li><li><a href="https://usefr.com/">Frontrunner</a></li><li><a href="https://godhands.ai/">GodHands</a></li><li><a href="https://heygradon.com/">Gradon</a></li><li><a href="https://graphide.com/">Graphide</a></li><li><a href="https://www.graypass.org/">GrayPass</a></li><li><a href="https://grep.ai/">Grep AI</a></li><li><a href="https://www.buildhabu.com/">HABU</a></li><li><a href="https://halmoslabs.com/">Halmos Labs</a></li><li><a href="https://hemlock.inc/">Hemlock</a></li><li><a href="https://herdr.dev/">herdr</a></li><li><a href="https://gethesperai.com/">Hesper AI</a></li><li><a href="https://hickory.co/">Hickory &amp; Company</a></li><li><a href="https://withhopper.com/">Hopper</a></li><li><a href="https://hue.run/">Hue</a></li><li><a href="https://hundred.systems/">Hundred</a></li><li><a href="https://www.ignitionbenefits.com/">Ignition Benefits</a></li><li><a href="https://inflection-space.com/">Inflection Space Systems</a></li><li><a href="https://www.invertix.ai/">Invertix</a></li><li><a href="https://isoquant.ai/">isoquant</a></li><li><a href="https://www.kailashlabs.com/">Kailash Labs</a></li><li><a href="https://kairoshealthai.com/">Kairos Health</a></li><li><a href="https://www.keresaero.com/">Keres</a></li><li><a href="https://lantern.md/">Lantern AI</a></li><li><a href="https://larkagents.com/">Lark</a></li><li><a href="https://runlatent.ai/">Latent</a></li><li><a href="https://lyon.so/">Lyon</a></li><li><a href="https://maritime.sh/">Maritime</a></li><li><a href="https://melty.gg/">Melty</a></li><li><a href="https://www.micora.com/">Micora</a></li><li><a href="https://mirrors.dev/">Mirrors</a></li><li><a href="https://munito.ai/">Munito AI</a></li><li><a href="https://native.no/hi">Native</a></li><li><a href="https://neomatter.com/">Neomatter</a></li><li><a href="https://nodus-compute.ai/">Nodus Compute</a></li><li><a href="https://nxtcure.com/">Nxtcure Labs</a></li><li><a href="https://oasive.ai/">Oasive</a></li><li><a href="https://obia.io/">Obia</a></li><li><a href="https://obsessiondb.com/">ObsessionDB</a></li><li><a href="https://odin-robotics.com/">Odin Robotics</a></li><li><a href="https://www.onepatch.dev/">OnePatch</a></li><li><a href="https://openactuation.com/">Open Actuation</a></li><li><a href="https://openhack.com/">OpenHack</a></li><li><a href="https://openseo.so/">OpenSEO</a></li><li><a href="https://operatechnologies.com/">OpEra</a></li><li><a href="https://orcaaerospace.com/">Orca Aerospace</a></li><li><a href="https://www.orgo.ai/">Orgo</a></li><li><a href="https://oroagents.com/">ORO AI</a></li><li><a href="https://papaya.fyi/">Papaya</a></li><li><a href="https://particularity.io/">Particularity</a></li><li><a href="https://perit.ai/">Perit.AI</a></li><li><a href="https://petrichorbio.com/">Petrichor</a></li><li><a href="https://phone-harness.com/">Phone Harness</a></li><li><a href="https://ploid.com/">Ploid</a></li><li><a href="https://polemosindustries.com/">Polemos Industries</a></li><li><a href="https://pomerado.ai/">Pomerado</a></li><li><a href="https://runpraxis.ai/">Praxis</a></li><li><a href="https://www.primordiant.com/">Primordiant</a></li><li><a href="https://quippyapp.com/">Quippy</a></li><li><a href="https://www.quivly.ai/">Quivly AI</a></li><li><a href="https://reconero.com/">Reconero</a></li><li><a href="https://www.redoubt.insure/">Redoubt Insurance</a></li><li><a href="https://resineda.com/">Resin Technologies</a></li><li><a href="https://www.rhem.ai/">Rhem Labs</a></li><li><a href="https://runinfra.ai/">RightNow</a></li><li><a href="https://meetriver.com/">River</a></li><li><a href="https://www.rodeorobotics.com/">Rodeo Robotics</a></li><li><a href="https://roma.app/">Roma</a></li><li><a href="https://runtime.si/">Runtime.si</a></li><li><a href="https://www.rystic.ai/">Rystic</a></li><li><a href="https://saccade.health/">Saccade</a></li><li><a href="https://sentient-os.ai/">Sentient OS</a></li><li><a href="https://shepherdrobotics.ai/">Shepherd Robotics</a></li><li><a href="https://shireintelligence.com/">Shire Intelligence</a></li><li><a href="https://www.silicamachines.com/">Silica</a></li><li><a href="https://simantic.com/">Simantic</a></li><li><a href="https://www.simulithic.com/">Simulithic</a></li><li><a href="https://sintem.co/">sintem</a></li><li><a href="https://www.sinter.systems/">Sinter</a></li><li><a href="https://sintropix.com/">Sintropix</a></li><li><a href="https://sona8.com/">Sona8</a></li><li><a href="https://www.joinspine.ai/">Spine</a></li><li><a href="https://stacktrace.ai/">Stacktrace</a></li><li><a href="https://streamlinesystems.ltd/">Streamline Systems</a></li><li><a href="https://spm.fun/">Super Powers Mobility (SPM)</a></li><li><a href="https://www.sutrix.ai/">Sutrix</a></li><li><a href="https://synaraops.com/">Synara</a></li><li><a href="https://www.talos-us.com/">Talos</a></li><li><a href="https://www.useterse.ai/">Terse</a></li><li><a href="https://theagenticdatacompany.com/">The Agentic Data Co.</a></li><li><a href="https://www.thecompany.company/">The Company Company</a></li><li><a href="https://subvocal.company/">The Subvocal Company</a></li><li><a href="https://theo.site/">Theo</a></li><li><a href="https://theseus.bot/">Theseus Robotics</a></li><li><a href="https://tilion.com/">Tilion</a></li><li><a href="https://tilo.so/">Tilo</a></li><li><a href="https://www.gettireswing.com/">Tire Swing</a></li><li><a href="https://truemile.ai/">TrueMile</a></li><li><a href="https://twentyfour26.com/">twentyfour26</a></li><li><a href="https://ufo.ai/">UFO.ai</a></li><li><a href="https://uxduck.com/">UXDuck</a></li><li><a href="https://www.veeza.ai/en">Veeza AI</a></li><li><a href="https://veltha.ai/">Veltha</a></li><li><a href="https://www.vexoai.com/">Vexo</a></li><li><a href="https://www.viraj-aero.com/">Viraj Aero</a></li><li><a href="https://www.volaren.ai/">Volaren Inc.</a></li><li><a href="https://vorelios.com/">Vorelios</a></li><li><a href="https://voyager.so/">Voyager</a></li><li><a href="https://www.usevyra.com/">Vyra</a></li><li><a href="https://wondersearch.ai/">Wondersearch</a></li><li><a href="https://workers.io/">Workers IO</a></li><li><a href="https://www.hiyam.ai/">Yam</a></li></ul></details>
</section>

## Check your own

The check is free and takes about ten seconds: [run it on your homepage](/tools/ai-search-check). If you'd rather we made the fixes before Demo Day, [tell us about your startup](/#contact).
