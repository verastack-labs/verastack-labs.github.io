import type { Metadata } from 'next'
import { checker } from '@/data/ai-search-check'
import { Forward } from '@/app/ai-search-check/forward'

// The checker moved to /tools/ai-search-check on 2026-10-18. Shared links (many with ?url=) and the
// blog posts other sites quote still point here, so this page forwards them, keeping the query.
export const metadata: Metadata = {
  title: 'Moved: AEO and GEO check · VeraStack Labs',
  alternates: { canonical: checker.path },
  robots: { index: false, follow: true },
}

export default function MovedChecker() {
  return (
    <main id="main" style={{ padding: '160px 24px', textAlign: 'center' }}>
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=${checker.path}/`} />
      </noscript>
      <Forward to={`${checker.path}/`} />
      <p>
        The check has moved: <a href={`${checker.path}/`}>open the AEO and GEO check</a>.
      </p>
    </main>
  )
}
