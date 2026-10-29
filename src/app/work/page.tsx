import type { Metadata } from 'next'
import { pieces } from '@/data/pieces'
import { shareImage, site } from '@/data/site'
import { WorkIndex } from '@/app/work/work-index'

const title = 'Work · VeraStack Labs'
const description = 'Client launches, the products we run ourselves and concepts we make to show what a launch could look like, in one place.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/work' },
  openGraph: { title, description, url: `${site.url}/work/`, siteName: site.name, type: 'website', images: [shareImage] },
  twitter: { card: 'summary_large_image', title, description, images: [shareImage] },
}

export default function WorkPage() {
  return (
    <WorkIndex
      title={
        <>
          Everything we make,
          <br />
          <em>in one place.</em>
        </>
      }
      name="Work by VeraStack Labs"
      lede={description}
      path="/work"
      items={pieces}
      active={null}
    />
  )
}
