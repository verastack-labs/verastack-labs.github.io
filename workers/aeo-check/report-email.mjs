// Drafts the "complete report" email a visitor asked for on the AI search check, sent by hand from
// rigan@verastack.dev. It names every issue with what we found and the first step, then one offer
// (we fix them and get the page to 100, fixed price after a call) and the audit beyond the score.
// The full how-to for each fix is the paid work, so it is not in the email. Prints the subject and writes the HTML body next to this file, under
// emails/ (not in git), to paste into Gmail.
// node workers/aeo-check/report-email.mjs example.com [first name]
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const key = readFileSync(join(here, '.report-key'), 'utf8').trim()
const [url, name] = process.argv.slice(2)
if (!url) throw new Error('Pass an address, like example.com')

const res = await fetch(`https://api.verastack.dev/aeo-check?url=${encodeURIComponent(url)}&fresh=1`, {
  headers: { Origin: 'https://verastack.dev', 'X-Report-Key': key },
})
const report = await res.json()
if (report.error) throw new Error(report.error)

const host = new URL(report.url).host.replace(/^www\./, '')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const rank = (c) => (c.status === 'fail' ? 2 : 1) * 1000 + c.weight
const issues = report.checks.filter((c) => c.status !== 'pass').sort((a, b) => rank(b) - rank(a))
const passed = report.checks.length - issues.length
const link = (href, text) => `<a href="${href}">${text}</a>`
const call = 'https://cal.com/verastack/intro'
const recheck = `https://verastack.dev/tools/ai-search-check/?url=${encodeURIComponent(host)}`

// Each issue gets what we found and the first step, not the full recipe: the step-by-step fix is the
// work they hire us for. Keep these to one sentence that names the direction.
const FIRST_STEP = {
  crawlers: 'Open robots.txt to the search and AI crawlers you want reading the page.',
  edge: 'Check the bot settings on your CDN or firewall, which can turn AI crawlers away by default.',
  text: 'Get your main copy into the HTML the server sends, so crawlers that skip JavaScript can read it.',
  identity: 'Describe the company in structured data and link it to your official profiles.',
  structured: 'Describe what you sell in structured data that matches the page.',
  faq: 'Answer the questions your buyers ask, on the page itself.',
  title: 'Rewrite the title to name the product and what it is.',
  description: 'Rewrite the meta description as a plain sentence: what you offer and for whom.',
  canonical: 'Point every copy of the page at one preferred address.',
  indexable: 'Lift the noindex on pages you want found.',
  headings: 'Give the page one clear main heading and a heading per section.',
  llms: 'Add an llms.txt that sums up the site and links your key pages.',
  sitemap: 'Publish a sitemap of your important pages and point robots.txt at it.',
  fresh: 'Tell engines when the page last changed, in the sitemap and the page data.',
  images: 'Give meaningful images alt text that says what they show.',
  og: 'Add the Open Graph tags that give shared and cited links a proper card.',
}
const step = (c) => FIRST_STEP[c.id] ?? 'A short, specific change on the page.'
// Small homepage fixes are usually a week's work; a page that is hard to read needs a rebuild.
const small = report.score >= 60

const subject = `Your AI search report: ${host}, ${report.score}/100`
const body = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#1a1a1a;max-width:640px">
<p>Hi ${esc(name || 'there')},</p>
<p>Thanks for running ${esc(host)} through our AI search check. Here is the complete report you asked for, written up by our team.</p>
<p><b>Score: ${report.score}/100.</b> ${passed} of ${report.checks.length} checks pass. ${issues.length ? `These ${issues.length} are what stand between your page and AI answers, most important first:` : 'Nothing on the page itself is holding you back.'}</p>
${issues
  .map(
    (c, i) => `<p style="margin:18px 0 4px"><b>${i + 1}. ${esc(c.label)}</b> <span style="color:${c.status === 'fail' ? '#c2410c' : '#a16207'}">(${c.status === 'fail' ? 'fix' : 'improve'})</span></p>
<p style="margin:0 0 4px">What we found: ${esc(c.detail)}</p>
<p style="margin:0">First step: ${esc(step(c))}</p>`,
  )
  .join('\n')}
${
  issues.length
    ? `<div style="margin:24px 0;padding:16px 18px;border:1px solid #d9e6a5;border-radius:10px;background:#f7fbe8">
<p style="margin:0 0 6px"><b>Want it done? We fix ${issues.length === 1 ? 'it' : `all ${issues.length}`} and get ${esc(host)} to 100.</b></p>
<p style="margin:0">${
        small
          ? 'Fixes like these usually take us under a week. You get a fixed price after a short call, and we re-run the check until it reads 100.'
          : `Your page is hard for crawlers to read, so this is a rebuild rather than a patch. You get a fixed price after a short call; our ${link('https://verastack.dev/launch-kit/', 'Launch Kit')} covers a full site.`
      } ${link(call, 'Book a 30-minute call')}, or reply "go" and we'll send a quote.</p>
</div>`
    : ''
}
<p>Our own site, verastack.dev, and our products Origan and Riggit score 100 on this same check.</p>
<p><b>What a score can't see.</b> These checks read one page. Whether ChatGPT, Perplexity or Google's AI answers actually name ${esc(host)}, or a competitor, depends on more than that: how the questions your buyers ask get answered today, what the sites engines quote say about you, and whether the rest of your pages give an engine something worth citing. That is what our AEO and GEO audit covers, and we make the fixes too.</p>
<p>${issues.length ? 'Questions about any of this? Just reply.' : `${link(call, 'Book a 30-minute call')} to talk about the audit, or just reply.`} You can ${link(recheck, 're-run the check')} any time after a change.</p>
<p>Rigan, for the VeraStack Labs team<br>${link('https://verastack.dev', 'verastack.dev')}</p>
</div>`

mkdirSync(join(here, 'emails'), { recursive: true })
const out = join(here, 'emails', `${host}.html`)
writeFileSync(out, body)
console.log(`From: rigan@verastack.dev\nSubject: ${subject}\nBody: ${out}\nIssues: ${issues.length}`)
