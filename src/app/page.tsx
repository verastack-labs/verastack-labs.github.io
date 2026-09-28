import { ScenePlaceholder } from '@/components/scene-placeholder'
import { Hero } from '@/scenes/hero/hero'

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <ScenePlaceholder id="services" label="/services" title="Services" />
      <ScenePlaceholder id="work" label="/work" title="Our founder has worked with" />
      <ScenePlaceholder id="products" label="/products" title="And we build our own" />
      <ScenePlaceholder id="process" label="/process" title="How we work" />
      <ScenePlaceholder id="about" label="/about" title="Design and engineering. One studio." />
      <ScenePlaceholder id="contact" label="/contact" title="Let's build something." />
    </main>
  )
}
