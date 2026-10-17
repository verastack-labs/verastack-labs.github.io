// The site-wide offer (src/components/offer). The free video's terms are not set yet (docs/STATUS.md,
// Waiting on Rigan), so the copy says only "a few products we pick": no count, length or criteria.
export const offer = {
  label: 'two free things',
  pill: { both: 'Free video · AI check', video: 'Free product video' },
  video: {
    label: 'free product video',
    title: 'Apply for a free product video',
    body: "We make a short launch film for a few products we pick, free. Tell us about yours and we'll look.",
    proof: 'Films we have made: rigseed, Origan and Bruno (independent).',
    submit: 'Apply',
  },
  check: {
    label: 'free AI search check',
    title: 'Does ChatGPT know your site?',
    body: "See how ChatGPT, Perplexity and Google's AI answers read your page: a score out of 100 and the fixes that matter most, in about ten seconds.",
    submit: 'Check',
  },
}
