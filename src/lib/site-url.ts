export function getBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || 'https://superaicoach.com'

  return raw.endsWith('/') ? raw.slice(0, -1) : raw
}
