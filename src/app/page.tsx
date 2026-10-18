import { Hero } from '@/scenes/hero/hero'
import { Services } from '@/scenes/services/services'
import { Work } from '@/scenes/work/work'
import { Products } from '@/scenes/products/products'
import { Process } from '@/scenes/process/process'
import { About } from '@/scenes/about/about'
import { Contact } from '@/scenes/contact/contact'
import { Notes, type NoteCard } from '@/scenes/notes/notes'
import { allPosts, formatDate } from '@/lib/blog'
import { categoryById } from '@/data/blog-categories'
import { homeGraph, jsonLd } from '@/lib/structured-data'

// The blog's newest posts, as plain data for the notes section (it picks its featured post in the
// browser). Built with the site, so a merged post shows up here on the same deploy.
function noteCards(): NoteCard[] {
  return allPosts().map((p) => ({
    slug: p.slug,
    titleParts: p.titleParts,
    description: p.description,
    date: formatDate(p.date),
    category: categoryById(p.category)?.name ?? '',
    stat: p.stat,
  }))
}

export default function Home() {
  return (
    <main id="main">
      {/* The home page's own graph: its FAQPage matches the questions shown in About, so it stays here. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(homeGraph()) }} />
      <Hero />
      <Services />
      <Work />
      <Products />
      <Process />
      <About />
      <Notes posts={noteCards()} />
      <Contact />
    </main>
  )
}
