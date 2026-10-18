// The free AI search check (docs/growth-plan.md, idea 2). The Worker in workers/aeo-check does the
// fetching and scoring; this is the page's copy. The ids match the Worker's checks (a test holds
// them together).

export const checker = {
  endpoint: 'https://api.verastack.dev/aeo-check',
  path: '/ai-search-check',
  title: 'Free AEO and GEO check: does ChatGPT know your site?',
  description:
    'A free AEO and GEO check: how your page reads to ChatGPT, Perplexity, Claude and Google AI answers. Sixteen checks, a score out of 100 and the top three fixes.',
}

export const checks: { id: string; label: string; why: string }[] = [
  { id: 'crawlers', label: 'AI and search crawlers can read the page', why: 'robots.txt rules for the crawlers behind Google, Bing, ChatGPT, Perplexity and Claude, including the ones that fetch a page when a user asks, plus the training crawlers.' },
  { id: 'edge', label: 'Your server or CDN answers AI crawlers', why: 'Some bot protection turns AI crawlers away even when robots.txt lets them in.' },
  { id: 'text', label: 'The page says what you do in plain HTML', why: 'Many crawlers do not run JavaScript. We count the words in the HTML your server sends; 500 or more passes.' },
  { id: 'identity', label: 'Structured data says who you are', why: 'Organization JSON-LD with a logo and sameAs links to your other profiles, so a model can tell you apart from a namesake.' },
  { id: 'structured', label: 'Structured data describes what you sell', why: 'Product, Service, SoftwareApplication or similar JSON-LD, with prices where they apply.' },
  { id: 'faq', label: 'Answers to the questions buyers ask', why: 'A visible FAQ marked up as FAQPage. Question-and-answer pairs are the easiest thing for an engine to quote.' },
  { id: 'title', label: 'A clear title', why: 'Present, and long enough to say what the page is.' },
  { id: 'description', label: 'A meta description that answers "what is this?"', why: 'Plain sentences, not a keyword list. Engines often quote it as the summary.' },
  { id: 'canonical', label: 'One canonical address', why: 'So every copy of the page credits the same URL.' },
  { id: 'indexable', label: 'The page may be indexed', why: 'No noindex in a meta tag or an X-Robots-Tag header.' },
  { id: 'headings', label: 'Headings that outline the page', why: 'One h1 and an h2 per section, so engines can lift the right passage.' },
  { id: 'llms', label: 'An llms.txt for language models', why: 'A proposed plain-text summary file for models, with a title and links. A cheap bet.' },
  { id: 'sitemap', label: 'A sitemap engines can find', why: 'At /sitemap.xml or named in robots.txt.' },
  { id: 'fresh', label: 'Signs the page is current', why: 'A recent lastmod in the sitemap, a Last-Modified header or dateModified in the JSON-LD.' },
  { id: 'images', label: 'Images described in text', why: 'Alt text on the images, since a model reads the words, not the picture.' },
  { id: 'og', label: 'Link previews (Open Graph)', why: 'Title, description and image for shared and cited links.' },
]

export const faqs: { q: string; a: string }[] = [
  {
    q: 'What is AEO?',
    a: 'Answer engine optimisation is the work of getting named when people ask ChatGPT, Perplexity, Claude or Google AI answers a question. Most of it is careful SEO for a reader that is a model: let the crawlers in, say what you do in plain text, label the facts with structured data, and be cited by the pages engines trust.',
  },
  {
    q: 'What is GEO?',
    a: 'Generative engine optimisation: the same goal, named after the engines that write their answers instead of listing links. GEO adds the parts that decide whether a written answer quotes you: passages a model can lift word for word, facts and numbers worth citing, and mentions on the sites those answers draw from.',
  },
  {
    q: 'AEO vs GEO vs SEO: what is the difference?',
    a: 'SEO gets a page ranked in a list of links. AEO and GEO get your company named inside the answer itself, which is where more and more buyers now stop. They build on SEO rather than replace it: a page search engines cannot crawl will not be quoted either. AEO and GEO are two names for nearly the same work, and we do both.',
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
    a: 'It depends on the size of the site, so the price is on request. The AEO and GEO audit covers every key page and the sources engines cite for your category, and we can make the fixes too.',
  },
]
