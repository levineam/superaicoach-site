# superaicoach.com

Lean marketing site for SuperAICoach: AI consulting services for Philadelphia small and
medium businesses. Linked from andrarchy.com as "AI Consulting Services" and styled to match it
(ink / paper / lime palette, Arial + Georgia + Courier New, andrarchy "Instrument" buttons).

Static Next.js (App Router). No database, no auth, no API routes, no env secrets.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Where things live

- `src/config/site.ts`: prices, plans, FAQ, contact email, and **the free-consult booking
  link and length** (`BOOKING.url`, `CONSULT_MINUTES`). Every "Book" button reads from it.
- `src/lib/schema.ts`: LocalBusiness / ProfessionalService and FAQPage JSON-LD.
- `next.config.ts`: permanent redirects for routes from the old coaching/membership site.
- Optional analytics: set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel. Book clicks send a
  `book_click` event.

The previous app (membership, Mission Control, chat demos) is preserved at tag
`v1-coaching-archive`.
