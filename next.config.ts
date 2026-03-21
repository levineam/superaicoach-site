import path from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      {
        source: '/ai-team',
        destination: '/mission-control/andrew/ai-team',
        permanent: false,
      },
      {
        source: '/jarvis',
        destination: '/mission-control/andrew/jarvis',
        permanent: false,
      },
      {
        source: '/project-board',
        destination: '/mission-control/andrew/project-board',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: '/mission-control/andrew/dashboard',
        permanent: false,
      },
      {
        source: '/mission-control',
        destination: '/mission-control/andrew/dashboard',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
