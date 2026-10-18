// Free tools, listed on /tools. Each lives at /tools/<slug>.
import { checker } from '@/data/ai-search-check'

export type Tool = { slug: string; name: string; line: string; href: string; tag: string }

export const tools: Tool[] = [
  {
    slug: 'ai-search-check',
    name: 'AEO and GEO check',
    line: 'How a page reads to ChatGPT, Perplexity, Claude and Google AI answers. Sixteen checks, a score out of 100 and the top three fixes.',
    href: checker.path,
    tag: 'AI search',
  },
  {
    slug: 'faq-schema',
    name: 'FAQ schema generator',
    line: 'Write the questions buyers ask; get FAQPage structured data and matching HTML, ready to paste. Runs in your browser.',
    href: '/tools/faq-schema',
    tag: 'structured data',
  },
  {
    slug: 'product-schema',
    name: 'Product and service schema generator',
    line: 'Say what you sell, for whom and from what price in one sentence for your page, and get the matching structured data.',
    href: '/tools/product-schema',
    tag: 'structured data',
  },
]

export const toolsPage = {
  path: '/tools',
  title: 'Free tools for launches and AI search',
  description: 'Free tools from VeraStack Labs for founders getting ready to launch: start with the AEO and GEO check, which scores how AI answers read your page.',
}
