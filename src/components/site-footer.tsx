import { SITE } from '@/config/site'

export function SiteFooter() {
  return (
    <footer className="site-footer mono">
      <div>
        <strong>{SITE.legalName}</strong>
        <span>AI consulting · Philadelphia, PA</span>
      </div>
      <div>
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        <a href="/privacy">Privacy</a>
        <a href={SITE.personalSite}>andrarchy.com ↗</a>
      </div>
      <p className="footer-thesis">AI replaces meaningless work, not people.</p>
    </footer>
  )
}
