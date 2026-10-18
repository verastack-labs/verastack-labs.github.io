// The SaaS Launch Kit page (docs/launch-kit.md holds the decisions behind every number here).

export const launchKit = {
  path: '/launch-kit',
  title: 'The SaaS Launch Kit: launch-ready in 4 weeks',
  description:
    'Brand, a 5-page launch site, a 60-second launch film, and AEO and GEO built in from day one. One team, 4 weeks, $9,500 fixed. Two launch slots a month.',
  price: 9500,
  priceLabel: '$9,500',
  monthly: '$2,500',
  slots: 'two launch slots a month',
}

export const kitParts = [
  { tag: '01 / brand', title: 'Brand basics', text: 'Logo, colours, type and a one-page guide your team can keep using.' },
  { tag: '02 / site', title: '5-page launch site', text: 'Home, product, pricing, about and contact. Code you own, or Framer if your team wants to edit it.' },
  { tag: '03 / film', title: '60-second launch film', text: 'Plus cut-downs for LinkedIn, X and your launch post.' },
  { tag: '04 / AI search', title: 'AEO and GEO setup', text: 'Structured data, llms.txt and quotable copy. 90 or more on our check at launch.' },
]

export const kitWeeks = [
  { week: 'week 1', title: 'Brand', text: 'Kick-off call, the brand basics and the words for the site.' },
  { week: 'week 2', title: 'Site', text: 'Design and build, with AEO and GEO in from the first page.' },
  { week: 'week 3', title: 'Film', text: 'Script, capture and edit the launch film and its cuts.' },
  { week: 'week 4', title: 'Launch', text: 'Final checks, the before and after score, handoff and go-live.' },
]

export const kitIncluded = ['Brand basics and a guide', '5-page launch site', '60-second film and cuts', 'AEO and GEO, 90+ at launch', 'You own the code and the repo']

export const kitProof = [
  { n: '100', signal: true, title: 'verastack.dev', text: 'Our own site on our own AEO and GEO check, and Origan and Riggit with it.' },
  { n: '226', title: 'YC homepages studied', text: 'Median 66. We know what the top of the batch does differently.', href: '/blog/yc-summer-2026-ai-search' },
  { n: '3', title: 'Products live', text: 'Origan, rigseed and Riggit, designed, built and launched by us. Mehfil is next.', href: '/#products' },
]

export const kitQuestions: { q: string; a: string }[] = [
  {
    q: 'What if we are slow with feedback?',
    a: 'The four weeks assume feedback within two working days. While we wait on you the clock pauses, and the late-week refund only counts our delays, never yours.',
  },
  {
    q: 'Can our team edit the site after launch?',
    a: 'Yes. We build in code by default and hand over the repo with docs, or in Framer when your team wants to change pages without a developer. Either way, you own it.',
  },
  {
    q: 'Do you take equity?',
    a: 'Sometimes, alongside cash, for startups we believe in. Ask us on the call.',
  },
  {
    q: 'Will ChatGPT name us?',
    a: 'Nobody can promise that, and you should be wary of anyone who does. We promise a launch site that scores 90 or more on our AEO and GEO check, so engines can read and quote it. The monthly plan then tracks whether ChatGPT, Perplexity and Google name you, and works on it.',
  },
  {
    q: 'Is it only for SaaS?',
    a: 'It is built for software launches, but it fits any product with a launch date. Web and mobile app builds, 3D and configurators are add-ons, quoted separately.',
  },
  {
    q: 'Do you offer regional pricing?',
    a: 'Yes, for startups in India. Book a call and we will quote in rupees for your scope.',
  },
]
