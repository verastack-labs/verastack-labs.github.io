import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import { shareImage, site } from '@/data/site'
import { MotionAttribute } from '@/lib/motion/motion-attribute'
import { SmoothScroll } from '@/lib/motion/smooth-scroll'
import { SiteHeader } from '@/components/nav/site-header'
import { SiteFooter } from '@/components/footer/site-footer'
import { Offer } from '@/components/offer/offer'
import { tokensToCss } from '@/styles/tokens'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-bricolage',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: '/' },
  openGraph: { title: site.title, description: site.description, url: site.url, siteName: site.name, type: 'website', locale: 'en_IN', images: [shareImage] },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description, images: [shareImage] },
  robots: { index: true, follow: true },
  verification: { google: site.googleSiteVerification },
  // The SVG for browsers, PNGs for iOS and for crawlers that skip SVG.
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export const viewport: Viewport = { themeColor: '#0B0C0A', colorScheme: 'dark' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${jetbrains.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: tokensToCss() }} />
      </head>
      <body className="min-h-dvh bg-ink text-text">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-signal focus:px-3 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <MotionAttribute />
        <SmoothScroll />
        <SiteHeader />
        {children}
        <SiteFooter />
        <Offer />
        {/* Production only, so dev-server visits never count. */}
        {site.analyticsToken && process.env.NODE_ENV === 'production' && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: site.analyticsToken })}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
