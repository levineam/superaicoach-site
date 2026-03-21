import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

import { getNewsletter } from '@/lib/newsletters'

export const dynamic = 'force-dynamic'

export default async function NewsletterIssuePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const newsletter = getNewsletter(slug)

  if (!newsletter) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <Link
        href="/member/newsletter"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to archive
      </Link>

      <article className="rounded-3xl border border-border bg-card/60 p-6 md:p-10">
        <header className="border-b border-border pb-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {newsletter.date}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {newsletter.title}
          </h1>
          {newsletter.summary ? (
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
              {newsletter.summary}
            </p>
          ) : null}
        </header>

        <div className="mt-8 space-y-5">
          {newsletter.blocks.map((block, index) => {
            if (block.type === 'heading') {
              if (block.level === 1) {
                return (
                  <h2 key={index} className="text-2xl font-semibold text-foreground">
                    {block.text}
                  </h2>
                )
              }

              if (block.level === 2) {
                return (
                  <h2 key={index} className="pt-2 text-xl font-semibold text-foreground">
                    {block.text}
                  </h2>
                )
              }

              return (
                <h3 key={index} className="pt-1 text-base font-semibold text-foreground">
                  {block.text}
                </h3>
              )
            }

            if (block.type === 'list') {
              return (
                <ul key={index} className="space-y-3 pl-5 text-base leading-7 text-foreground">
                  {block.items.map((item) => (
                    <li key={item} className="list-disc marker:text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              )
            }

            return (
              <p key={index} className="text-base leading-7 text-foreground">
                {block.text}
              </p>
            )
          })}
        </div>
      </article>
    </div>
  )
}
