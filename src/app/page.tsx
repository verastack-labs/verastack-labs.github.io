import { Hero } from '@/scenes/hero/hero'
import { Services } from '@/scenes/services/services'
import { Work } from '@/scenes/work/work'
import { Products } from '@/scenes/products/products'
import { Process } from '@/scenes/process/process'
import { About } from '@/scenes/about/about'
import { Contact } from '@/scenes/contact/contact'

export default function Home() {
  return (
    <main id="main">
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
