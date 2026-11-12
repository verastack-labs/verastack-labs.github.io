import { Archivo, Azeret_Mono, Familjen_Grotesk, Geist, Geist_Mono, Gloock, Hanken_Grotesk, Inter, JetBrains_Mono, Lora, Playfair_Display, Plus_Jakarta_Sans, Sora, Space_Grotesk } from 'next/font/google'
import type { PieceFont, PieceMono } from '@/data/pieces'

// Faces a piece can borrow from its own brand. The house faces need nothing extra. Font files only
// download on the page that uses them.
const sora = Sora({ subsets: ['latin'], weight: ['400', '600', '700', '800'], variable: '--font-piece', display: 'swap' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '600', '700', '800'], variable: '--font-piece', display: 'swap' })
const archivo = Archivo({ subsets: ['latin'], variable: '--font-piece', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-piece', display: 'swap' })
const geist = Geist({ subsets: ['latin'], variable: '--font-piece', display: 'swap' })
const familjen = Familjen_Grotesk({ subsets: ['latin'], variable: '--font-piece', display: 'swap' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-piece', display: 'swap' })

// Lora for reading, Playfair Display for headings: the pair Wingmann's posts are set in.
const lora = Lora({ subsets: ['latin'], variable: '--font-piece', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-piece-display', display: 'swap' })

// Hanken Grotesk for reading, Gloock for headings: Kulra's pair.
const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-piece', display: 'swap' })
const gloock = Gloock({ subsets: ['latin'], weight: '400', variable: '--font-piece-display', display: 'swap' })

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
  familjen: familjen.variable,
  lora: `${lora.variable} ${playfair.variable}`,
  hanken: `${hanken.variable} ${gloock.variable}`,
}
const monos: Record<Exclude<PieceMono, 'house'>, string> = { azeret: azeret.variable, jetbrains: jetbrains.variable, 'geist-mono': geistMono.variable }

export function pieceFont(font: PieceFont, mono: PieceMono = 'house'): string {
  return [font === 'house' ? '' : faces[font], mono === 'house' ? '' : monos[mono]].filter(Boolean).join(' ')
}
