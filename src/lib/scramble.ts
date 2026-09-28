// Glyphs from the brand mockups: code-like, never letters, so a scrambling label reads as decoding.
export const SCRAMBLE_CHARS = '!<>-_[]{}=+*^?#'

// One frame of a decoding label: characters before `progress` (0 to 1) show for real, the rest
// are random glyphs. Slashes, spaces and punctuation stay put so the path keeps its shape.
export function scrambleFrame(text: string, progress: number, random: () => number = Math.random): string {
  const resolved = Math.floor(text.length * Math.min(Math.max(progress, 0), 1))
  return [...text]
    .map((char, index) => {
      if (index < resolved || !/[\p{L}\p{N}]/u.test(char)) return char
      return SCRAMBLE_CHARS[Math.floor(random() * SCRAMBLE_CHARS.length)]
    })
    .join('')
}
