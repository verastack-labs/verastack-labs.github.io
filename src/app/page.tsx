import { Suspense } from 'react'
import { Hero } from '@/scenes/hero/hero'
import { Services } from '@/scenes/services/services'
import { Work } from '@/scenes/work/work'
import { Products } from '@/scenes/products/products'
import { Process } from '@/scenes/process/process'
import { About } from '@/scenes/about/about'
import { Contact } from '@/scenes/contact/contact'

// Each scene below the hero is its own Suspense boundary, so React hydrates them one at a time and
// yields in between instead of in one long task that holds up the hero's first paints (LCP).
export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Suspense fallback={null}>
        <Services />
      </Suspense>
      <Suspense fallback={null}>
        <Work />
      </Suspense>
      <Suspense fallback={null}>
        <Products />
      </Suspense>
      <Suspense fallback={null}>
        <Process />
      </Suspense>
      <Suspense fallback={null}>
        <About />
      </Suspense>
      <Suspense fallback={null}>
        <Contact />
      </Suspense>
    </main>
  )
}
