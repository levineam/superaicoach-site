import { SITE } from '@/config/site'

export function AffiliateDisclosure() {
  return (
    <p className="uc-disclosure mono">
      Disclosure: some tool links may be affiliate links. If you sign up through one, I may earn a
      commission at no extra cost to you. It doesn’t change what I recommend.
    </p>
  )
}

/** Small, unobtrusive footer for the library pages. */
export function LibraryFooter() {
  return (
    <div className="uc-library-footer mono">
      <p>
        Tools are listed because they fit the job, not because anyone paid. Names checked October
        2026; products change fast, so confirm current features and pricing with the vendor.
      </p>
      <a href={`mailto:${SITE.email}?subject=Sponsor%20the%20AI%20use%20case%20library`}>
        Sponsor this library →
      </a>
    </div>
  )
}
