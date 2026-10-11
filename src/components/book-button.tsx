import { BOOKING } from '@/config/site'

import { Button } from './button'

/** The one primary call to action. The link lives in src/config/site.ts. */
export function BookButton({
  light = false,
  block = false,
  withPrice = true,
  label = BOOKING.label,
}: {
  light?: boolean
  block?: boolean
  withPrice?: boolean
  label?: string
}) {
  return (
    <Button href={BOOKING.url} arrow="↗" light={light} block={block} track="book_click">
      {withPrice ? `${label} · ${BOOKING.price}` : label}
    </Button>
  )
}
