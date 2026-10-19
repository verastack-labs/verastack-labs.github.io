// Free tools, listed on /tools. Each lives at /tools/<slug>.
import { checker } from '@/data/ai-search-check'

export type Tool = { slug: string; name: string; line: string; href: string; tag: string }

export const tools: Tool[] = [
  {
    slug: 'ai-search-check',
    name: 'AEO and GEO check',
    line: 'How a page reads to ChatGPT, Perplexity, Claude and Google AI answers. Sixteen checks, a score out of 100 and the fixes that matter most.',
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
  {
    slug: 'what-ai-sees',
    name: 'What ChatGPT sees',
    line: 'Your page the way AI crawlers read it, with no JavaScript run: the words they get, and the ones they miss.',
    href: '/tools/what-ai-sees',
    tag: 'AI search',
  },
  {
    slug: 'organization-schema',
    name: 'Organization schema generator',
    line: 'The line that says who your company is, and the structured data that ties your website to your real profiles.',
    href: '/tools/organization-schema',
    tag: 'structured data',
  },
]

export const toolsPage = {
  path: '/tools',
  title: 'Free tools for launches and AI search',
  description: 'Free tools from VeraStack Labs for founders getting ready to launch: start with the AEO and GEO check, which scores how AI answers read your page.',
}
