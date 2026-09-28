import { ImageResponse } from 'next/og'
import { tokens } from '@/styles/tokens'

// The favicon (a signal slash on ink) drawn as a PNG for platforms that ignore SVG icons. Mirrors
// src/app/icon.svg: a 9/64-wide stroke from (38, 12) to (26, 52), round caps.
export function iconImage(size: number, rounded: boolean): ImageResponse {
  const k = size / 64
  const length = Math.hypot(12, 40) + 9
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: tokens.ink,
          borderRadius: rounded ? 14 * k : 0,
        }}
      >
        <div
          style={{
            width: 9 * k,
            height: length * k,
            borderRadius: 4.5 * k,
            background: tokens.signal,
            transform: `rotate(${(Math.atan2(12, 40) * 180) / Math.PI}deg)`,
          }}
        />
      </div>
    ),
    { width: size, height: size },
  )
}
