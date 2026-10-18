import type { NextConfig } from 'next'

/** Old routes from the coaching/membership site. All permanent (308). */
const toHome = [
  '/sign-in',
  '/sign-up',
  '/auth/:path*',
  '/member',
  '/member/:path*',
  '/mission-control',
  '/mission-control/:path*',
  '/dashboard',
  '/ai-team',
  '/jarvis',
  '/project-board',
  '/meet-jarvis',
  '/cowork',
  '/resources',
  '/resources/:path*',
  '/extensions/:path*',
  '/install/:path*',
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      ...toHome.map((source) => ({ source, destination: '/', permanent: true })),
      { source: '/business', destination: '/#plans', permanent: true },
      { source: '/services', destination: '/#plans', permanent: true },
      { source: '/pricing', destination: '/#plans', permanent: true },
      { source: '/philly', destination: '/philadelphia', permanent: true },
      { source: '/why', destination: '/about', permanent: true },
      { source: '/book', destination: '/contact', permanent: true },
    ]
  },
}

export default nextConfig
