// Contact scene copy and choices (spec 6.07).
export const contact = {
  headline: "Let's launch something.",
  services: [
    'a website',
    'a web experience',
    'a 3D experience',
    'a configurator',
    'a web app',
    'a CMS',
    'to show up in AI search',
    'a mobile or desktop app',
    'a product video',
    'launch marketing',
    'something else',
  ],
  // Picked when a visitor arrives from the configurator demo's Pre-book button, or from the AI
  // search check's audit link.
  prefillService: { configurator: 'a configurator', 'ai-search': 'to show up in AI search' } as Record<string, string>,
  defaultService: 'a website',
  timelines: ['as soon as possible', 'within 3 months', 'within 6 months', "whenever it's ready"],
  defaultTimeline: 'within 3 months',
  // Index into the budget bands, so it survives a currency switch.
  defaultBudget: 1,
  booking: { title: 'Book a 30-min call', sub: 'no prep needed', words: ['bring', 'your', 'idea'] },
}
