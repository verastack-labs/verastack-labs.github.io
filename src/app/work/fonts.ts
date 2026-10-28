import { Archivo, Azeret_Mono, Geist, Geist_Mono, Inter, JetBrains_Mono, Plus_Jakarta_Sans, Sora, Space_Grotesk } from 'next/font/google'
import type { PieceFont, PieceMono } from '@/data/pieces'

// Faces a piece can borrow from its own brand. The house faces need nothing extra. Font files only
// download on the page that uses them.
const sora = Sora({ subsets: ['latin'], weight: ['400', '600', '700', '800'], variable: '--font-piece', display: 'swap' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '600', '700', '800'], variable: '--font-piece', display: 'swap' })
const archivo = Archivo({ subsets: ['latin'], variable: '--font-piece', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-piece', display: 'swap' })
const geist = Geist({ subsets: ['latin'], variable: '--font-piece', display: 'swap' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-piece', display: 'swap' })

const azeret = Azeret_Mono({ subsets: ['latin'], variable: '--font-piece-mono', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-piece-mono', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-piece-mono', display: 'swap' })

const faces: Record<Exclude<PieceFont, 'house'>, string> = {
  sora: sora.variable,
  jakarta: jakarta.variable,
  archivo: archivo.variable,
  inter: inter.variable,
  geist: geist.variable,
  'space-grotesk': spaceGrotesk.variable,
}
const monos: Record<Exclude<PieceMono, 'house'>, string> = { azeret: azeret.variable, jetbrains: jetbrains.variable, 'geist-mono': geistMono.variable }

export function pieceFont(font: PieceFont, mono: PieceMono = 'house'): string {
  return [font === 'house' ? '' : faces[font], mono === 'house' ? '' : monos[mono]].filter(Boolean).join(' ')
}
