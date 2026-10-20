// The pages beyond the one-page home, shown in the nav menu's second group on every page.
export type StudioLink = { href: string; label: string; isNew?: boolean }

export const studioLinks: readonly StudioLink[] = [
  { href: '/launch-kit', label: 'launch kit', isNew: true },
  { href: '/tools', label: 'tools' },
  { href: '/films', label: 'films', isNew: true },
  { href: '/blog', label: 'blog' },
  { href: '/founder', label: 'founder' },
]
