// Drafts the "complete report" email a visitor asked for on the AI search check, sent by hand from
// rigan@verastack.dev. Prints the subject and writes the HTML body next to this file, under
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

const subject = `Your AI search report: ${host}, ${report.score}/100`
const body = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#1a1a1a;max-width:640px">
<p>Hi ${esc(name || 'there')},</p>
<p>Thanks for running ${esc(host)} through our AI search check. Here is the complete report you asked for, written up by our team.</p>
<p><b>Score: ${report.score}/100.</b> ${passed} of ${report.checks.length} checks pass. ${issues.length ? `These ${issues.length} are what stand between your page and AI answers, most important first:` : 'Nothing on the page itself is holding you back.'}</p>
${issues
  .map(
    (c, i) => `<p style="margin:18px 0 4px"><b>${i + 1}. ${esc(c.label)}</b> <span style="color:${c.status === 'fail' ? '#c2410c' : '#a16207'}">(${c.status === 'fail' ? 'fix' : 'improve'})</span></p>
<p style="margin:0 0 4px">What we found: ${esc(c.detail)}</p>
<p style="margin:0">What it takes: ${esc(c.fix)}</p>`,
  )
  .join('\n')}
<p style="margin-top:22px"><b>What a score can't see.</b> These checks read one page. Whether ChatGPT, Perplexity or Google's AI answers actually name ${esc(host)}, or a competitor, depends on more than that: how the questions your buyers ask get answered today, what the sites engines quote say about you, and whether the rest of your pages give an engine something worth citing. That is what our AEO and GEO audit covers, and we make the fixes too.</p>
<p>If it helps, ${link(call, 'book a 30-minute call')} and we'll walk through this report with you, or just reply to this email. You can ${link(recheck, 're-run the check')} any time after a change.</p>
<p>Rigan, for the VeraStack Labs team<br>${link('https://verastack.dev', 'verastack.dev')}</p>
</div>`

mkdirSync(join(here, 'emails'), { recursive: true })
const out = join(here, 'emails', `${host}.html`)
writeFileSync(out, body)
console.log(`From: rigan@verastack.dev\nSubject: ${subject}\nBody: ${out}\nIssues: ${issues.length}`)
