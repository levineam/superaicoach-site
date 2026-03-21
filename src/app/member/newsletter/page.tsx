import Link from 'next/link'
import { CalendarDays, ChevronRight, Mail } from 'lucide-react'

import { listNewsletters } from '@/lib/newsletters'

export const dynamic = 'force-dynamic'

export default function NewsletterPage() {
  const newsletters = listNewsletters()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Newsletter archive
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Daily AI briefings: what shipped, one practical lesson, and the tool that
          mattered most that day.
        </p>
      </div>

      {newsletters.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <Mail className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h2 className="text-lg font-semibold text-foreground">No issues yet</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Approved newsletters will land here once the first brief is reviewed and
            published.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {newsletters.map((newsletter) => (
            <Link
              key={newsletter.slug}
              href={`/member/newsletter/${newsletter.slug}`}
              className="group rounded-2xl border border-border bg-card/60 p-6 transition hover:border-foreground/20 hover:bg-card"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {newsletter.date}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {newsletter.title}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                      {newsletter.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-foreground transition group-hover:translate-x-0.5">
                  Read issue
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
