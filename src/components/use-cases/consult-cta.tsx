import { BookButton } from '@/components/book-button'
import { BOOKING } from '@/config/site'

export function ConsultCta({ title = 'Want this set up?' }: { title?: string }) {
  return (
    <aside className="uc-cta" aria-label="Book a consult">
      <h2>
        {title} <em>Let’s talk.</em>
      </h2>
      <p>
        Book a free {BOOKING.duration} consult. Tell me about your firm and I’ll tell you honestly
        whether this is worth doing, and what I’d set up first.
      </p>
      <BookButton light />
    </aside>
  )
}
