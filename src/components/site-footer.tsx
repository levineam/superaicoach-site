import { SITE } from '@/config/site'

export function SiteFooter() {
  return (
    <footer className="site-footer mono">
      <div>
        <strong>{SITE.legalName}</strong>
        <span>AI coaching · Philadelphia, PA</span>
      </div>
      <div>
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        <a href="/skills">Free skills</a>
        <a href="/privacy">Privacy</a>
        <a href={SITE.personalSite}>andrarchy.com ↗</a>
      </div>
    </footer>
  )
}
