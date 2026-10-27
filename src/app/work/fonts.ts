import { Plus_Jakarta_Sans, Sora } from 'next/font/google'
import type { PieceTheme } from '@/data/pieces'

// Display faces a piece can borrow from its own brand. The house face needs nothing extra.
const sora = Sora({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-piece', display: 'swap' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-piece', display: 'swap' })

export function pieceFont(font: PieceTheme['font']): string {
  if (font === 'sora') return sora.variable
  if (font === 'jakarta') return jakarta.variable
  return ''
}
