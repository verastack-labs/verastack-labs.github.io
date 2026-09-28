import { ImageResponse } from 'next/og'
import { hero } from '@/data/hero'
import { tokens } from '@/styles/tokens'

export const dynamic = 'force-static'

const size = { width: 1200, height: 630 }

// Bricolage at the display cut, subset to the characters drawn. Fetched once at build time (the
// image generator needs a TrueType file, which next/font does not expose).
async function bricolage(weight: number, text: string): Promise<ArrayBuffer> {
  const query = `family=Bricolage+Grotesque:opsz,wght@96,${weight}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(`https://fonts.googleapis.com/css2?${query}`)).text()
  const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1]
  if (!url) throw new Error('Bricolage Grotesque: no TrueType source in the font CSS')
  return (await fetch(url)).arrayBuffer()
}

// The share image, written to out/og.png at build time so GitHub Pages serves it as a PNG: the
// wordmark, the hero line and a field of dots echoing the hero.
export async function GET() {
  const wordmark = { lead: 'verastack', slash: '/', tail: 'labs' }
  const words = `${hero.lead}${hero.accent}${hero.tail}`.split(' ').filter(Boolean)
  const text = words.join('') + wordmark.lead + wordmark.slash + wordmark.tail
  const [bold, medium] = await Promise.all([bricolage(800, text), bricolage(500, wordmark.tail)])

  const dots = Array.from({ length: 16 * 9 }, (_, i) => {
    const x = i % 16
    const y = Math.floor(i / 16)
    const d = Math.hypot(x - 11.5, y - 3.5)
    const crest = d < 2.6
    return { x, y, r: crest ? 7 : Math.max(2, 5 - d * 0.35), on: crest }
  })

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: tokens.ink, color: tokens.text, position: 'relative', fontFamily: 'Bricolage' }}>
        {dots.map((d, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 560 + d.x * 40 - d.r,
              top: 40 + d.y * 40 - d.r,
              width: d.r * 2,
              height: d.r * 2,
              borderRadius: d.r,
              background: d.on ? tokens.signal : '#3B3E35',
            }}
          />
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, width: '100%' }}>
          <div style={{ display: 'flex', fontSize: 42, fontWeight: 800, letterSpacing: -1.5 }}>
            {wordmark.lead}
            <span style={{ color: tokens.signal }}>{wordmark.slash}</span>
            <span style={{ opacity: 0.55, fontWeight: 500 }}>{wordmark.tail}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: 900, fontSize: 84, fontWeight: 800, lineHeight: 0.92, letterSpacing: -4 }}>
            {words.map((w, i) => (
              <span key={i} style={{ marginRight: 22, color: w === hero.accent ? tokens.signal : tokens.text }}>
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Bricolage', data: bold, weight: 800, style: 'normal' },
        { name: 'Bricolage', data: medium, weight: 500, style: 'normal' },
      ],
    },
  )
}
