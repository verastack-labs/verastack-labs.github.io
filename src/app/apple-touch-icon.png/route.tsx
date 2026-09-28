import { iconImage } from '@/lib/icon-image'

export const dynamic = 'force-static'

// iOS masks its own corners, so this one is square.
export function GET() {
  return iconImage(180, false)
}
