import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/extensions/:file*.mcpb',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/vnd.anthropic.mcpb',
          },
          {
            key: 'Content-Disposition',
            value: 'attachment',
          },
        ],
      },
    ];
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
    ];
  },
};

export default nextConfig;
