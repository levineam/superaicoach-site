import type { NextConfig } from 'next'

/** Old routes from the coaching/membership app (before October 2026). All permanent (308). */
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
  '/philadelphia',
  '/philly',
]

/** Retired use-case pages that have a matching skill. Everything else goes to /skills. */
const useCaseToSkill: Record<string, string> = {
  'ria-client-review-prep-brief': 'meeting-prep-brief',
  'personal-chief-of-staff-inbox-calendar': 'monday-plan',
  'law-intake-call-to-matter-summary': 'call-follow-ups',
  'office-meeting-notes-action-items': 'call-follow-ups',
  'agency-kickoff-call-to-creative-brief': 'call-follow-ups',
  'ria-meeting-notes-to-crm': 'call-follow-ups',
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      ...toHome.map((source) => ({ source, destination: '/', permanent: true })),
      { source: '/about', destination: '/#about', permanent: true },
      { source: '/why', destination: '/#about', permanent: true },
      { source: '/faq', destination: '/#questions', permanent: true },
      { source: '/contact', destination: '/#book', permanent: true },
      { source: '/book', destination: '/#book', permanent: true },
      { source: '/business', destination: '/#how', permanent: true },
      { source: '/services', destination: '/#how', permanent: true },
      { source: '/pricing', destination: '/#how', permanent: true },
      ...Object.entries(useCaseToSkill).map(([slug, skill]) => ({
        source: `/use-cases/${slug}`,
        destination: `/skills#${skill}`,
        permanent: true,
      })),
      { source: '/use-cases', destination: '/skills', permanent: true },
      { source: '/use-cases/:path*', destination: '/skills', permanent: true },
      // Parked, not retired: temporary so it can come back without fighting browser caches.
      { source: '/membership', destination: '/', permanent: false },
    ]
  },
}

export default nextConfig
