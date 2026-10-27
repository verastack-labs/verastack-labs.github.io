import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { liveFacets, pagePieces, pieces, workSlugs } from '@/data/pieces'
import { shareImage, site } from '@/data/site'
import { WorkIndex } from '@/app/work/work-index'
import { PiecePage } from '@/app/work/piece-page'

// One segment serves both the filtered views (/work/design/) and the piece pages (/work/whispr/);
// the pieces tests keep their slugs apart.
export const dynamicParams = false

export function generateStaticParams() {
  return workSlugs().map((slug) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const facet = liveFacets.find((f) => f.slug === slug)
  const piece = pagePieces.find((p) => p.slug === slug)
  const title = facet ? `${facet.title} · Work · VeraStack Labs` : piece ? `${piece.title} · VeraStack Labs` : ''
  const description = facet ? facet.lede : (piece?.line ?? '')
  if (!title) return {}
  const url = `${site.url}/work/${slug}/`
  const images = piece?.cover ? [{ url: piece.cover }] : [shareImage]
  return {
    title,
    description,
    alternates: { canonical: `/work/${slug}` },
    openGraph: { title, description, url, siteName: site.name, type: 'website', images },
    twitter: { card: 'summary_large_image', title, description, images },
  }
}

export default async function WorkSlugPage({ params }: Props) {
  const { slug } = await params
  const facet = liveFacets.find((f) => f.slug === slug)
  if (facet)
    return <WorkIndex title={facet.title} name={`${facet.title} by VeraStack Labs`} lede={facet.lede} path={`/work/${facet.slug}`} items={pieces.filter(facet.filter)} active={facet.slug} />
  const piece = pagePieces.find((p) => p.slug === slug)
  if (!piece) notFound()
  return <PiecePage piece={piece} />
}
