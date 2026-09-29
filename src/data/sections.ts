export type Section = { id: string; path: string; label: string }

// Page order. `path` is what the nav pill shows; `id` is the element id each scene renders.
export const sections: readonly Section[] = [
  { id: 'top', path: '/intro', label: 'intro' },
  { id: 'services', path: '/services', label: 'services' },
  { id: 'work', path: '/work', label: 'work' },
  { id: 'products', path: '/products', label: 'products' },
  { id: 'process', path: '/process', label: 'process' },
  { id: 'about', path: '/about', label: 'about' },
  { id: 'contact', path: '/contact', label: 'contact' },
]
