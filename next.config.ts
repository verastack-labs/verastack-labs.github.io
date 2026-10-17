import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // Dev only: lets a phone on the same Wi-Fi load the dev server by the laptop's address, for testing
  // on real devices (http://192.168.0.2:3100). Never affects the exported site.
  allowedDevOrigins: ['192.168.0.2'],
}

export default nextConfig
