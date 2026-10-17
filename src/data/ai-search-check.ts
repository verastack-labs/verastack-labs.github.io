// The free AI search check (docs/growth-plan.md, idea 2). The Worker in workers/aeo-check does the
// fetching and scoring; this is the page's copy. The ids match the Worker's checks (a test holds
// them together).

export const checker = {
  endpoint: 'https://api.verastack.dev/aeo-check',
  path: '/ai-search-check',
  title: 'Free AI search check: does ChatGPT know your site?',
  description:
    'Check how your page reads to ChatGPT, Perplexity, Claude and Google AI answers. Twelve checks, a score out of 100 and the three fixes that matter most. Free.',
}

export const checks: { id: string; label: string; why: string }[] = [
  { id: 'crawlers', label: 'AI and search crawlers can read the page', why: 'robots.txt rules for Googlebot, Bingbot, OAI-SearchBot, PerplexityBot and Claude-SearchBot, plus the training crawlers GPTBot, ClaudeBot and Google-Extended.' },
  { id: 'edge', label: 'Your server or CDN answers AI crawlers', why: 'Some bot protection turns AI crawlers away even when robots.txt lets them in.' },
  { id: 'text', label: 'The page says what you do in plain HTML', why: 'Many crawlers do not run JavaScript. We count the words in the HTML your server sends.' },
  { id: 'structured', label: 'Structured data labels the facts', why: 'JSON-LD that names your organisation, product, service, prices or FAQs.' },
  { id: 'title', label: 'A clear title', why: 'Present, and long enough to say what the page is.' },
  { id: 'description', label: 'A meta description that answers "what is this?"', why: 'Engines often quote it as the summary.' },
  { id: 'canonical', label: 'One canonical address', why: 'So every copy of the page credits the same URL.' },
  { id: 'indexable', label: 'The page may be indexed', why: 'No noindex in a meta tag or an X-Robots-Tag header.' },
  { id: 'h1', label: 'One main heading', why: 'A single h1 in the server HTML.' },
  { id: 'llms', label: 'An llms.txt for language models', why: 'A proposed plain-text summary file for models. A cheap bet.' },
  { id: 'sitemap', label: 'A sitemap engines can find', why: 'At /sitemap.xml or named in robots.txt.' },
  { id: 'og', label: 'Link previews (Open Graph)', why: 'Title, description and image for shared and cited links.' },
]

export const faqs: { q: string; a: string }[] = [
  {
    q: 'What is AI search optimisation (AEO)?',
    a: 'Answer engine optimisation is the work of getting named when people ask ChatGPT, Perplexity, Claude or Google AI answers a question. Most of it is careful SEO for a reader that is a model: let the crawlers in, say what you do in plain text, label the facts with structured data, and be cited by the pages engines trust.',
  },
  {
    q: 'What does the check look at?',
    a: 'One page: the HTML your server sends, its headers, and your robots.txt, llms.txt and sitemap. It does not run JavaScript, which is the point: many AI crawlers do not either.',
  },
  {
    q: 'Does a score of 100 mean ChatGPT will recommend us?',
    a: 'No. It means engines can read and understand the page. Whether they name you also depends on what other sites say about you, which a full audit covers.',
  },
  {
    q: 'What does the full audit cost?',
    a: 'It depends on the size of the site, so the price is on request. The audit covers every key page and the sources engines cite for your category, and we can make the fixes too.',
  },
]
