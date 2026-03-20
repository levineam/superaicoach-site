import { Mail } from 'lucide-react'

export default function NewsletterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Newsletter Archive
        </h1>
        <p className="mt-2 text-muted-foreground">
          Daily AI briefings — what shipped, tips you can use today, and tool spotlights.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <Mail className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <h2 className="text-lg font-semibold text-foreground">
          Coming soon
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          The daily AI briefing newsletter is in development. You&apos;ll find the full
          archive here once it launches.
        </p>
      </div>
    </div>
  )
}
