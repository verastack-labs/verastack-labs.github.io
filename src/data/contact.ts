// Contact scene copy and choices (spec 6.07).
export const contact = {
  headline: "Let's build something.",
  services: ['a configurator', 'a commerce flow', 'a web app', 'a launch site', 'a desktop app', 'something else'],
  // Picked when a visitor arrives from the configurator demo's Pre-book button.
  prefillService: { configurator: 'a configurator' } as Record<string, string>,
  defaultService: 'a commerce flow',
  timelines: ['as soon as possible', 'within 3 months', 'within 6 months', 'no fixed date'],
  defaultTimeline: 'within 3 months',
  // Index into the budget bands, so it survives a currency switch.
  defaultBudget: 1,
  booking: { title: 'Book a 20-min call', sub: 'no prep needed', words: ['bring', 'your', 'idea'] },
}
