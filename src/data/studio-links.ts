// The pages beyond the one-page home, shown in the nav menu's second group on every page.
// menuLabel replaces the label in the phone menu, where the home sections sit beside the studio pages.
export type StudioLink = { href: string; label: string; menuLabel?: string; isNew?: boolean }

export const studioLinks: readonly StudioLink[] = [
  { href: '/work', label: 'work', menuLabel: 'all work', isNew: true },
  { href: '/launch-kit', label: 'launch kit', isNew: true },
  { href: '/tools', label: 'tools' },
  { href: '/films', label: 'films', isNew: true },
  { href: '/blog', label: 'blog' },
  { href: '/founder', label: 'founder' },
]
