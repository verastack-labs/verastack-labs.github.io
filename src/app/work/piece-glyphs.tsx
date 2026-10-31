import type { DetailGlyph } from '@/data/pieces'

// Line glyphs for a piece's small details, drawn on a 24 grid in the piece's accent.
const paths: Record<DetailGlyph, React.ReactNode> = {
  // A loudhailer, struck through.
  'no-ads': (
    <>
      <path d="M4 10v4h3l7 4V6l-7 4H4z" />
      <path d="M17.5 9.5a3.5 3.5 0 0 1 0 5" />
      <path d="M3 3l18 18" />
    </>
  ),
  // A price tag with a rupee mark.
  price: (
    <>
      <path d="M3 12V4h8l10 10-8 8L3 12z" />
      <path d="M10 9h5M10 11.5h5M12 9c2 0 2 2.5 0 2.5h-2l3.5 4" />
    </>
  ),
  // A capsule beside a cross.
  pharmacist: (
    <>
      <path d="M4.5 13.5l6-6a3.5 3.5 0 0 1 5 5l-6 6a3.5 3.5 0 0 1-5-5z" />
      <path d="M7.5 10.5l5 5" />
      <path d="M18.5 3v5M16 5.5h5" />
    </>
  ),
  // A gate with a padlock on it.
  gate: (
    <>
      <path d="M3 21V7M21 21V7M3 9h18M3 13h4M17 13h4" />
      <rect x="9" y="13" width="6" height="6" rx="1.2" />
      <path d="M10.5 13v-1.5a1.5 1.5 0 0 1 3 0V13" />
    </>
  ),
  // A note and a phone, side by side.
  cash: (
    <>
      <rect x="2.5" y="8" width="11" height="8" rx="1.5" />
      <circle cx="8" cy="12" r="1.8" />
      <rect x="15.5" y="4" width="6" height="16" rx="1.5" />
      <path d="M17.5 17h2" />
    </>
  ),
}

export function DetailGlyphArt({ glyph }: { glyph: DetailGlyph }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[glyph]}
    </svg>
  )
}
