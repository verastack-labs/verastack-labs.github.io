// Blog categories. Every post names one in its front matter (`category: ai-search`); each carries a
// very short phrase saying what sits under it. A category with no posts yet gets no chip and no page.
export type BlogCategory = { id: string; name: string; phrase: string }

export const blogCategories: BlogCategory[] = [
  { id: 'ai-search', name: 'AI search', phrase: 'getting named by ChatGPT and Google' },
  { id: 'studies', name: 'Studies', phrase: 'what we measured, with the data' },
  { id: 'launches', name: 'Launches', phrase: 'shipping launches that hold up' },
  { id: 'startups', name: 'Startups', phrase: "who's raising, building and shipping" },
  { id: 'design', name: 'Design', phrase: 'brands that look like themselves' },
]

export const categoryById = (id: string) => blogCategories.find((c) => c.id === id)
