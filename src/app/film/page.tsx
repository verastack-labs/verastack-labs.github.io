import type { Metadata } from 'next'
import { Forward } from '@/app/ai-search-check/forward'

// The launch film lived here from 2026-10-21 until /films replaced it the same week. The link went
// out in messages, so this page forwards to the films page.
export const metadata: Metadata = {
  title: 'Moved: films · VeraStack Labs',
  alternates: { canonical: '/films' },
  robots: { index: false, follow: true },
}

export default function MovedFilm() {
  return (
    <main id="main" style={{ padding: '160px 24px', textAlign: 'center' }}>
      <noscript>
        <meta httpEquiv="refresh" content="0; url=/films/" />
      </noscript>
      <Forward to="/films/" />
      <p>
        The film has moved: <a href="/films/">watch it on our films page</a>.
      </p>
    </main>
  )
}
