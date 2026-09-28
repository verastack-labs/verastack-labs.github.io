import type { ReactNode } from 'react'
import { tokensToCss } from '@/styles/tokens'
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: tokensToCss() }} />
      </head>
      <body className="min-h-dvh bg-ink text-text">{children}</body>
    </html>
  )
}
