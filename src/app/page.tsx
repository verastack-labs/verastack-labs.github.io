import { Hero } from '@/scenes/hero/hero'
import { Services } from '@/scenes/services/services'
import { Work } from '@/scenes/work/work'
import { Products } from '@/scenes/products/products'
import { Process } from '@/scenes/process/process'
import { About } from '@/scenes/about/about'
import { Contact } from '@/scenes/contact/contact'
import { homeGraph, jsonLd } from '@/lib/structured-data'

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
      <Contact />
    </main>
  )
}
