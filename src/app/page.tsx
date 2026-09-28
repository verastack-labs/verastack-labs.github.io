import { ScenePlaceholder } from '@/components/scene-placeholder'
import { Hero } from '@/scenes/hero/hero'
import { Services } from '@/scenes/services/services'
import { Work } from '@/scenes/work/work'
import { Products } from '@/scenes/products/products'
import { Process } from '@/scenes/process/process'
import { About } from '@/scenes/about/about'

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Services />
      <Work />
      <Products />
      <Process />
      <About />
      <ScenePlaceholder id="contact" label="/contact" title="Let's build something." />
    </main>
  )
}
