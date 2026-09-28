import { ScenePlaceholder } from '@/components/scene-placeholder'
import { Hero } from '@/scenes/hero/hero'
import { Services } from '@/scenes/services/services'
import { Work } from '@/scenes/work/work'
import { Products } from '@/scenes/products/products'

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Services />
      <Work />
      <Products />
      <ScenePlaceholder id="process" label="/process" title="How we work" />
      <ScenePlaceholder id="about" label="/about" title="Design and engineering. One studio." />
      <ScenePlaceholder id="contact" label="/contact" title="Let's build something." />
    </main>
  )
}
